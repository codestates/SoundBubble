import { Request, Response, RequestHandler } from "express";
import { Bubble } from "../../entity/Bubble";
import { BubbleComment } from "../../entity/BubbleComment";

const createBubbleComment: RequestHandler = async (req: Request, res: Response) => {
  const { userId } = req.userInfo as any;
  const { id: bubbleId }: { id: string } = req.params as any;
  const { textContent }: { textContent: string } = req.body as any;

  if (!bubbleId || !textContent) {
    return res.status(400).json({ message: "Insufficient parameters supplied" });
  }
  try {
    const bubbleInfo: Bubble | undefined = await Bubble.findOne(bubbleId);

    if (!bubbleInfo) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const newBubbleComment: BubbleComment = new BubbleComment();
    newBubbleComment.textContent = textContent;
    newBubbleComment.bubble = bubbleInfo;
    newBubbleComment.userId = userId;
    newBubbleComment.save();

    res.status(201).json({ message: "Comment successfully registered" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to register comment" });
  }
};

export default createBubbleComment;
