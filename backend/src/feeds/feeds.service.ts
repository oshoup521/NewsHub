import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feed } from '../database/entities/feed.entity';

@Injectable()
export class FeedsService {
  constructor(
    @InjectRepository(Feed)
    private readonly feedRepository: Repository<Feed>,
  ) {}

  async findAll(): Promise<Feed[]> {
    return this.feedRepository.find({
      where: { isActive: true },
      relations: ['category'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Feed> {
    return this.feedRepository.findOne({
      where: { id, isActive: true },
      relations: ['category'],
    });
  }
}
