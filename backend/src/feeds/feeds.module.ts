import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feed } from '../database/entities/feed.entity';
import { Article } from '../database/entities/article.entity';
import { Category } from '../database/entities/category.entity';
import { FeedsService } from './feeds.service';
import { FeedsController } from './feeds.controller';
import { FeedParserService } from './feed-parser.service';

@Module({
  imports: [TypeOrmModule.forFeature([Feed, Article, Category])],
  providers: [FeedsService, FeedParserService],
  controllers: [FeedsController],
  exports: [FeedsService, FeedParserService],
})
export class FeedsModule {}
