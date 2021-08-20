import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
	BaseEntity,
} from "typeorm";
import { Bubble } from "./Bubble";
import { BubbleComment } from "./BubbleComment";
import { LikedBubble } from "./LikedBubble";

type SignUpType = "email" | "google" | "naver" | "intergration";
type accountType = "user" | "admin";

@Entity({
	name: "Users",
})
export class User extends BaseEntity {
	// Active Record 패턴. 모델에서 바로 메소드 사용 가능
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ unique: true })
	email!: string;

	@Column()
	password!: string;

	@Column({ unique: true })
	nickname!: string;

	@Column({ nullable: true })
	profileImage!: string;

	@Column()
	signUpType!: string;

	@Column()
	accountType!: string;

	// @Column({ nullable: true })
	// refreshToken!: string;

	@CreateDateColumn({ name: "createdAt" })
	createdAt!: Date;

	@UpdateDateColumn({ name: "updatedAt" })
	updatedAt!: Date;

	@OneToMany(() => Bubble, bubble => bubble.user)
	bubbles!: Bubble[];

	@OneToMany(() => BubbleComment, bubbleComment => bubbleComment.user)
	bubbleComments!: BubbleComment[];

	@OneToMany(() => LikedBubble, LikedBubble => LikedBubble.user)
	likedBubbles!: BubbleComment[];

	static async insertUser(
		email: string,
		password: string,
		nickname: string,
		signUpType: SignUpType,
		accountType: accountType,
		profileImage?: string,
	): Promise<User> {
		const newUser: User = new User();
		newUser.email = email;
		newUser.password = password;
		newUser.nickname = nickname;
		newUser.signUpType = signUpType;
		newUser.accountType = accountType;
		if (profileImage) newUser.profileImage = profileImage;
		await newUser.save();
		return newUser;
	}

	static async findUserByEmail(email: string, password?: string): Promise<User | undefined> {
		let user: User | undefined;

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
		} else {
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

	static async findUserById(userId: number, password: string): Promise<User | undefined> {
		const user: User | undefined = await this.createQueryBuilder("user")
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

	static async findUserBySignUpType(email: string, signUpType: SignUpType): Promise<User | undefined> {
		const user: User | undefined = await this.createQueryBuilder("user")
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

	static async getValidNickname(originalName: string): Promise<string | undefined> {
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
    const getNicknameRecursive = async (nickname: string): Promise<string | undefined> => {
      console.log("RamdomName", nickname);
      // 최대 100회 시도
      if (count > 100) {
        return;
      }
      count++;

      const userUsingNickname = await this.findOne({ nickname });
      if (!userUsingNickname) {
        return nickname;
      } else {
        const newNickname = getNicknameRecursive(originalName + String(Math.floor(Math.random() * 10000)));
        if (newNickname) return newNickname;
      }
    }

    const newNickname = await getNicknameRecursive(originalName + String(Math.floor(Math.random() * 10000)));
    return newNickname;
	}
}
