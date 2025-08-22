"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UserPreference = void 0;
var typeorm_1 = require("typeorm");
var user_entity_1 = require("./user.entity");
var category_entity_1 = require("./category.entity");
var UserPreference = /** @class */ (function () {
    function UserPreference() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)()
    ], UserPreference.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)()
    ], UserPreference.prototype, "userId");
    __decorate([
        (0, typeorm_1.Column)()
    ], UserPreference.prototype, "categoryId");
    __decorate([
        (0, typeorm_1.Column)({ "default": 1 })
    ], UserPreference.prototype, "priority");
    __decorate([
        (0, typeorm_1.Column)({ "default": true })
    ], UserPreference.prototype, "isEnabled");
    __decorate([
        (0, typeorm_1.CreateDateColumn)()
    ], UserPreference.prototype, "createdAt");
    __decorate([
        (0, typeorm_1.UpdateDateColumn)()
    ], UserPreference.prototype, "updatedAt");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return user_entity_1.User; }, { onDelete: 'CASCADE' }),
        (0, typeorm_1.JoinColumn)({ name: 'userId' })
    ], UserPreference.prototype, "user");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return category_entity_1.Category; }, { onDelete: 'CASCADE', eager: true }),
        (0, typeorm_1.JoinColumn)({ name: 'categoryId' })
    ], UserPreference.prototype, "category");
    UserPreference = __decorate([
        (0, typeorm_1.Entity)('user_preferences'),
        (0, typeorm_1.Unique)(['userId', 'categoryId']),
        (0, typeorm_1.Index)(['userId'])
    ], UserPreference);
    return UserPreference;
}());
exports.UserPreference = UserPreference;
