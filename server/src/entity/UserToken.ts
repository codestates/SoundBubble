import { Entity, Column, BaseEntity, OneToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { User } from "./User";

@Entity({
  name: "UserTokens",
})
export class UserToken extends BaseEntity {
  @PrimaryColumn()
  userId!: number;

  @Column()
  refreshToken!: string;

  @OneToOne((type) => User, { onDelete: "CASCADE" })
  @JoinColumn()
  user!: User;

  static async insertToken(userId: number, refreshToken: string): Promise<UserToken> {
    const newToken: UserToken = new UserToken();
    newToken.userId = userId;
    newToken.refreshToken = refreshToken;
    await newToken.save();
    return newToken;
  }
}
