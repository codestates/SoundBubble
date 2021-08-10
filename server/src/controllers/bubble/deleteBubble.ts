import { Request, Response } from "express";
import { User } from "../../entity/User";
import { Bubble } from "../../entity/Bubble";
import { deleteResource } from "../../aws/s3";

const deleteBubble = async (req: Request, res: Response) => {
  //* 임시로 userId를 이용하여 유저 특정 -> 토큰에서 검증한 값으로 변경
  const userId = 1;
  //* ---------------------------

  const { id: bubbleId }: { id: string } = req.params as any;

  if (!bubbleId) {
    return res.status(400).json({ message: "Insufficient parameters supplied" });
  }
  try {
    const userInfo: User = (await User.findOne(userId)) as User;  //! Not necessary. 토큰에 권한 정보 존재
    const bubbleInfo: Bubble | undefined = await Bubble.findOne(bubbleId);

    if (!bubbleInfo) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const soundSrc: string = bubbleInfo.sound.split("/").pop() as string;
    const imageSrc: string = bubbleInfo.image.split("/").pop() as string;

    console.log(userInfo, bubbleInfo);

    if (userInfo.accountType === "admin") {
      await bubbleInfo.remove();
    } else {
      if (bubbleInfo.userId === userId) {
        await bubbleInfo.remove();
      } else {
        console.log('본인 아님')
        return res.status(400).json({ message: "Invalid request" });
      }
    }

    await deleteResource("soundbubble-resource/resource", soundSrc);
    await deleteResource("soundbubble-resource/resource", imageSrc);

    res.status(201).json({ message: "Bubble successfully deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to delete bubble" });
  }
};

export default deleteBubble;
