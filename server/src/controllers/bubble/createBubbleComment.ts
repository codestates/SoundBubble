import { Request, Response, RequestHandler } from "express";
import { Bubble } from "../../entity/Bubble";
import { BubbleComment } from "../../entity/BubbleComment";
import { UserInfo } from '../../@type/tokenUserInfo';

const createBubbleComment: RequestHandler = async (req: Request, res: Response) => {
  const { userId }: { userId: number } = req.userInfo as UserInfo;
  const { id: bubbleId }: { id: string } = req.params as any;
  const { textContent }: { textContent: string | undefined } = req.body;

  if (!bubbleId || !textContent) {
    return res.status(400).json({ message: "Insufficient parameters supplied" });
  }
  try {
    const bubbleInfo: Bubble | undefined = await Bubble.findOne(bubbleId);

    if (!bubbleInfo) {
      return res.status(400).json({ message: "Invalid bubble" });
    }

    await BubbleComment.insertComment(userId, Number(bubbleId), textContent);

    const comments: BubbleComment[] = await BubbleComment.findComments(Number(bubbleId));

    res.status(201).json({ data: { comments }, message: "Comment successfully registered" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to register comment" });
  }
};

export default createBubbleComment;
