import { Request, Response, RequestHandler, NextFunction } from "express";
import { User } from "../../entity/User";
import { checkEmailFormat } from "../../utils/validate";
import { logError } from "../../utils/log";

const checkEmail: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
	const email: string | undefined = req.body.email;

	try {
		//* 파라미터 검사
		if (!email || !checkEmailFormat(email)) {
			return res.status(400).json({ message: `Invalid email(body), input 'email': ${email}` });
		}

    //* 이메일 중복 검사
		const userUsingEmail: User | undefined = await User.findOne({ email });
		if (userUsingEmail) {
			// 사용 중인 이메일
			return res.status(409).json({ message: "Email already in use" });
		}

		return res.status(200).json({ message: "Available email" });
	} catch (err) {
		logError("Failed to check email");
		next(err);
	}
};

export default checkEmail;
