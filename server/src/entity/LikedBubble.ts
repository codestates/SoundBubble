import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { User } from "./User";
import { Bubble } from "./Bubble";

@Entity({
  name: "LikedBubbles",
})
export class LikedBubble extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn({ name: "createdAt" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt!: Date;

  @ManyToOne((type) => User, (user) => user.bubbles, { onDelete: 'CASCADE' })
  user!: User;

  @ManyToOne((type) => Bubble, (bubble) => bubble.likedBubbles, { onDelete: 'CASCADE' })
  bubble!: Bubble;
  
}
