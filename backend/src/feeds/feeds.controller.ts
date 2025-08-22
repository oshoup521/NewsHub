import { Controller, Get, Param } from '@nestjs/common';
import { FeedsService } from './feeds.service';

@Controller('feeds')
export class FeedsController {
  constructor(private readonly feedsService: FeedsService) {}

  @Get()
  async findAll() {
    return this.feedsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.feedsService.findOne(id);
  }
}
