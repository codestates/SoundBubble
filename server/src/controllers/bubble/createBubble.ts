import { Request, Response, RequestHandler } from "express";
import { Bubble } from "../../entity/Bubble";
import { UserInfo } from "../../@type/tokenUserInfo";

const createBubble: RequestHandler = async (req: Request, res: Response) => {
  const { userId }: { userId: number } = req.userInfo as UserInfo;
  const { textContent }: { textContent: string | undefined } = req.body;
  
  try {
    //* 파라미터 검사
    if (!textContent) {
      return res.status(400).json({ message: `Invalid textContent(FormData), input 'textContent': ${textContent}` });
    }
    const { image: imageInfo, sound: soundInfo } = req.files as { [fieldname: string]: Express.MulterS3.File[] };
    if (!imageInfo) {
      return res.status(400).json({ message: `Invalid image(FormData), input 'image': ${imageInfo}` });
    }
    if (!soundInfo) {
      return res.status(400).json({ message: `Invalid sound(FormData), input 'sound': ${soundInfo}` });
    }

    //* 이미지 및 소리 경로 추출
    const imageSrc: string = imageInfo[0].location;
    const thumbnailSrc: string = imageSrc.replace("original", "thumb").replace("jpg", "jpeg");
    const soundSrc: string = soundInfo[0].location;

    //* DB 입력
    await Bubble.insertBubble(userId, textContent, imageSrc, soundSrc, thumbnailSrc);

    res.status(201).json({ message: "Bubble successfully uploaded" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to upload bubble" });
  }
};

export default createBubble;
