import { Request, Response, RequestHandler, NextFunction } from "express";
import { User } from "../../entity/User";
import { checkEmailFormat, checkPasswordFormat, checkNicknameFormat } from "../../utils/validate";
import hash from "../../utils/hash";
import { logError } from "../../utils/log";

const signUp: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
	const { email, password, nickname }: { email: string; password: string; nickname: string } = req.body;

	try {
		//* 파라미터 검사
		if (!email || !checkEmailFormat(email)) {
			return res.status(400).json({ message: `Invalid email(body), input 'email': ${email}` });
		}
		if (!password || !checkPasswordFormat(password)) {
			return res.status(400).json({ message: "Invalid password(body)" });
		}
		if (!nickname || !checkNicknameFormat(nickname)) {
			return res.status(400).json({ message: `Invalid nickname(body), input 'nickname: ${nickname}` });
		}

		//* 유저 조회. 이메일, 닉네임 중복 확인
		const userUsingEmail: User | undefined = await User.findOne({ email });
		if (userUsingEmail) {
			return res.status(409).json({ message: "Email already in use" });
		}
		const userUsingNickname: User | undefined = await User.findOne({ nickname });
		if (userUsingNickname) {
			return res.status(409).json({ message: "Nickname already in use" });
		}	

		const hashedPassword: string = hash(password);

		//* DB 입력
		await User.insertUser(email, hashedPassword, nickname, "email", "user");

		res.status(201).json({ message: "User registration completed" });
	} catch (err) {
		logError("Failed to registration");
		next(err);
	}
};

export default signUp;
