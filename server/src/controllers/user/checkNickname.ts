import { Request, Response, RequestHandler, NextFunction } from "express";
import { User } from "../../entity/User";
import { logError } from "../../utils/log";
import { checkNicknameFormat } from "../../utils/validate";

const checkNickname: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
	const nickname: string | undefined = req.body.nickname;

	try {
		//* 파라미터 검사
		if (!nickname || !checkNicknameFormat(nickname)) {
			return res.status(400).json({ message: `Invalid nickname(body), input 'nickname': ${nickname}` });
		}

		//* 닉네임 중복 검사
		const userUsingNickname: User | undefined = await User.findOne({ nickname });
		if (userUsingNickname) {
			// 사용 중인 닉네임
			return res.status(409).json({ message: "Nickname already in use" });
		}

		return res.status(200).json({ message: "Available nickname" });
	} catch (err) {
		logError("Failed to check nickname");
		next(err);
	}
};

export default checkNickname;
