import { Request, Response, RequestHandler, NextFunction } from "express";
import { Bubble } from "../../entity/Bubble";
import { BubbleComment } from "../../entity/BubbleComment";
import { logError } from "../../utils/log";

const readBubble: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
	const bubbleId: string = req.params.id as string;

	try {
		//* 파라미터 검사
		if (isNaN(Number(bubbleId))) {
			return res.status(400).json({ message: `Invalid bubbleId(param), input 'bubbleId': ${bubbleId}` });
		}

		//* 버블 조회
		const bubble: Bubble | undefined = await Bubble.findBubble(Number(bubbleId));

		if (!bubble) {
			return res.status(404).json({ message: "Bubble not found" });
		}


		//* 해당 버블의 댓글 조회
		const comments: BubbleComment[] = await BubbleComment.findComments(Number(bubbleId));

		res.status(200).json({ data: { bubble, comments }, message: "Bubble and comments successfully read" });
	} catch (err) {
		logError("Failed to read bubble and comments");
		next(err);
	}
};

export default readBubble;
