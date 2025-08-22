import { Controller, Get, Param, Query } from '@nestjs/common';
import { ArticlesService, PaginationQuery } from './articles.service';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  async findAll(@Query() query: PaginationQuery) {
    return this.articlesService.findAll(query);
  }

  @Get('trending')
  async findTrending(@Query('limit') limit?: number) {
    return this.articlesService.findTrending(limit);
  }

  @Get('search')
  async search(@Query('q') searchQuery: string, @Query() query: PaginationQuery) {
    return this.articlesService.search(searchQuery, query);
  }

  @Get('category/:slug')
  async findByCategory(@Param('slug') slug: string, @Query() query: PaginationQuery) {
    return this.articlesService.findByCategory(slug, query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }
}
