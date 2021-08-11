import { Request, Response, RequestHandler } from "express";
import { Bubble } from "../../entity/Bubble";
import { UserInfo } from '../../@type/tokenUserInfo';

const createBubble: RequestHandler  = async (req: Request, res: Response) => {
  const { userId }: { userId: number } = req.userInfo as UserInfo;
  const { textContent }: { textContent: string | undefined } = req.body;

  try {
    if (!textContent) {
      return res.status(400).json({ message: "Insufficient parameters supplied" });
    }

    const { image: imageInfo, sound: soundInfo } = req.files as { [fieldname: string]: Express.MulterS3.File[] };

    if (!imageInfo || !soundInfo) {
      return res.status(400).json({ message: "Image or Sound does not exist" });
    }
    const imageSrc: string = imageInfo[0].location;
    const soundSrc: string = soundInfo[0].location;

    const newBubble: Bubble = await Bubble.insertBubble(userId, textContent, imageSrc, soundSrc);

    res.status(201).json({ newBubble, message: "Bubble successfully uploaded" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to upload bubble" });
  }
};

export default createBubble;
