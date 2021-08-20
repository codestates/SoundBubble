import { Request, Response, RequestHandler, NextFunction } from "express";
import { User } from "../../entity/User";
import { logError } from "../../utils/log";

const checkNickname: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const nickname: string | undefined = req.body.nickname;
  
	try {
		//* 파라미터 검사
		if (!nickname) {
			return res.status(400).json({ message: `Invalid nickname(body), input 'nickname': ${nickname}` });
		}

		const maybeUser: User | undefined = await User.findOne({ where: { nickname: nickname } });
		if (maybeUser) {
			return res.status(409).json({ message: "Nickname already exists" });
		}

		return res.status(200).json({ message: "Available nickname" });
	} catch (err) {
		logError("Failed to check nickname");
		next(err);
	}
};

export default checkNickname;
