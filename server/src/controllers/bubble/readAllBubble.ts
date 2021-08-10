import { Request, Response, RequestHandler } from "express";
import { Bubble } from "../../entity/Bubble";
import checkQueryParams from "../../utils/checkQueryParams";

const readAllBubble: RequestHandler = async (req: Request, res: Response) => {
  let { start, end, limit, order } = req.query as any;

  try {
    const _start: number = checkQueryParams("start", start);
    const _end: number = checkQueryParams("end", end);
    const _limit: number = checkQueryParams("limit", limit);
    const _order: any = checkQueryParams("order", order);

    const bubbles: Bubble[] = await Bubble.createQueryBuilder("bubble")
      .where("bubble.id >= :sId AND bubble.id <= :eId", { sId: _start, eId: _end })
      .limit(_limit)
      .leftJoinAndSelect("bubble.user", "user")
      .select(["bubble.id", "bubble.image", "bubble.sound", "bubble.textContent", "user.nickname"])
      .orderBy("bubble.id", _order)
      .getMany();

    res.json({ data: { bubbles }, message: "All bubbles successfully read" });
  } catch (error) {
    console.error(error);
    res.json({ message: "Failed to read all bubbles" });
  }
};

export default readAllBubble;
