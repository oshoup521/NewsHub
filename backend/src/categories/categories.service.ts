import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../database/entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { isActive: true },
      order: { priority: 'DESC', name: 'ASC' },
    });
  }

  async findOne(slug: string): Promise<Category> {
    return this.categoryRepository.findOne({
      where: { slug, isActive: true },
    });
  }

  async findById(id: number): Promise<Category> {
    return this.categoryRepository.findOne({
      where: { id, isActive: true },
    });
  }
}
