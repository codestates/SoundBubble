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

  @Column()
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

  @OneToMany((type) => Bubble, (bubble) => bubble.user)
  bubbles!: Bubble[];

  @OneToMany((type) => BubbleComment, (bubbleComment) => bubbleComment.user)
  bubbleComments!: BubbleComment[];

  @OneToMany((type) => LikedBubble, (LikedBubble) => LikedBubble.user)
  likedBubbles!: BubbleComment[];

  static async insertUser(
    email: string,
    password: string,
    nickname: string,
    signUpType: SignUpType,
    accountType: accountType,
    profileImage?: string
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
}
