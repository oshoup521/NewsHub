import { Controller, Get, Query } from '@nestjs/common';
import { TrendingService } from './trending.service';

@Controller('trending')
export class TrendingController {
  constructor(private readonly trendingService: TrendingService) {}

  @Get()
  async getTrending(@Query('limit') limit?: number) {
    return this.trendingService.getTrendingArticles(limit);
  }
}
