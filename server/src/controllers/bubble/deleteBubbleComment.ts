import { Request, Response, RequestHandler } from "express";
import { User } from "../../entity/User";
import { Bubble } from "../../entity/Bubble";
import { BubbleComment } from "../../entity/BubbleComment";

const deleteBubbleComment: RequestHandler = async (req: Request, res: Response) => {
  const { userId, accountType } = req.userInfo as any;
  const { id: bubbleId }: { id: string } = req.params as any;
  const { commentId }: { commentId: number | string } = req.body as any;

  if (!commentId) {
    return res.status(400).json({ message: "Insufficient parameters supplied" });
  }

  try {
    const bubbleInfo: Bubble | undefined = await Bubble.findOne(bubbleId);

    if (!bubbleInfo) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const commentInfo: BubbleComment | undefined = await BubbleComment.findOne(commentId);

    if (!commentInfo) {
      return res.status(400).json({ message: "Invalid request" });
    }

    if (accountType === "admin") {
      await commentInfo.remove();
    } else {
      if (commentInfo.userId === userId) {
        await commentInfo.remove();
      } else {
        return res.status(400).json({ message: "Invalid request" });
      }
    }        

    const comments = await BubbleComment.createQueryBuilder("comment")
      .where("bubbleId = :id", { id: bubbleId })
      .leftJoinAndSelect("comment.user", "user")
      .select(["comment.id", "comment.textContent", "user.nickname"])
      .getMany();

    res.json({ data: { comments }, message: "Comment successfully deleted" });
  } catch (error) {
    console.error(error);
    res.json({ message: "Failed to delete comment" });
  }
};

export default deleteBubbleComment;
