import { Controller, Get, Query } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiQuery 
} from '@nestjs/swagger';
import { TrendingService } from './trending.service';

@ApiTags('trending')
@Controller('trending')
export class TrendingController {
  constructor(private readonly trendingService: TrendingService) {}

  @Get()
  @ApiOperation({ summary: 'Get trending articles' })
  @ApiQuery({ name: 'limit', required: false, description: 'Maximum number of trending articles to return (default: 10)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Trending articles retrieved successfully',
    schema: {
      example: [
        {
          id: "uuid",
          title: "Breaking: Major Tech Breakthrough",
          summary: "Revolutionary development shakes the tech industry",
          url: "https://example.com/breaking-news",
          publishedAt: "2024-01-01T00:00:00.000Z",
          category: { name: "Technology", slug: "technology" },
          viewCount: 15420,
          trendingScore: 0.98
        },
        {
          id: "uuid",
          title: "Global Climate Summit Results",
          summary: "World leaders reach historic agreement",
          url: "https://example.com/climate-summit",
          publishedAt: "2024-01-01T00:00:00.000Z",
          category: { name: "Environment", slug: "environment" },
          viewCount: 12890,
          trendingScore: 0.94
        }
      ]
    }
  })
  async getTrending(@Query('limit') limit?: number) {
    return this.trendingService.getTrendingArticles(limit);
  }
}
