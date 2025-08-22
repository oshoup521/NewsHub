"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AuthModule = void 0;
var common_1 = require("@nestjs/common");
var passport_1 = require("@nestjs/passport");
var jwt_1 = require("@nestjs/jwt");
var config_1 = require("@nestjs/config");
var typeorm_1 = require("@nestjs/typeorm");
var auth_service_1 = require("./auth.service");
var auth_controller_1 = require("./auth.controller");
var jwt_strategy_1 = require("./strategies/jwt.strategy");
var local_strategy_1 = require("./strategies/local.strategy");
var user_entity_1 = require("../database/entities/user.entity");
var users_module_1 = require("../users/users.module");
var AuthModule = /** @class */ (function () {
    function AuthModule() {
    }
    AuthModule = __decorate([
        (0, common_1.Module)({
            imports: [
                typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
                passport_1.PassportModule,
                jwt_1.JwtModule.registerAsync({
                    imports: [config_1.ConfigModule],
                    useFactory: function (configService) { return ({
                        secret: configService.get('NEWSHUB_JWT_SECRET', 'newshub-super-secret-key'),
                        signOptions: {
                            expiresIn: configService.get('NEWSHUB_JWT_EXPIRES_IN', '7d')
                        }
                    }); },
                    inject: [config_1.ConfigService]
                }),
                users_module_1.UsersModule,
            ],
            controllers: [auth_controller_1.AuthController],
            providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, local_strategy_1.LocalStrategy],
            exports: [auth_service_1.AuthService]
        })
    ], AuthModule);
    return AuthModule;
}());
exports.AuthModule = AuthModule;
