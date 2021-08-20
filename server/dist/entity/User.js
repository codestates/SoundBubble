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
var User_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const Bubble_1 = require("./Bubble");
const BubbleComment_1 = require("./BubbleComment");
const LikedBubble_1 = require("./LikedBubble");
let User = User_1 = class User extends typeorm_1.BaseEntity {
    // Active Record 패턴. 모델에서 바로 메소드 사용 가능
    id;
    email;
    password;
    nickname;
    profileImage;
    signUpType;
    accountType;
    createdAt;
    updatedAt;
    bubbles;
    bubbleComments;
    likedBubbles;
    static async insertUser(email, password, nickname, signUpType, accountType, profileImage) {
        const newUser = new User_1();
        newUser.email = email;
        newUser.password = password;
        newUser.nickname = nickname;
        newUser.signUpType = signUpType;
        newUser.accountType = accountType;
        if (profileImage)
            newUser.profileImage = profileImage;
        await newUser.save();
        return newUser;
    }
    static async findUserByEmail(email, password) {
        let user;
        if (password) {
            user = await this.createQueryBuilder("user")
                .where("email = :email AND password = :password", { email: email, password: password })
                .select([
                "user.id",
                "user.email",
                "user.nickname",
                "user.profileImage",
                "user.signUpType",
                "user.accountType",
                "user.createdAt",
            ])
                .getOne();
        }
        else {
            user = await this.createQueryBuilder("user")
                .where("email = :email", { email: email })
                .select([
                "user.id",
                "user.email",
                "user.nickname",
                "user.profileImage",
                "user.signUpType",
                "user.accountType",
                "user.createdAt",
            ])
                .getOne();
        }
        return user;
    }
    static async findUserById(userId, password) {
        const user = await this.createQueryBuilder("user")
            .where("user.id = :id AND user.password = :password", { id: userId, password: password })
            .select([
            "user.id",
            "user.email",
            "user.nickname",
            "user.profileImage",
            "user.signUpType",
            "user.accountType",
            "user.createdAt",
        ])
            .getOne();
        return user;
    }
    static async findUserBySignUpType(email, signUpType) {
        const user = await this.createQueryBuilder("user")
            .where("email = :email AND signUpType = :signUpType", { email: email, signUpType: signUpType })
            .select([
            "user.id",
            "user.email",
            "user.nickname",
            "user.profileImage",
            "user.signUpType",
            "user.accountType",
            "user.createdAt",
        ])
            .getOne();
        return user;
    }
    static async getValidNickname(originalName) {
        // 닉네임 길이 제한 검사
        if (originalName.length >= 26) {
            originalName = originalName.slice(0, 26);
        }
        console.log("originalName", originalName);
        // 닉네임 중복 확인
        const userUsingNickname = await this.findOne({ nickname: originalName });
        if (!userUsingNickname) {
            return originalName;
        }
        let count = 0;
        // 보조 재귀 함수: 랜덤으로 0~9999 숫자를 닉네임 뒤에 붙이며 중복되지 않는 닉네임 생성
        const getNicknameRecursive = async (nickname) => {
            console.log("RamdomName", nickname);
            // 최대 100회 시도
            if (count > 100) {
                return;
            }
            count++;
            const userUsingNickname = await this.findOne({ nickname });
            if (!userUsingNickname) {
                return nickname;
            }
            else {
                const newNickname = getNicknameRecursive(originalName + String(Math.floor(Math.random() * 10000)));
                if (newNickname)
                    return newNickname;
            }
        };
        const newNickname = await getNicknameRecursive(originalName + String(Math.floor(Math.random() * 10000)));
        return newNickname;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "nickname", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "profileImage", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "signUpType", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "accountType", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ name: "createdAt" }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ name: "updatedAt" }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.OneToMany(() => Bubble_1.Bubble, bubble => bubble.user),
    __metadata("design:type", Array)
], User.prototype, "bubbles", void 0);
__decorate([
    typeorm_1.OneToMany(() => BubbleComment_1.BubbleComment, bubbleComment => bubbleComment.user),
    __metadata("design:type", Array)
], User.prototype, "bubbleComments", void 0);
__decorate([
    typeorm_1.OneToMany(() => LikedBubble_1.LikedBubble, LikedBubble => LikedBubble.user),
    __metadata("design:type", Array)
], User.prototype, "likedBubbles", void 0);
User = User_1 = __decorate([
    typeorm_1.Entity({
        name: "Users",
    })
], User);
exports.User = User;
//# sourceMappingURL=User.js.map