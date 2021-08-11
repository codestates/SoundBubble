"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UserToken_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserToken = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
let UserToken = UserToken_1 = class UserToken extends typeorm_1.BaseEntity {
    userId;
    refreshToken;
    user;
    static async insertToken(userId, refreshToken) {
        const newToken = new UserToken_1();
        newToken.userId = userId;
        newToken.refreshToken = refreshToken;
        await newToken.save();
        return newToken;
    }
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], UserToken.prototype, "userId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], UserToken.prototype, "refreshToken", void 0);
__decorate([
    typeorm_1.OneToOne((type) => User_1.User, { onDelete: "CASCADE" }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", User_1.User)
], UserToken.prototype, "user", void 0);
UserToken = UserToken_1 = __decorate([
    typeorm_1.Entity({
        name: "UserTokens",
    })
], UserToken);
exports.UserToken = UserToken;
//# sourceMappingURL=UserToken.js.map