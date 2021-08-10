import { Request, Response } from "express";
import { Bubble } from "../../entity/Bubble";
import { BubbleComment } from "../../entity/BubbleComment";

import checkQueryParams from "../../utils/checkQueryParams";

const readBubble = async (req: Request, res: Response) => {
  const { id: bubbleId }: { id: string } = req.params as any;
  let { order } = req.query as any;

  try {
    const _order = checkQueryParams("order", order);

    const bubble: Bubble | undefined = await Bubble.createQueryBuilder("bubble")
      .where("bubble.id = :id", { id: bubbleId })
      .leftJoinAndSelect("bubble.user", "user")
      .select(["bubble.id", "bubble.image", "bubble.sound", "bubble.textContent", "user.nickname"])
      .getOne();

    if (!bubble) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const comments = await BubbleComment.createQueryBuilder("comment")
      .where("bubbleId = :id", { id: bubble.id })
      .leftJoinAndSelect("comment.user", "user")
      .select(["comment.id", "comment.textContent", "user.nickname"])
      .orderBy("comment.id", _order)
      .getMany();

    res.json({ data: { bubble, comments }, message: "All bubble info successfully read" });
  } catch (error) {
    console.error(error);
    res.json({ message: "Failed to read all bubbles" });
  }
};

export default readBubble;
