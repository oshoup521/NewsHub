import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import RSSParser from 'rss-parser';
import { Feed } from '../database/entities/feed.entity';
import { Article } from '../database/entities/article.entity';
import { Category } from '../database/entities/category.entity';

interface ParsedArticle {
  title: string;
  description?: string;
  content?: string;
  url: string;
  imageUrl?: string;
  author?: string;
  publishedAt?: Date;
}

@Injectable()
export class FeedParserService {
  private readonly logger = new Logger(FeedParserService.name);
  private readonly parser: RSSParser;
  private readonly maxArticlesPerFeed: number;

  constructor(
    @InjectRepository(Feed)
    private readonly feedRepository: Repository<Feed>,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly configService: ConfigService,
  ) {
    this.parser = new RSSParser({
      timeout: 10000,
      maxRedirects: 5,
      headers: {
        'User-Agent': 'NewsHub RSS Parser 1.0',
      },
    });
    this.maxArticlesPerFeed = this.configService.get('NEWSHUB_MAX_ARTICLES_PER_FEED', 100);
  }

  // Run every hour
  @Cron(CronExpression.EVERY_HOUR)
  async parseAllFeeds(): Promise<void> {
    this.logger.log('🔄 Starting scheduled RSS feed parsing...');
    
    try {
      const feeds = await this.feedRepository.find({
        where: { isActive: true },
        relations: ['category'],
      });

      if (feeds.length === 0) {
        this.logger.warn('⚠️ No active feeds found');
        return;
      }

      this.logger.log(`📰 Found ${feeds.length} active feeds to parse`);

      const results = await Promise.allSettled(
        feeds.map(feed => this.parseSingleFeed(feed))
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      this.logger.log(`✅ RSS parsing completed: ${successful} successful, ${failed} failed`);
    } catch (error) {
      this.logger.error('❌ Error during scheduled RSS parsing:', error);
    }
  }

  async parseSingleFeed(feed: Feed): Promise<number> {
    this.logger.log(`🔍 Parsing feed: ${feed.name} (${feed.url})`);
    
    try {
      const parsed = await this.parser.parseURL(feed.url);
      
      if (!parsed.items || parsed.items.length === 0) {
        this.logger.warn(`⚠️ No items found in feed: ${feed.name}`);
        await this.updateFeedStats(feed, true);
        return 0;
      }

      const articles: ParsedArticle[] = parsed.items
        .slice(0, this.maxArticlesPerFeed)
        .map(item => this.transformFeedItem(item));

      let newArticleCount = 0;

      for (const articleData of articles) {
        try {
          // Check if article already exists
          const existingArticle = await this.articleRepository.findOne({
            where: { url: articleData.url }
          });

          if (existingArticle) {
            continue; // Skip if already exists
          }

          // Create new article
          const article = this.articleRepository.create({
            ...articleData,
            feedId: feed.id,
            categoryId: feed.categoryId,
            isActive: true,
          });

          await this.articleRepository.save(article);
          newArticleCount++;
          
        } catch (articleError) {
          this.logger.error(`❌ Error saving article: ${articleData.title}`, articleError);
        }
      }

      await this.updateFeedStats(feed, true);
      
      this.logger.log(`✅ Feed parsed successfully: ${feed.name} - ${newArticleCount} new articles`);
      return newArticleCount;
      
    } catch (error) {
      this.logger.error(`❌ Error parsing feed: ${feed.name}`, error);
      await this.updateFeedStats(feed, false, error.message);
      throw error;
    }
  }

  private transformFeedItem(item: any): ParsedArticle {
    // Extract content (try different fields)
    const content = item.content || item['content:encoded'] || item.description || '';
    
    // Extract image URL
    let imageUrl: string | undefined;
    if (item.enclosure && item.enclosure.url && item.enclosure.type?.startsWith('image/')) {
      imageUrl = item.enclosure.url;
    } else if (item.mediaContent && item.mediaContent.$ && item.mediaContent.$.url) {
      imageUrl = item.mediaContent.$.url;
    } else if (item['media:content'] && item['media:content'].$ && item['media:content'].$.url) {
      imageUrl = item['media:content'].$.url;
    } else {
      // Try to extract image from content/description
      const imgMatch = content.match(/<img[^>]+src="([^">]+)"/i);
      if (imgMatch) {
        imageUrl = imgMatch[1];
      }
    }

    // Parse published date
    let publishedAt: Date | undefined;
    if (item.pubDate) {
      publishedAt = new Date(item.pubDate);
    } else if (item.isoDate) {
      publishedAt = new Date(item.isoDate);
    }

    // Clean up description (remove HTML tags)
    const description = item.contentSnippet || 
      (item.description ? item.description.replace(/<[^>]*>/g, '').substring(0, 500) : undefined);

    return {
      title: item.title?.trim() || 'Untitled',
      description: description?.trim(),
      content: this.cleanContent(content),
      url: item.link?.trim() || item.guid?.trim(),
      imageUrl,
      author: item.creator || item.author,
      publishedAt: publishedAt && !isNaN(publishedAt.getTime()) ? publishedAt : new Date(),
    };
  }

  private cleanContent(content: string): string {
    if (!content) return '';
    
    // Remove script and style tags completely
    content = content.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '');
    
    // Clean up HTML but preserve structure
    content = content
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<p[^>]*>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    return content.substring(0, 10000); // Limit content length
  }

  private async updateFeedStats(feed: Feed, success: boolean, errorMessage?: string): Promise<void> {
    try {
      feed.lastFetched = new Date();
      feed.fetchCount = (feed.fetchCount || 0) + 1;
      
      if (success) {
        feed.errorCount = 0;
        feed.lastError = null;
      } else {
        feed.errorCount = (feed.errorCount || 0) + 1;
        feed.lastError = errorMessage?.substring(0, 1000);
      }

      await this.feedRepository.save(feed);
    } catch (error) {
      this.logger.error(`❌ Error updating feed stats for ${feed.name}:`, error);
    }
  }

  // Manual API method to trigger parsing
  async parseAllFeedsManually(): Promise<{ success: boolean; message: string; stats: any }> {
    this.logger.log('🚀 Manual RSS feed parsing triggered');
    
    try {
      const feeds = await this.feedRepository.find({
        where: { isActive: true },
        relations: ['category'],
      });

      if (feeds.length === 0) {
        return {
          success: false,
          message: 'No active feeds found',
          stats: { totalFeeds: 0, successful: 0, failed: 0, newArticles: 0 }
        };
      }

      const startTime = Date.now();
      const results = await Promise.allSettled(
        feeds.map(feed => this.parseSingleFeed(feed))
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      const newArticles = results
        .filter(r => r.status === 'fulfilled')
        .reduce((sum, r) => sum + (r.value as number), 0);

      const duration = Date.now() - startTime;

      return {
        success: true,
        message: `Parsed ${feeds.length} feeds in ${duration}ms`,
        stats: {
          totalFeeds: feeds.length,
          successful,
          failed,
          newArticles,
          duration
        }
      };
      
    } catch (error) {
      this.logger.error('❌ Error during manual RSS parsing:', error);
      return {
        success: false,
        message: `Error: ${error.message}`,
        stats: { totalFeeds: 0, successful: 0, failed: 0, newArticles: 0 }
      };
    }
  }

  async parseFeedById(feedId: number): Promise<{ success: boolean; message: string; newArticles?: number }> {
    this.logger.log(`🎯 Manual parsing requested for feed ID: ${feedId}`);
    
    try {
      const feed = await this.feedRepository.findOne({
        where: { id: feedId, isActive: true },
        relations: ['category'],
      });

      if (!feed) {
        return {
          success: false,
          message: 'Feed not found or inactive'
        };
      }

      const newArticles = await this.parseSingleFeed(feed);
      
      return {
        success: true,
        message: `Successfully parsed feed: ${feed.name}`,
        newArticles
      };
      
    } catch (error) {
      this.logger.error(`❌ Error parsing feed ${feedId}:`, error);
      return {
        success: false,
        message: `Error: ${error.message}`
      };
    }
  }
}
