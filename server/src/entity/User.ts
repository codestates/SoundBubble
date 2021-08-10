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

@Entity({
  name: "Users",
})
export class User extends BaseEntity {
  // Active Record 패턴. 모델에서 바로 메소드 사용 가능
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
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
}
