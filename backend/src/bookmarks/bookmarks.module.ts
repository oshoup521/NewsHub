import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookmark } from '../database/entities/bookmark.entity';
import { Article } from '../database/entities/article.entity';
import { BookmarksService } from './bookmarks.service';
import { BookmarksController } from './bookmarks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Bookmark, Article])],
  providers: [BookmarksService],
  controllers: [BookmarksController],
  exports: [BookmarksService],
})
export class BookmarksModule {}
