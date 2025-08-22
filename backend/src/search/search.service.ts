import { Injectable } from '@nestjs/common';
import { ArticlesService } from '../articles/articles.service';

@Injectable()
export class SearchService {
  constructor(private readonly articlesService: ArticlesService) {}

  async search(query: string, page = 1, limit = 20) {
    return this.articlesService.search(query, { page, limit });
  }
}
