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
var Bubble_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bubble = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const BubbleComment_1 = require("./BubbleComment");
let Bubble = Bubble_1 = class Bubble extends typeorm_1.BaseEntity {
    id;
    image;
    thumbnail;
    sound;
    textContent;
    createdAt;
    updatedAt;
    userId;
    user;
    bubbleComments;
    //* 버블 생성
    static async insertBubble(userId, textContent, imageSrc, soundSrc, thumbnailSrc) {
        const newBubble = new Bubble_1();
        newBubble.userId = userId;
        newBubble.textContent = textContent;
        newBubble.image = imageSrc;
        newBubble.thumbnail = thumbnailSrc;
        newBubble.sound = soundSrc;
        await newBubble.save();
        return newBubble;
    }
    //* 모든 버블 조회 (검색 옵션 사용 가능)
    static async findAllBubbles(start, end, limit, order) {
        const bubbles = await this.createQueryBuilder("bubble")
            .where("bubble.id >= :sId AND bubble.id <= :eId", { sId: start, eId: end })
            .limit(limit)
            .leftJoinAndSelect("bubble.user", "user")
            .select([
            "bubble.id",
            "bubble.image",
            "bubble.thumbnail",
            "bubble.sound",
            "bubble.textContent",
            "bubble.createdAt",
            "user.email",
            "user.nickname",
        ])
            .orderBy("bubble.id", order)
            .getMany();
        return bubbles;
    }
    //* 특정 버블 조회
    static async findBubble(bubbleId) {
        const bubble = await this.createQueryBuilder("bubble")
            .where("bubble.id = :id", { id: bubbleId })
            .leftJoinAndSelect("bubble.user", "user")
            .select([
            "bubble.id",
            "bubble.image",
            "bubble.thumbnail",
            "bubble.sound",
            "bubble.textContent",
            "bubble.createdAt",
            "user.email",
            "user.nickname",
        ])
            .getOne();
        return bubble;
    }
    //* 특정 유저의 버블 조회
    static async findBubblesByUserId(userId) {
        const bubbles = await this.createQueryBuilder("bubble")
            .where("bubble.userId = :userId", { userId: userId })
            .leftJoinAndSelect("bubble.user", "user")
            .select(["bubble.id", "bubble.thumbnail", "bubble.image", "bubble.sound", "bubble.textContent", "bubble.createdAt", "user.email", "user.nickname"])
            .orderBy("bubble.id", "DESC")
            .getMany();
        return bubbles;
    }
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
], Bubble.prototype, "thumbnail", void 0);
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
    typeorm_1.ManyToOne(() => User_1.User, (user) => user.bubbles, { onDelete: "CASCADE" }),
    __metadata("design:type", User_1.User)
], Bubble.prototype, "user", void 0);
__decorate([
    typeorm_1.OneToMany(() => BubbleComment_1.BubbleComment, (bubbleComment) => bubbleComment.bubble),
    __metadata("design:type", Array)
], Bubble.prototype, "bubbleComments", void 0);
Bubble = Bubble_1 = __decorate([
    typeorm_1.Entity({
        name: "Bubbles",
    })
], Bubble);
exports.Bubble = Bubble;
