"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.BookmarksModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var bookmark_entity_1 = require("../database/entities/bookmark.entity");
var article_entity_1 = require("../database/entities/article.entity");
var bookmarks_service_1 = require("./bookmarks.service");
var bookmarks_controller_1 = require("./bookmarks.controller");
var BookmarksModule = /** @class */ (function () {
    function BookmarksModule() {
    }
    BookmarksModule = __decorate([
        (0, common_1.Module)({
            imports: [typeorm_1.TypeOrmModule.forFeature([bookmark_entity_1.Bookmark, article_entity_1.Article])],
            providers: [bookmarks_service_1.BookmarksService],
            controllers: [bookmarks_controller_1.BookmarksController],
            exports: [bookmarks_service_1.BookmarksService]
        })
    ], BookmarksModule);
    return BookmarksModule;
}());
exports.BookmarksModule = BookmarksModule;
