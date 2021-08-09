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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BubbleComment = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Bubble_1 = require("./Bubble");
let BubbleComment = class BubbleComment extends typeorm_1.BaseEntity {
    id;
    textContent;
    createdAt;
    updatedAt;
    bubble;
    user;
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], BubbleComment.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], BubbleComment.prototype, "textContent", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ name: "createdAt" }),
    __metadata("design:type", Date)
], BubbleComment.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ name: "updatedAt" }),
    __metadata("design:type", Date)
], BubbleComment.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => Bubble_1.Bubble, (bubble) => bubble.bubbleComments, { onDelete: "CASCADE" }),
    __metadata("design:type", Bubble_1.Bubble)
], BubbleComment.prototype, "bubble", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => User_1.User, (user) => user.bubbles, { onDelete: "CASCADE" }),
    __metadata("design:type", User_1.User)
], BubbleComment.prototype, "user", void 0);
BubbleComment = __decorate([
    typeorm_1.Entity({
        name: "BubbleComments",
    })
], BubbleComment);
exports.BubbleComment = BubbleComment;
//# sourceMappingURL=BubbleComment.js.map