import { Module } from '@nestjs/common';
import { TrendingService } from './trending.service';
import { TrendingController } from './trending.controller';
import { ArticlesModule } from '../articles/articles.module';

@Module({
  imports: [ArticlesModule],
  providers: [TrendingService],
  controllers: [TrendingController],
  exports: [TrendingService],
})
export class TrendingModule {}
