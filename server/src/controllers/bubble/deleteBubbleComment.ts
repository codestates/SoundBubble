import { Request, Response, RequestHandler } from "express";
import { Bubble } from "../../entity/Bubble";
import { BubbleComment } from "../../entity/BubbleComment";
import { UserInfo } from '../../@type/tokenUserInfo';

const deleteBubbleComment: RequestHandler = async (req: Request, res: Response) => {
  const { userId, accountType }: { userId: number; accountType: string } = req.userInfo as UserInfo;
  const { id: bubbleId }: { id: string } = req.params as any;
  const { commentId }: { commentId: number | string } = req.body;

  if (!commentId) {
    return res.status(400).json({ message: "Insufficient parameters supplied" });
  }

  try {
    const bubbleInfo: Bubble | undefined = await Bubble.findOne(bubbleId);

    if (!bubbleInfo) {
      return res.status(400).json({ message: "Invalid bubble" });
    }

    const commentInfo: BubbleComment | undefined = await BubbleComment.findOne(commentId);

    if (!commentInfo) {
      return res.status(400).json({ message: "Invalid comment" });
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

    const comments: BubbleComment[] = await BubbleComment.findComments(Number(bubbleId));

    res.json({ data: { comments }, message: "Comment successfully deleted" });
  } catch (error) {
    console.error(error);
    res.json({ message: "Failed to delete comment" });
  }
};

export default deleteBubbleComment;
