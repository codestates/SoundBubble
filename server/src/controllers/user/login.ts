import { Request, Response, RequestHandler, NextFunction } from "express";
import { User } from "../../entity/User";
import { UserToken } from "../../entity/UserToken";
import { checkEmailFormat, checkPasswordFormat } from "../../utils/validate";
import { generateAccessToken, generateRefreshToken, cookieOptions } from "../../token";
import hash from "../../utils/hash";
import { logError } from "../../utils/log";
import { insertWhiteList } from "../../redis";

const login: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
	const { email, password }: { email: string; password: string } = req.body;

	try {
		//* 파라미터 검사
		if (!email || !checkEmailFormat(email)) {
			return res.status(400).json({ message: `Invalid email(body), input 'email': ${email}` });
		}
		if (!password || !checkPasswordFormat(password)) {
			return res.status(400).json({ message: `Invalid password(body)` });
		}

		//* 유저 조회
		const hashedPassword: string = hash(password);

		const userInfo: User | undefined = await User.findUserByEmail(email, hashedPassword);

		if (!userInfo || (userInfo.signUpType !== "email" && userInfo.signUpType !== "intergration")) {
			// 계정 정보가 없거나, 소셜 로그인으로 가입하고 비밀번호 설정을 안한 유저는 기존 로그인 사용 불가
			return res.status(401).json({ message: "Not authorized" });
		}

		//* 토큰 발급
		const accessToken: string = generateAccessToken(userInfo);
		const refreshToken: string = generateRefreshToken(userInfo);

		// DB에 리프레시 토큰 저장
		await UserToken.insertToken(userInfo.id, refreshToken);

		// 토큰 화이트리스트에 액세스 토큰 저장
		if (process.env.NODE_ENV === "production") {
			await insertWhiteList(userInfo.id, accessToken);
		}

		// 응답 쿠키에 액세스 토큰 설정
		res.cookie("accessToken", accessToken, cookieOptions);

		return res.status(201).json({ data: { accessToken, userInfo }, message: "Login succeed" });
	} catch (err) {
		logError("Failed to login");
		next(err);
	}
};

export default login;
