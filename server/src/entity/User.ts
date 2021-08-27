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
	signUpType!: SignUpType;

	@Column()
	accountType!: accountType;

	@CreateDateColumn({ name: "createdAt" })
	createdAt!: Date;

	@UpdateDateColumn({ name: "updatedAt" })
	updatedAt!: Date;

	@OneToMany(() => Bubble, bubble => bubble.user)
	bubbles!: Bubble[];

	@OneToMany(() => BubbleComment, bubbleComment => bubbleComment.user)
	bubbleComments!: BubbleComment[];

	//* 유저 가입
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

	//* email, password(option)로 유저 검색
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

	//* id, password로 유저 검색
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

	//* signUpType으로 유저 검색
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

	//* 유효한 닉네임 생성
	static async getValidNickname(originalName: string): Promise<string | undefined> {
    // 닉네임 길이 제한 검사
    if (originalName.length >= 26) {
      originalName = originalName.slice(0, 26);
    }
    
    // 닉네임 중복 확인
		const userUsingNickname = await this.findOne({ nickname: originalName });
		if (!userUsingNickname) {
			return originalName;
    }
    
    let count = 0;
    // 보조 재귀 함수: 랜덤으로 0~9999 숫자를 닉네임 뒤에 붙이며 중복되지 않는 닉네임 생성
    const getNicknameRecursive = async (nickname: string): Promise<string | undefined> => {
      // 최대 100회 시도
      if (count > 100) {
        return;
      }
      count++;

      const userUsingNickname = await this.findOne({ nickname });
      if (!userUsingNickname) {
        return nickname;
      } else {
        const newNickname = await getNicknameRecursive(originalName + String(Math.floor(Math.random() * 10000)));
        if (newNickname) return newNickname;
      }
    }

    const newNickname = await getNicknameRecursive(originalName + String(Math.floor(Math.random() * 10000)));
    return newNickname;
	}
}
