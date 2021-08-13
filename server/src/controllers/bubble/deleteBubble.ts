import { Request, Response, RequestHandler } from "express";
import { Bubble } from "../../entity/Bubble";
import { deleteResource } from "../../aws/s3";
import { UserInfo } from "../../@type/tokenUserInfo";

const deleteBubble: RequestHandler = async (req: Request, res: Response) => {
  const { userId, accountType }: { userId: number; accountType: string } = req.userInfo as UserInfo;
  const { id: bubbleId }: { id: string } = req.params as any;

  try {
    //* 버블 조회. 존재하는 버블인지 확인
    const bubbleInfo: Bubble | undefined = await Bubble.findOne(bubbleId);

    if (!bubbleInfo) {
      return res.status(404).json({ message: "Bubble not found" });
    }

    const soundSrc: string = bubbleInfo.sound.split("/").pop() as string;
    const imageSrc: string = bubbleInfo.image.split("/").pop() as string;
    const thumbnailSrc: string = bubbleInfo.thumbnail.split("/").pop() as string;

    //* 버블 삭제
    // 관리자 권한 -> 모든 버블 삭제 가능
    if (accountType === "admin") {
      await bubbleInfo.remove();
    }
    // 일반 유저 -> 본인이 작성한 버블만 삭제 가능
    else {
      if (bubbleInfo.userId !== userId) {
        return res.status(403).json({ message: "Not authorized" });
      } else {
        await bubbleInfo.remove();
      }
    }

    //* S3에 저장된 리소스 삭제
    await deleteResource("soundbubble-resource/sound", soundSrc);
    await deleteResource("soundbubble-resource/original", imageSrc);
    await deleteResource("soundbubble-resource/thumb", thumbnailSrc);

    res.status(200).json({ message: "Bubble successfully deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to delete bubble" });
  }
};

export default deleteBubble;
