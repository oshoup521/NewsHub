"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.BookmarksService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var bookmark_entity_1 = require("../database/entities/bookmark.entity");
var article_entity_1 = require("../database/entities/article.entity");
var BookmarksService = /** @class */ (function () {
    function BookmarksService(bookmarkRepository, articleRepository) {
        this.bookmarkRepository = bookmarkRepository;
        this.articleRepository = articleRepository;
    }
    BookmarksService.prototype.findUserBookmarks = function (userId, page, limit) {
        if (page === void 0) { page = 1; }
        if (limit === void 0) { limit = 20; }
        return __awaiter(this, void 0, void 0, function () {
            var queryBuilder, _a, bookmarks, total;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        queryBuilder = this.bookmarkRepository
                            .createQueryBuilder('bookmark')
                            .leftJoinAndSelect('bookmark.article', 'article')
                            .leftJoinAndSelect('article.category', 'category')
                            .leftJoinAndSelect('article.feed', 'feed')
                            .where('bookmark.userId = :userId', { userId: userId })
                            .orderBy('bookmark.createdAt', 'DESC')
                            .skip((page - 1) * limit)
                            .take(limit);
                        return [4 /*yield*/, queryBuilder.getManyAndCount()];
                    case 1:
                        _a = _b.sent(), bookmarks = _a[0], total = _a[1];
                        return [2 /*return*/, {
                                bookmarks: bookmarks,
                                pagination: {
                                    page: page,
                                    limit: limit,
                                    total: total,
                                    totalPages: Math.ceil(total / limit)
                                }
                            }];
                }
            });
        });
    };
    BookmarksService.prototype.createBookmark = function (userId, articleId, notes) {
        return __awaiter(this, void 0, void 0, function () {
            var article, existingBookmark, bookmark, savedBookmark;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.articleRepository.findOne({
                            where: { id: articleId }
                        })];
                    case 1:
                        article = _a.sent();
                        if (!article) {
                            throw new common_1.NotFoundException('Article not found');
                        }
                        return [4 /*yield*/, this.bookmarkRepository.findOne({
                                where: { userId: userId, articleId: articleId }
                            })];
                    case 2:
                        existingBookmark = _a.sent();
                        if (existingBookmark) {
                            throw new common_1.ConflictException('Article already bookmarked');
                        }
                        bookmark = this.bookmarkRepository.create({
                            userId: userId,
                            articleId: articleId,
                            notes: notes
                        });
                        return [4 /*yield*/, this.bookmarkRepository.save(bookmark)];
                    case 3:
                        savedBookmark = _a.sent();
                        // Increment bookmark count on article
                        return [4 /*yield*/, this.articleRepository.update(articleId, {
                                bookmarkCount: article.bookmarkCount + 1
                            })];
                    case 4:
                        // Increment bookmark count on article
                        _a.sent();
                        return [2 /*return*/, savedBookmark];
                }
            });
        });
    };
    BookmarksService.prototype.removeBookmark = function (userId, articleId) {
        return __awaiter(this, void 0, void 0, function () {
            var bookmark, article;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.bookmarkRepository.findOne({
                            where: { userId: userId, articleId: articleId }
                        })];
                    case 1:
                        bookmark = _a.sent();
                        if (!bookmark) {
                            throw new common_1.NotFoundException('Bookmark not found');
                        }
                        return [4 /*yield*/, this.bookmarkRepository.remove(bookmark)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.articleRepository.findOne({
                                where: { id: articleId }
                            })];
                    case 3:
                        article = _a.sent();
                        if (!article) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.articleRepository.update(articleId, {
                                bookmarkCount: Math.max(0, article.bookmarkCount - 1)
                            })];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/, { message: 'Bookmark removed successfully' }];
                }
            });
        });
    };
    BookmarksService.prototype.isBookmarked = function (userId, articleId) {
        return __awaiter(this, void 0, void 0, function () {
            var bookmark;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.bookmarkRepository.findOne({
                            where: { userId: userId, articleId: articleId }
                        })];
                    case 1:
                        bookmark = _a.sent();
                        return [2 /*return*/, !!bookmark];
                }
            });
        });
    };
    BookmarksService = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, typeorm_1.InjectRepository)(bookmark_entity_1.Bookmark)),
        __param(1, (0, typeorm_1.InjectRepository)(article_entity_1.Article))
    ], BookmarksService);
    return BookmarksService;
}());
exports.BookmarksService = BookmarksService;
