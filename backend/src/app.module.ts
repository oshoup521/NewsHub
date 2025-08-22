import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtModule } from '@nestjs/jwt';

// Modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ArticlesModule } from './articles/articles.module';
import { FeedsModule } from './feeds/feeds.module';
import { CategoriesModule } from './categories/categories.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { SearchModule } from './search/search.module';
import { TrendingModule } from './trending/trending.module';

// Entities
import { User } from './database/entities/user.entity';
import { Article } from './database/entities/article.entity';
import { Feed } from './database/entities/feed.entity';
import { Category } from './database/entities/category.entity';
import { Bookmark } from './database/entities/bookmark.entity';
import { UserPreference } from './database/entities/user-preference.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get('NEWSHUB_DATABASE_PATH', 'newshub.sqlite'),
        entities: [User, Article, Feed, Category, Bookmark, UserPreference],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('NEWSHUB_JWT_SECRET', 'newshub-super-secret-key'),
        signOptions: {
          expiresIn: configService.get('NEWSHUB_JWT_EXPIRES_IN', '7d'),
        },
      }),
      inject: [ConfigService],
      global: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    ArticlesModule,
    FeedsModule,
    CategoriesModule,
    BookmarksModule,
    SearchModule,
    TrendingModule,
  ],
})
export class AppModule {}
