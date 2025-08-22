"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Feed = void 0;
var typeorm_1 = require("typeorm");
var category_entity_1 = require("./category.entity");
var Feed = /** @class */ (function () {
    function Feed() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)()
    ], Feed.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)()
    ], Feed.prototype, "name");
    __decorate([
        (0, typeorm_1.Column)({ unique: true })
    ], Feed.prototype, "url");
    __decorate([
        (0, typeorm_1.Column)({ nullable: true })
    ], Feed.prototype, "description");
    __decorate([
        (0, typeorm_1.Column)({ "default": true })
    ], Feed.prototype, "isActive");
    __decorate([
        (0, typeorm_1.Column)({ nullable: true })
    ], Feed.prototype, "lastFetched");
    __decorate([
        (0, typeorm_1.Column)({ "default": 0 })
    ], Feed.prototype, "fetchCount");
    __decorate([
        (0, typeorm_1.Column)({ "default": 0 })
    ], Feed.prototype, "errorCount");
    __decorate([
        (0, typeorm_1.Column)({ nullable: true })
    ], Feed.prototype, "lastError");
    __decorate([
        (0, typeorm_1.Column)({ "default": 30 })
    ], Feed.prototype, "fetchIntervalMinutes");
    __decorate([
        (0, typeorm_1.CreateDateColumn)()
    ], Feed.prototype, "createdAt");
    __decorate([
        (0, typeorm_1.UpdateDateColumn)()
    ], Feed.prototype, "updatedAt");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return category_entity_1.Category; }, { eager: true }),
        (0, typeorm_1.JoinColumn)({ name: 'categoryId' })
    ], Feed.prototype, "category");
    __decorate([
        (0, typeorm_1.Column)()
    ], Feed.prototype, "categoryId");
    Feed = __decorate([
        (0, typeorm_1.Entity)('feeds')
    ], Feed);
    return Feed;
}());
exports.Feed = Feed;
