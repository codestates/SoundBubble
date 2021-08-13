import { Request, Response, RequestHandler } from "express";
import { Bubble } from "../../entity/Bubble";
import checkQueryParam from "../../utils/checkQueryParam";
import { QueryOrder } from "../../@type/query";

const readAllBubble: RequestHandler = async (req: Request, res: Response) => {
  let { start, end, limit, order } = req.query as any;

  try {
    //* 파라미터 조정
    const _start: number = checkQueryParam("start", start);
    const _end: number = checkQueryParam("end", end);
    const _limit: number = checkQueryParam("limit", limit);
    const _order: QueryOrder = checkQueryParam("order", order);

    //* 모든 버블 조회
    const bubbles: Bubble[] = await Bubble.findAllBubbles(_start, _end, _limit, _order);

    res.status(200).json({ data: { bubbles }, message: "All bubbles successfully read" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to read all bubbles" });
  }
};

export default readAllBubble;
