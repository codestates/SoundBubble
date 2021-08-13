import { Request, RequestHandler, Response } from "express";
import { Bubble } from "../../entity/Bubble";
import { User } from "../../entity/User";
import { UserInfo } from "../../@type/tokenUserInfo";

const readMyBubble:RequestHandler = async (req: Request, res: Response) => {
  const { userId }: { userId: number } = req.userInfo as UserInfo;

  try {
    const userInfo = await User.findOne(userId);

    if (!userInfo) {
      return res.status(404).json({ message: "User not found" });
    }
    const bubbles: Bubble[] = await Bubble.findBubblesByUserId(userId);
    return res.status(200).json({ data: {bubbles}, message: "All my bubbles successfully read" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to read all bubbles" });
  }
};

export default readMyBubble;
