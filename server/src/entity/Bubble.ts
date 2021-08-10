import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { User } from "./User";
import { BubbleComment } from "./BubbleComment";
import { LikedBubble } from "./LikedBubble";

@Entity({
  name: "Bubbles",
})
export class Bubble extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  image!: string;

  // @Column()
  // thumbnail!: string;

  @Column()
  sound!: string;

  @Column()
  textContent!: string;

  @CreateDateColumn({ name: "createdAt" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt!: Date;
  
  @Column()
  userId!: number;

  @ManyToOne((type) => User, (user) => user.bubbles, { onDelete: "CASCADE" })
  user!: User;

  @OneToMany((type) => BubbleComment, (bubbleComment) => bubbleComment.bubble)
  bubbleComments!: BubbleComment[];

  @OneToMany((type) => LikedBubble, (likedBubble) => likedBubble.bubble)
  likedBubbles!: BubbleComment[];
}
