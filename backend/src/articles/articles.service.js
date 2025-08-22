"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.ArticlesService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var article_entity_1 = require("../database/entities/article.entity");
var ArticlesService = /** @class */ (function () {
    function ArticlesService(articleRepository) {
        this.articleRepository = articleRepository;
    }
    ArticlesService.prototype.findAll = function (query) {
        if (query === void 0) { query = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, page, _b, limit, category, _c, sortBy, _d, sortOrder, queryBuilder, _e, articles, total;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _a = query.page, page = _a === void 0 ? 1 : _a, _b = query.limit, limit = _b === void 0 ? 20 : _b, category = query.category, _c = query.sortBy, sortBy = _c === void 0 ? 'publishedAt' : _c, _d = query.sortOrder, sortOrder = _d === void 0 ? 'DESC' : _d;
                        queryBuilder = this.articleRepository
                            .createQueryBuilder('article')
                            .leftJoinAndSelect('article.category', 'category')
                            .leftJoinAndSelect('article.feed', 'feed')
                            .where('article.isActive = :isActive', { isActive: true });
                        if (category) {
                            queryBuilder.andWhere('category.slug = :category', { category: category });
                        }
                        queryBuilder
                            .orderBy("article.".concat(sortBy), sortOrder)
                            .skip((page - 1) * limit)
                            .take(limit);
                        return [4 /*yield*/, queryBuilder.getManyAndCount()];
                    case 1:
                        _e = _f.sent(), articles = _e[0], total = _e[1];
                        return [2 /*return*/, {
                                articles: articles,
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
    ArticlesService.prototype.findOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var article;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.articleRepository.findOne({
                            where: { id: id, isActive: true },
                            relations: ['category', 'feed']
                        })];
                    case 1:
                        article = _a.sent();
                        if (!article) return [3 /*break*/, 3];
                        // Increment view count
                        return [4 /*yield*/, this.articleRepository.update(id, {
                                viewCount: article.viewCount + 1
                            })];
                    case 2:
                        // Increment view count
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, article];
                }
            });
        });
    };
    ArticlesService.prototype.findByCategory = function (categorySlug, query) {
        if (query === void 0) { query = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.findAll(__assign(__assign({}, query), { category: categorySlug }))];
            });
        });
    };
    ArticlesService.prototype.findTrending = function (limit) {
        if (limit === void 0) { limit = 10; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.articleRepository.find({
                        where: { isActive: true },
                        relations: ['category', 'feed'],
                        order: { bookmarkCount: 'DESC', viewCount: 'DESC' },
                        take: limit
                    })];
            });
        });
    };
    ArticlesService.prototype.search = function (searchQuery, query) {
        if (query === void 0) { query = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, page, _b, limit, queryBuilder, _c, articles, total;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = query.page, page = _a === void 0 ? 1 : _a, _b = query.limit, limit = _b === void 0 ? 20 : _b;
                        queryBuilder = this.articleRepository
                            .createQueryBuilder('article')
                            .leftJoinAndSelect('article.category', 'category')
                            .leftJoinAndSelect('article.feed', 'feed')
                            .where('article.isActive = :isActive', { isActive: true })
                            .andWhere('(article.title LIKE :search OR article.description LIKE :search OR article.content LIKE :search)', { search: "%".concat(searchQuery, "%") })
                            .orderBy('article.publishedAt', 'DESC')
                            .skip((page - 1) * limit)
                            .take(limit);
                        return [4 /*yield*/, queryBuilder.getManyAndCount()];
                    case 1:
                        _c = _d.sent(), articles = _c[0], total = _c[1];
                        return [2 /*return*/, {
                                articles: articles,
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
    ArticlesService = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, typeorm_1.InjectRepository)(article_entity_1.Article))
    ], ArticlesService);
    return ArticlesService;
}());
exports.ArticlesService = ArticlesService;
