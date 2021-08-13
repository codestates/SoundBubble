import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { User } from "./User";
import { Bubble } from "./Bubble";

@Entity({
  name: "BubbleComments",
})
export class BubbleComment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  textContent!: string;

  @CreateDateColumn({ name: "createdAt" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt!: Date;

  @Column()
  bubbleId!: number;

  @ManyToOne((type) => Bubble, (bubble) => bubble.bubbleComments, { onDelete: "CASCADE" })
  bubble!: Bubble;

  @Column()
  userId!: number;

  @ManyToOne((type) => User, (user) => user.bubbles, { onDelete: "CASCADE" })
  user!: User;

  static async insertComment(userId: number, bubbleId: number, textContent: string): Promise<BubbleComment> {
    const newBubbleComment: BubbleComment = new BubbleComment();
    newBubbleComment.userId = userId;
    newBubbleComment.bubbleId = bubbleId;
    newBubbleComment.textContent = textContent;
    await newBubbleComment.save();
    return newBubbleComment;
  }

  static async findComments(bubbleId: number): Promise<BubbleComment[]> {
    const comments: BubbleComment[] = await this.createQueryBuilder("comment")
      .where("bubbleId = :id", { id: bubbleId })
      .leftJoinAndSelect("comment.user", "user")
      .select(["comment.id", "comment.bubbleId", "comment.textContent", "comment.createdAt", "user.email", "user.nickname"])
      .getMany();
    return comments;
  }
}
