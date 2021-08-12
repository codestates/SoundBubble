import { Request, Response, RequestHandler } from "express";
import { Bubble } from "../../entity/Bubble";
import { deleteResource } from "../../aws/s3";
import { UserInfo } from '../../@type/tokenUserInfo';

const deleteBubble: RequestHandler = async (req: Request, res: Response) => {
  const { userId, accountType }: { userId: number; accountType: string } = req.userInfo as UserInfo;
  const { id: bubbleId }: { id: string } = req.params as any;

  if (!bubbleId) {
    return res.status(400).json({ message: "Insufficient parameters supplied" });
  }
  try {
    const bubbleInfo: Bubble | undefined = await Bubble.findOne(bubbleId);

    if (!bubbleInfo) {
      return res.status(400).json({ message: "Invalid bubble" });
    }

    const soundSrc: string = bubbleInfo.sound.split("/").pop() as string;
    const imageSrc: string = bubbleInfo.image.split("/").pop() as string;
    const thumbnailSrc: string = bubbleInfo.thumbnail.split("/").pop() as string;

    if (accountType === "admin") {
      await bubbleInfo.remove();
    } else {
      if (bubbleInfo.userId === userId) {
        await bubbleInfo.remove();
      } else {
        return res.status(400).json({ message: "Invalid request" });
      }
    }

    await deleteResource("soundbubble-resource/sound", soundSrc);
    await deleteResource("soundbubble-resource/original", imageSrc);
    await deleteResource("soundbubble-resource/thumb", thumbnailSrc);

    res.status(201).json({ message: "Bubble successfully deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to delete bubble" });
  }
};

export default deleteBubble;
