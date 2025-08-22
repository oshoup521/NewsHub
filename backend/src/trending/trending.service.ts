import { Injectable } from '@nestjs/common';
import { ArticlesService } from '../articles/articles.service';

@Injectable()
export class TrendingService {
  constructor(private readonly articlesService: ArticlesService) {}

  async getTrendingArticles(limit = 10) {
    return this.articlesService.findTrending(limit);
  }
}
