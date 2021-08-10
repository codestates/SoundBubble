import { Request, Response, RequestHandler } from "express";
import { Bubble } from "../../entity/Bubble";

const createBubble: RequestHandler  = async (req: Request, res: Response) => {
  const { userId } = req.userInfo as any;
  const { textContent }: { textContent: string } = req.body as any;

  try {
    if (!textContent) {
      return res.status(422).json({ message: "Insufficient parameters supplied" });
    }

    const { image: imageInfo, sound: soundInfo } = req.files as { [fieldname: string]: Express.MulterS3.File[] };

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
