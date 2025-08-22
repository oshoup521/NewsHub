"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Category = void 0;
var typeorm_1 = require("typeorm");
var Category = /** @class */ (function () {
    function Category() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)()
    ], Category.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)()
    ], Category.prototype, "name");
    __decorate([
        (0, typeorm_1.Column)({ unique: true })
    ], Category.prototype, "slug");
    __decorate([
        (0, typeorm_1.Column)({ nullable: true })
    ], Category.prototype, "description");
    __decorate([
        (0, typeorm_1.Column)({ "default": '#3B82F6' })
    ], Category.prototype, "color");
    __decorate([
        (0, typeorm_1.Column)({ "default": 0 })
    ], Category.prototype, "priority");
    __decorate([
        (0, typeorm_1.Column)({ "default": true })
    ], Category.prototype, "isActive");
    __decorate([
        (0, typeorm_1.CreateDateColumn)()
    ], Category.prototype, "createdAt");
    __decorate([
        (0, typeorm_1.UpdateDateColumn)()
    ], Category.prototype, "updatedAt");
    Category = __decorate([
        (0, typeorm_1.Entity)('categories'),
        (0, typeorm_1.Index)(['slug'], { unique: true })
    ], Category);
    return Category;
}());
exports.Category = Category;
