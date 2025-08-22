import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from '../database/entities/bookmark.entity';
import { Article } from '../database/entities/article.entity';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark)
    private readonly bookmarkRepository: Repository<Bookmark>,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async findUserBookmarks(userId: string, page = 1, limit = 20) {
    const queryBuilder = this.bookmarkRepository
      .createQueryBuilder('bookmark')
      .leftJoinAndSelect('bookmark.article', 'article')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.feed', 'feed')
      .where('bookmark.userId = :userId', { userId })
      .orderBy('bookmark.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [bookmarks, total] = await queryBuilder.getManyAndCount();

    return {
      bookmarks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createBookmark(userId: string, articleId: string, notes?: string) {
    // Check if article exists
    const article = await this.articleRepository.findOne({
      where: { id: articleId },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // Check if bookmark already exists
    const existingBookmark = await this.bookmarkRepository.findOne({
      where: { userId, articleId },
    });

    if (existingBookmark) {
      throw new ConflictException('Article already bookmarked');
    }

    const bookmark = this.bookmarkRepository.create({
      userId,
      articleId,
      notes,
    });

    const savedBookmark = await this.bookmarkRepository.save(bookmark);

    // Increment bookmark count on article
    await this.articleRepository.update(articleId, {
      bookmarkCount: article.bookmarkCount + 1,
    });

    return savedBookmark;
  }

  async removeBookmark(userId: string, articleId: string) {
    const bookmark = await this.bookmarkRepository.findOne({
      where: { userId, articleId },
    });

    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }

    await this.bookmarkRepository.remove(bookmark);

    // Decrement bookmark count on article
    const article = await this.articleRepository.findOne({
      where: { id: articleId },
    });

    if (article) {
      await this.articleRepository.update(articleId, {
        bookmarkCount: Math.max(0, article.bookmarkCount - 1),
      });
    }

    return { message: 'Bookmark removed successfully' };
  }

  async isBookmarked(userId: string, articleId: string): Promise<boolean> {
    const bookmark = await this.bookmarkRepository.findOne({
      where: { userId, articleId },
    });

    return !!bookmark;
  }
}
