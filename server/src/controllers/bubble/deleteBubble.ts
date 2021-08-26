import { Request, Response, RequestHandler, NextFunction } from "express";
import { Bubble } from "../../entity/Bubble";
import { deleteResource } from "../../aws/s3";
import { UserInfo } from "../../@type/userInfo";
import { logError } from "../../utils/log";

const deleteBubble: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
	const { userId, accountType }: { userId: number; accountType: string } = req.userInfo as UserInfo;
	const bubbleId: number = Number(req.params.id) as number;

	try {
		//* 파라미터 검사
		if (isNaN(bubbleId)) {
			return res.status(400).json({ message: `Invalid bubbleId(query), input 'bubbleId': ${bubbleId}` });
		}

		//* 버블 조회. 존재하는 버블인지 확인
		const bubbleInfo: Bubble | undefined = await Bubble.findOne(bubbleId);

		if (!bubbleInfo) {
			return res.status(404).json({ message: "Bubble not found" });
		}

		const soundSrc: string = bubbleInfo.sound.split("/").pop() as string;
		const imageSrc: string = bubbleInfo.image.split("/").pop() as string;
		const thumbnailSrc: string = bubbleInfo.thumbnail.split("/").pop() as string;

		//* 버블 삭제
		// 관리자 -> 모든 버블 삭제 가능
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
	} catch (err) {
		logError("Failed to delete bubble");
		next(err);
	}
};

export default deleteBubble;
