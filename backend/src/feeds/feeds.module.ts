import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feed } from '../database/entities/feed.entity';
import { FeedsService } from './feeds.service';
import { FeedsController } from './feeds.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Feed])],
  providers: [FeedsService],
  controllers: [FeedsController],
  exports: [FeedsService],
})
export class FeedsModule {}
