import { Request, Response, RequestHandler, NextFunction } from "express";
import { Bubble } from "../../entity/Bubble";
import { checkStartQuery, checkEndQuery, checkLimitQuery, checkOrderQuery } from "../../utils/checkQueryParam";
import { QueryOrder } from "../../@type/query";
import { logError } from "../../utils/log";

const readAllBubble: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
	const { start, end, limit, order } = req.query as { [key: string]: undefined | string };

	try {
		//* 파라미터 조정
		const _start: number = checkStartQuery(start);
		const _end: number = checkEndQuery(end);
		const _limit: number | undefined = checkLimitQuery(limit);
		const _order: QueryOrder = checkOrderQuery(order);

		//* 모든 버블 조회
		const bubbles: Bubble[] = await Bubble.findAllBubbles(_start, _end, _limit, _order);

		res.status(200).json({ data: { bubbles }, message: "All bubbles successfully read" });
	} catch (err) {
		logError("Failed to read all bubbles");
		next(err);
	}
};

export default readAllBubble;
