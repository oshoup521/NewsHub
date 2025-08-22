import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Article } from '../database/entities/article.entity';

export interface PaginationQuery {
  page?: number;
  limit?: number;
  category?: string;
  sortBy?: 'createdAt' | 'publishedAt' | 'viewCount' | 'bookmarkCount';
  sortOrder?: 'ASC' | 'DESC';
}

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async findAll(query: PaginationQuery = {}) {
    const {
      page = 1,
      limit = 20,
      category,
      sortBy = 'publishedAt',
      sortOrder = 'DESC',
    } = query;

    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.feed', 'feed')
      .where('article.isActive = :isActive', { isActive: true });

    if (category) {
      queryBuilder.andWhere('category.slug = :category', { category });
    }

    queryBuilder
      .orderBy(`article.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const [articles, total] = await queryBuilder.getManyAndCount();

    return {
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { id, isActive: true },
      relations: ['category', 'feed'],
    });

    if (article) {
      // Increment view count
      await this.articleRepository.update(id, {
        viewCount: article.viewCount + 1,
      });
    }

    return article;
  }

  async findByCategory(categorySlug: string, query: PaginationQuery = {}) {
    return this.findAll({ ...query, category: categorySlug });
  }

  async findTrending(limit = 10) {
    return this.articleRepository.find({
      where: { isActive: true },
      relations: ['category', 'feed'],
      order: { bookmarkCount: 'DESC', viewCount: 'DESC' },
      take: limit,
    });
  }

  async search(searchQuery: string, query: PaginationQuery = {}) {
    const { page = 1, limit = 20 } = query;

    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.feed', 'feed')
      .where('article.isActive = :isActive', { isActive: true })
      .andWhere(
        '(article.title LIKE :search OR article.description LIKE :search OR article.content LIKE :search)',
        { search: `%${searchQuery}%` }
      )
      .orderBy('article.publishedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [articles, total] = await queryBuilder.getManyAndCount();

    return {
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
