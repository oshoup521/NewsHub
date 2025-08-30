import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam,
  ApiBearerAuth 
} from '@nestjs/swagger';
import { FeedsService } from './feeds.service';
import { FeedParserService } from './feed-parser.service';

@ApiTags('feeds')
@Controller('feeds')
export class FeedsController {
  constructor(
    private readonly feedsService: FeedsService,
    private readonly feedParserService: FeedParserService,
  ) {}

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

  @Post('parse')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Parse all RSS feeds manually',
    description: 'Triggers manual parsing of all active RSS feeds to fetch new articles' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Feeds parsed successfully',
    schema: {
      example: {
        success: true,
        message: "Parsed 5 feeds in 1234ms",
        stats: {
          totalFeeds: 5,
          successful: 4,
          failed: 1,
          newArticles: 23,
          duration: 1234
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - JWT token required' })
  async parseAllFeeds() {
    return this.feedParserService.parseAllFeedsManually();
  }

  @Post('parse/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Parse specific RSS feed manually',
    description: 'Triggers manual parsing of a specific RSS feed to fetch new articles' 
  })
  @ApiParam({ name: 'id', description: 'Feed ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Feed parsed successfully',
    schema: {
      example: {
        success: true,
        message: "Successfully parsed feed: TechCrunch",
        newArticles: 5
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Feed not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized - JWT token required' })
  async parseFeedById(@Param('id') id: number) {
    return this.feedParserService.parseFeedById(id);
  }
}
