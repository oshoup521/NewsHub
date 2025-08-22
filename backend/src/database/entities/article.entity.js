"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Article = void 0;
var typeorm_1 = require("typeorm");
var feed_entity_1 = require("./feed.entity");
var category_entity_1 = require("./category.entity");
var Article = /** @class */ (function () {
    function Article() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)('uuid')
    ], Article.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)(),
        (0, typeorm_1.Index)()
    ], Article.prototype, "title");
    __decorate([
        (0, typeorm_1.Column)('text', { nullable: true })
    ], Article.prototype, "description");
    __decorate([
        (0, typeorm_1.Column)('text', { nullable: true })
    ], Article.prototype, "content");
    __decorate([
        (0, typeorm_1.Column)({ unique: true }),
        (0, typeorm_1.Index)()
    ], Article.prototype, "url");
    __decorate([
        (0, typeorm_1.Column)({ nullable: true })
    ], Article.prototype, "imageUrl");
    __decorate([
        (0, typeorm_1.Column)({ nullable: true })
    ], Article.prototype, "author");
    __decorate([
        (0, typeorm_1.Column)({ nullable: true })
    ], Article.prototype, "publishedAt");
    __decorate([
        (0, typeorm_1.Column)({ "default": 0 })
    ], Article.prototype, "viewCount");
    __decorate([
        (0, typeorm_1.Column)({ "default": 0 })
    ], Article.prototype, "bookmarkCount");
    __decorate([
        (0, typeorm_1.Column)('simple-array', { nullable: true })
    ], Article.prototype, "tags");
    __decorate([
        (0, typeorm_1.Column)({ "default": true })
    ], Article.prototype, "isActive");
    __decorate([
        (0, typeorm_1.CreateDateColumn)(),
        (0, typeorm_1.Index)()
    ], Article.prototype, "createdAt");
    __decorate([
        (0, typeorm_1.UpdateDateColumn)()
    ], Article.prototype, "updatedAt");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return feed_entity_1.Feed; }, { eager: true }),
        (0, typeorm_1.JoinColumn)({ name: 'feedId' })
    ], Article.prototype, "feed");
    __decorate([
        (0, typeorm_1.Column)()
    ], Article.prototype, "feedId");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return category_entity_1.Category; }, { eager: true }),
        (0, typeorm_1.JoinColumn)({ name: 'categoryId' })
    ], Article.prototype, "category");
    __decorate([
        (0, typeorm_1.Column)()
    ], Article.prototype, "categoryId");
    Article = __decorate([
        (0, typeorm_1.Entity)('articles'),
        (0, typeorm_1.Index)(['url'], { unique: true }),
        (0, typeorm_1.Index)(['publishedAt']),
        (0, typeorm_1.Index)(['title'])
    ], Article);
    return Article;
}());
exports.Article = Article;
