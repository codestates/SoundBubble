import { Request, Response, RequestHandler, NextFunction } from "express";
import { Bubble } from "../../entity/Bubble";
import { UserInfo } from "../../@type/userInfo";
import { logError } from "../../utils/log";

const createBubble: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
	const { userId }: { userId: number } = req.userInfo as UserInfo;
	let textContent: string | undefined = req.body.textContent;

	try {
		//* 파라미터 검사
		const { image: imageInfo, sound: soundInfo } = req.files as { [fieldname: string]: Express.MulterS3.File[] };
		if (!imageInfo) {
			return res.status(400).json({ message: `Invalid image(FormData), input 'image': ${imageInfo}` });
		}
		if (!soundInfo) {
			return res.status(400).json({ message: `Invalid sound(FormData), input 'sound': ${soundInfo}` });
		}
		if (!textContent) {
			textContent = "";
		}

		//* 이미지 및 소리 S3 경로 추출
		const imageSrc: string = imageInfo[0].location;
		const thumbnailSrc: string = imageSrc.replace("original", "thumb").replace("jpg", "jpeg");
		const soundSrc: string = soundInfo[0].location;

		//* DB 입력
		const bubbleInfo: Bubble = await Bubble.insertBubble(userId, textContent, imageSrc, soundSrc, thumbnailSrc);

		res.setHeader("Content-Location", `/bubble/${bubbleInfo.id}`);
		res.status(201).json({ message: "Bubble successfully uploaded" });
	} catch (err) {
		logError("Failed to upload bubble");
		next(err);
	}
};

export default createBubble;
