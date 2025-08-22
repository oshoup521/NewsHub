"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var config_1 = require("@nestjs/config");
var schedule_1 = require("@nestjs/schedule");
var throttler_1 = require("@nestjs/throttler");
var jwt_1 = require("@nestjs/jwt");
// Modules
var auth_module_1 = require("./auth/auth.module");
var users_module_1 = require("./users/users.module");
var articles_module_1 = require("./articles/articles.module");
var feeds_module_1 = require("./feeds/feeds.module");
var categories_module_1 = require("./categories/categories.module");
var bookmarks_module_1 = require("./bookmarks/bookmarks.module");
var search_module_1 = require("./search/search.module");
var trending_module_1 = require("./trending/trending.module");
// Entities
var user_entity_1 = require("./database/entities/user.entity");
var article_entity_1 = require("./database/entities/article.entity");
var feed_entity_1 = require("./database/entities/feed.entity");
var category_entity_1 = require("./database/entities/category.entity");
var bookmark_entity_1 = require("./database/entities/bookmark.entity");
var user_preference_entity_1 = require("./database/entities/user-preference.entity");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        (0, common_1.Module)({
            imports: [
                config_1.ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: '.env'
                }),
                typeorm_1.TypeOrmModule.forRootAsync({
                    imports: [config_1.ConfigModule],
                    useFactory: function (configService) { return ({
                        type: 'sqlite',
                        database: configService.get('NEWSHUB_DATABASE_PATH', 'newshub.sqlite'),
                        entities: [user_entity_1.User, article_entity_1.Article, feed_entity_1.Feed, category_entity_1.Category, bookmark_entity_1.Bookmark, user_preference_entity_1.UserPreference],
                        synchronize: configService.get('NODE_ENV') !== 'production',
                        logging: configService.get('NODE_ENV') === 'development'
                    }); },
                    inject: [config_1.ConfigService]
                }),
                jwt_1.JwtModule.registerAsync({
                    imports: [config_1.ConfigModule],
                    useFactory: function (configService) { return ({
                        secret: configService.get('NEWSHUB_JWT_SECRET', 'newshub-super-secret-key'),
                        signOptions: {
                            expiresIn: configService.get('NEWSHUB_JWT_EXPIRES_IN', '7d')
                        }
                    }); },
                    inject: [config_1.ConfigService],
                    global: true
                }),
                throttler_1.ThrottlerModule.forRoot([
                    {
                        ttl: 60000,
                        limit: 100
                    },
                ]),
                schedule_1.ScheduleModule.forRoot(),
                auth_module_1.AuthModule,
                users_module_1.UsersModule,
                articles_module_1.ArticlesModule,
                feeds_module_1.FeedsModule,
                categories_module_1.CategoriesModule,
                bookmarks_module_1.BookmarksModule,
                search_module_1.SearchModule,
                trending_module_1.TrendingModule,
            ]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
