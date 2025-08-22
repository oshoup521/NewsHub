import { Controller, Get, Param } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam 
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all news categories' })
  @ApiResponse({ 
    status: 200, 
    description: 'Categories retrieved successfully',
    schema: {
      example: [
        {
          id: "uuid",
          name: "Technology",
          slug: "technology",
          description: "Latest tech news and innovations",
          createdAt: "2024-01-01T00:00:00.000Z"
        },
        {
          id: "uuid",
          name: "Sports",
          slug: "sports",
          description: "Sports news and updates",
          createdAt: "2024-01-01T00:00:00.000Z"
        }
      ]
    }
  })
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get category by slug' })
  @ApiParam({ name: 'slug', description: 'Category slug' })
  @ApiResponse({ 
    status: 200, 
    description: 'Category retrieved successfully',
    schema: {
      example: {
        id: "uuid",
        name: "Technology",
        slug: "technology",
        description: "Latest tech news and innovations",
        createdAt: "2024-01-01T00:00:00.000Z"
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findOne(@Param('slug') slug: string) {
    return this.categoriesService.findOne(slug);
  }
}
