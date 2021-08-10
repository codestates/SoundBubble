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
exports.Bubble = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const BubbleComment_1 = require("./BubbleComment");
const LikedBubble_1 = require("./LikedBubble");
let Bubble = class Bubble extends typeorm_1.BaseEntity {
    id;
    image;
    // @Column()
    // thumbnail!: string;
    sound;
    textContent;
    createdAt;
    updatedAt;
    userId;
    user;
    bubbleComments;
    likedBubbles;
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Bubble.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Bubble.prototype, "image", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Bubble.prototype, "sound", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Bubble.prototype, "textContent", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ name: "createdAt" }),
    __metadata("design:type", Date)
], Bubble.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ name: "updatedAt" }),
    __metadata("design:type", Date)
], Bubble.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Bubble.prototype, "userId", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => User_1.User, (user) => user.bubbles, { onDelete: "CASCADE" }),
    __metadata("design:type", User_1.User)
], Bubble.prototype, "user", void 0);
__decorate([
    typeorm_1.OneToMany((type) => BubbleComment_1.BubbleComment, (bubbleComment) => bubbleComment.bubble),
    __metadata("design:type", Array)
], Bubble.prototype, "bubbleComments", void 0);
__decorate([
    typeorm_1.OneToMany((type) => LikedBubble_1.LikedBubble, (likedBubble) => likedBubble.bubble),
    __metadata("design:type", Array)
], Bubble.prototype, "likedBubbles", void 0);
Bubble = __decorate([
    typeorm_1.Entity({
        name: "Bubbles",
    })
], Bubble);
exports.Bubble = Bubble;
//# sourceMappingURL=Bubble.js.map