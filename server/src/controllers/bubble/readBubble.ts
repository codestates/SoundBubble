import { Request, Response, RequestHandler } from "express";
import { Bubble } from "../../entity/Bubble";
import { BubbleComment } from "../../entity/BubbleComment";
import checkQueryParam from "../../utils/checkQueryParam";

const readBubble: RequestHandler = async (req: Request, res: Response) => {
  const { id: bubbleId }: { id: string } = req.params as any;

  try {
    const bubble: Bubble | undefined = await Bubble.findBubble(Number(bubbleId));

    if (!bubble) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const comments: BubbleComment[] = await BubbleComment.findComments(Number(bubbleId));

    res.json({ data: { bubble, comments }, message: "All bubble info successfully read" });
  } catch (error) {
    console.error(error);
    res.json({ message: "Failed to read all bubbles" });
  }
};

export default readBubble;
