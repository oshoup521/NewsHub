import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(id: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['preferences', 'preferences.category'],
    });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async updateUser(id: string, updateData: { firstName?: string; lastName?: string }): Promise<User | undefined> {
    await this.userRepository.update(id, updateData);
    return this.findOne(id);
  }
}
