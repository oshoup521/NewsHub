import { Controller, Get, Param } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam 
} from '@nestjs/swagger';
import { FeedsService } from './feeds.service';

@ApiTags('feeds')
@Controller('feeds')
export class FeedsController {
  constructor(private readonly feedsService: FeedsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all RSS feeds' })
  @ApiResponse({ 
    status: 200, 
    description: 'Feeds retrieved successfully',
    schema: {
      example: [
        {
          id: 1,
          title: "TechCrunch",
          url: "https://techcrunch.com/feed/",
          description: "Latest technology news",
          isActive: true,
          category: {
            id: "uuid",
            name: "Technology",
            slug: "technology"
          },
          createdAt: "2024-01-01T00:00:00.000Z"
        }
      ]
    }
  })
  async findAll() {
    return this.feedsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get RSS feed by ID' })
  @ApiParam({ name: 'id', description: 'Feed ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Feed retrieved successfully',
    schema: {
      example: {
        id: 1,
        title: "TechCrunch",
        url: "https://techcrunch.com/feed/",
        description: "Latest technology news",
        isActive: true,
        category: {
          id: "uuid",
          name: "Technology",
          slug: "technology"
        },
        createdAt: "2024-01-01T00:00:00.000Z"
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Feed not found' })
  async findOne(@Param('id') id: number) {
    return this.feedsService.findOne(id);
  }
}
