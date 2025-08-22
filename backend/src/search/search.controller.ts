import { Controller, Get, Query } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiQuery 
} from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Search articles by keyword' })
  @ApiQuery({ name: 'q', description: 'Search query string', required: true })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiResponse({ 
    status: 200, 
    description: 'Search results retrieved successfully',
    schema: {
      example: {
        articles: [
          {
            id: "uuid",
            title: "AI Revolution in Healthcare",
            summary: "How artificial intelligence is transforming medical care",
            url: "https://example.com/ai-healthcare",
            publishedAt: "2024-01-01T00:00:00.000Z",
            category: { name: "Technology", slug: "technology" },
            relevanceScore: 0.95
          }
        ],
        query: "AI healthcare",
        total: 42,
        page: 1,
        limit: 10
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid search query' })
  async search(
    @Query('q') query: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.searchService.search(query, page, limit);
  }
}
