import { Request, Response, RequestHandler } from "express";
import { Bubble } from "../../entity/Bubble";
import { BubbleComment } from "../../entity/BubbleComment";

const readBubble: RequestHandler = async (req: Request, res: Response) => {
  const { id: bubbleId }: { id: string } = req.params as any;

  try {
    //* 버블 조회
    const bubble: Bubble | undefined = await Bubble.findBubble(Number(bubbleId));

    if (!bubble) {
      return res.status(404).json({ message: "Bubble not found" });
    }

    //* 해당 버블의 댓글 조회
    const comments: BubbleComment[] = await BubbleComment.findComments(Number(bubbleId));

    res.status(200).json({ data: { bubble, comments }, message: "Bubble and comments successfully read" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to read bubble and comments" });
  }
};

export default readBubble;
