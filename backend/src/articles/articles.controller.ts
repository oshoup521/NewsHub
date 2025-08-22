import { Controller, Get, Param, Query } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiQuery,
  ApiParam 
} from '@nestjs/swagger';
import { ArticlesService, PaginationQuery } from './articles.service';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all articles with pagination' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiResponse({ 
    status: 200, 
    description: 'Articles retrieved successfully',
    schema: {
      example: {
        articles: [
          {
            id: "uuid",
            title: "Sample Article",
            summary: "Article summary...",
            url: "https://example.com/article",
            publishedAt: "2024-01-01T00:00:00.000Z",
            category: { name: "Technology", slug: "technology" }
          }
        ],
        total: 100,
        page: 1,
        limit: 10
      }
    }
  })
  async findAll(@Query() query: PaginationQuery) {
    return this.articlesService.findAll(query);
  }

  @Get('trending')
  @ApiOperation({ summary: 'Get trending articles' })
  @ApiQuery({ name: 'limit', required: false, description: 'Maximum number of articles' })
  @ApiResponse({ 
    status: 200, 
    description: 'Trending articles retrieved successfully',
    schema: {
      example: [
        {
          id: "uuid",
          title: "Trending Article",
          summary: "Popular article summary...",
          url: "https://example.com/trending",
          publishedAt: "2024-01-01T00:00:00.000Z",
          category: { name: "Technology", slug: "technology" },
          viewCount: 5420
        }
      ]
    }
  })
  async findTrending(@Query('limit') limit?: number) {
    return this.articlesService.findTrending(limit);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search articles by query' })
  @ApiQuery({ name: 'q', description: 'Search query', required: true })
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
            title: "Search Result Article",
            summary: "Matching article summary...",
            url: "https://example.com/search-result",
            publishedAt: "2024-01-01T00:00:00.000Z",
            category: { name: "Technology", slug: "technology" }
          }
        ],
        total: 15,
        page: 1,
        limit: 10
      }
    }
  })
  async search(@Query('q') searchQuery: string, @Query() query: PaginationQuery) {
    return this.articlesService.search(searchQuery, query);
  }

  @Get('category/:slug')
  @ApiOperation({ summary: 'Get articles by category' })
  @ApiParam({ name: 'slug', description: 'Category slug' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiResponse({ 
    status: 200, 
    description: 'Category articles retrieved successfully',
    schema: {
      example: {
        articles: [
          {
            id: "uuid",
            title: "Category Article",
            summary: "Article in this category...",
            url: "https://example.com/category-article",
            publishedAt: "2024-01-01T00:00:00.000Z",
            category: { name: "Technology", slug: "technology" }
          }
        ],
        category: { name: "Technology", slug: "technology" },
        total: 85,
        page: 1,
        limit: 10
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findByCategory(@Param('slug') slug: string, @Query() query: PaginationQuery) {
    return this.articlesService.findByCategory(slug, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single article by ID' })
  @ApiParam({ name: 'id', description: 'Article ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Article retrieved successfully',
    schema: {
      example: {
        id: "uuid",
        title: "Detailed Article Title",
        summary: "Complete article summary with more details...",
        content: "Full article content here...",
        url: "https://example.com/full-article",
        publishedAt: "2024-01-01T00:00:00.000Z",
        author: "John Doe",
        category: { 
          id: "uuid", 
          name: "Technology", 
          slug: "technology" 
        },
        feed: {
          id: 1,
          title: "TechCrunch",
          url: "https://techcrunch.com/feed/"
        },
        viewCount: 245
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Article not found' })
  async findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }
}
