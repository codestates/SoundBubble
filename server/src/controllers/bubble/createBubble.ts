import { Request, Response, RequestHandler } from "express";
import { User } from "../../entity/User";
import { Bubble } from "../../entity/Bubble";

const createBubble: RequestHandler  = async (req: Request, res: Response) => {
  //* 임시로 userId를 이용하여 유저 특정 -> 토큰에서 검증한 값으로 변경
  // const { userId }: { userId: number; } = req.body;
  const userId = 1;
  //* ---------------------------

  const { textContent }: { textContent: string } = req.body as any;

  try {
    if (!textContent) {
      return res.status(422).json({ message: "Insufficient parameters supplied" });
    }

    //! Not necessary. 토큰으로 검증된 유저만 접근 가능하기 때문
    const userInfo: User | undefined = await User.findOne(userId);
    if (!userInfo) {
      return res.status(400).json({ message: "no user" });
    }
    //! ---------------------------

    const { image: imageInfo, sound: soundInfo } = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!imageInfo || !soundInfo) {
      return res.status(400).json({ message: "Image or Sound does not exist" });
    }
    const imageSrc: string = imageInfo[0].location;
    const soundSrc: string = soundInfo[0].location;

    const newBubble: Bubble = new Bubble();
    newBubble.image = imageSrc;
    newBubble.sound = soundSrc;
    newBubble.textContent = textContent;
    newBubble.userId = userId;

    newBubble.save();

    res.status(201).json({ message: "create succeed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to upload bubble" });
  }
};

export default createBubble;
