import { Controller, Get, Post, Delete, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth 
} from '@nestjs/swagger';
import { BookmarksService } from './bookmarks.service';

@ApiTags('bookmarks')
@ApiBearerAuth('JWT-auth')
@Controller('bookmarks')
@UseGuards(AuthGuard('jwt'))
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Get()
  @ApiOperation({ summary: 'Get user bookmarks with pagination' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiResponse({ 
    status: 200, 
    description: 'Bookmarks retrieved successfully',
    schema: {
      example: {
        bookmarks: [
          {
            id: "uuid",
            notes: "Interesting article about AI",
            createdAt: "2024-01-01T00:00:00.000Z",
            article: {
              id: "uuid",
              title: "AI Revolution",
              summary: "Latest developments in AI",
              url: "https://example.com/article"
            }
          }
        ],
        total: 25,
        page: 1,
        limit: 10
      }
    }
  })
  async getUserBookmarks(
    @Request() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.bookmarksService.findUserBookmarks(req.user.id, page, limit);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new bookmark' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        articleId: { type: 'string', description: 'Article ID to bookmark' },
        notes: { type: 'string', description: 'Optional notes for the bookmark' }
      },
      required: ['articleId']
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Bookmark created successfully',
    schema: {
      example: {
        id: "uuid",
        notes: "Interesting article",
        createdAt: "2024-01-01T00:00:00.000Z",
        article: {
          id: "uuid",
          title: "Sample Article",
          url: "https://example.com/article"
        }
      }
    }
  })
  @ApiResponse({ status: 409, description: 'Article already bookmarked' })
  async createBookmark(
    @Request() req: any,
    @Body('articleId') articleId: string,
    @Body('notes') notes?: string,
  ) {
    return this.bookmarksService.createBookmark(req.user.id, articleId, notes);
  }

  @Delete(':articleId')
  @ApiOperation({ summary: 'Remove a bookmark' })
  @ApiParam({ name: 'articleId', description: 'Article ID to remove from bookmarks' })
  @ApiResponse({ status: 200, description: 'Bookmark removed successfully' })
  @ApiResponse({ status: 404, description: 'Bookmark not found' })
  async removeBookmark(
    @Request() req: any,
    @Param('articleId') articleId: string,
  ) {
    return this.bookmarksService.removeBookmark(req.user.id, articleId);
  }

  @Get('check/:articleId')
  @ApiOperation({ summary: 'Check if article is bookmarked' })
  @ApiParam({ name: 'articleId', description: 'Article ID to check' })
  @ApiResponse({ 
    status: 200, 
    description: 'Bookmark status retrieved',
    schema: {
      example: { isBookmarked: true }
    }
  })
  async checkBookmark(
    @Request() req: any,
    @Param('articleId') articleId: string,
  ) {
    const isBookmarked = await this.bookmarksService.isBookmarked(req.user.id, articleId);
    return { isBookmarked };
  }
}
