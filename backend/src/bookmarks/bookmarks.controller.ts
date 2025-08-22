import { Controller, Get, Post, Delete, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookmarksService } from './bookmarks.service';

@Controller('bookmarks')
@UseGuards(AuthGuard('jwt'))
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Get()
  async getUserBookmarks(
    @Request() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.bookmarksService.findUserBookmarks(req.user.id, page, limit);
  }

  @Post()
  async createBookmark(
    @Request() req: any,
    @Body('articleId') articleId: string,
    @Body('notes') notes?: string,
  ) {
    return this.bookmarksService.createBookmark(req.user.id, articleId, notes);
  }

  @Delete(':articleId')
  async removeBookmark(
    @Request() req: any,
    @Param('articleId') articleId: string,
  ) {
    return this.bookmarksService.removeBookmark(req.user.id, articleId);
  }

  @Get('check/:articleId')
  async checkBookmark(
    @Request() req: any,
    @Param('articleId') articleId: string,
  ) {
    const isBookmarked = await this.bookmarksService.isBookmarked(req.user.id, articleId);
    return { isBookmarked };
  }
}
