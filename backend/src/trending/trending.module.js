"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TrendingModule = void 0;
var common_1 = require("@nestjs/common");
var trending_service_1 = require("./trending.service");
var trending_controller_1 = require("./trending.controller");
var articles_module_1 = require("../articles/articles.module");
var TrendingModule = /** @class */ (function () {
    function TrendingModule() {
    }
    TrendingModule = __decorate([
        (0, common_1.Module)({
            imports: [articles_module_1.ArticlesModule],
            providers: [trending_service_1.TrendingService],
            controllers: [trending_controller_1.TrendingController],
            exports: [trending_service_1.TrendingService]
        })
    ], TrendingModule);
    return TrendingModule;
}());
exports.TrendingModule = TrendingModule;
