"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Bookmark = void 0;
var typeorm_1 = require("typeorm");
var user_entity_1 = require("./user.entity");
var article_entity_1 = require("./article.entity");
var Bookmark = /** @class */ (function () {
    function Bookmark() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)('uuid')
    ], Bookmark.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)()
    ], Bookmark.prototype, "userId");
    __decorate([
        (0, typeorm_1.Column)()
    ], Bookmark.prototype, "articleId");
    __decorate([
        (0, typeorm_1.Column)('text', { nullable: true })
    ], Bookmark.prototype, "notes");
    __decorate([
        (0, typeorm_1.CreateDateColumn)()
    ], Bookmark.prototype, "createdAt");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return user_entity_1.User; }, { onDelete: 'CASCADE' }),
        (0, typeorm_1.JoinColumn)({ name: 'userId' })
    ], Bookmark.prototype, "user");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return article_entity_1.Article; }, { onDelete: 'CASCADE', eager: true }),
        (0, typeorm_1.JoinColumn)({ name: 'articleId' })
    ], Bookmark.prototype, "article");
    Bookmark = __decorate([
        (0, typeorm_1.Entity)('bookmarks'),
        (0, typeorm_1.Unique)(['userId', 'articleId']),
        (0, typeorm_1.Index)(['userId']),
        (0, typeorm_1.Index)(['createdAt'])
    ], Bookmark);
    return Bookmark;
}());
exports.Bookmark = Bookmark;
