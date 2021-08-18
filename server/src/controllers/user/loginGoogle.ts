import { Request, Response, RequestHandler, NextFunction } from "express";
import { User } from "../../entity/User";
import { UserToken } from "../../entity/UserToken";
import { generateAccessToken, generateRefreshToken } from "../token/index";
import { LoginTicket, OAuth2Client, TokenPayload } from "google-auth-library";
import { GoogleTokenPayload } from "../../@type/oAuthUserInfo";
import { GetTokenResponse } from "google-auth-library/build/src/auth/oauth2client";
import { logError } from "../../utils/log";

const loginGoogle: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
	//* 클라이언트로부터 Authorization Code 획득
	const authorizationCode: string | undefined = req.body.authorizationCode;

	try {
		//* 파라미터 검사
		if (!authorizationCode) {
			return res.status(400).json({ message: "Code(body) does not exist" });
		}

		//* 구글 유저 정보 획득
		const googleClientId = process.env.GOOGLE_CLIENT_ID as string;
		const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET as string;
		const redirect_url = process.env.CLIENT_REDIRECT_URL as string;

		const googleClient: OAuth2Client = new OAuth2Client(googleClientId, googleClientSecret, redirect_url);

		//* 구글 토큰 획득
		let response: GetTokenResponse | undefined;
		try {
			response = await googleClient.getToken(authorizationCode);
		} catch (err) {
			console.log("Invalid Authorization Code");
			console.error(err);
			return res.status(400).json({ message: "Invalid code(body), failed to get token" });
		}
		if (!response.tokens || !response.tokens.id_token) {
			return res.status(400).json({ message: "Invalid code(body), failed to get token" });
		}

		//* 구글 id 토큰 검증하여 유저 정보 획득
		const idToken: string = response.tokens.id_token;

		const ticket: LoginTicket = await googleClient.verifyIdToken({ idToken: idToken });
		const googleUserInfo: TokenPayload | undefined = ticket.getPayload();

		if (!googleUserInfo || !googleUserInfo.email || !googleUserInfo.name) {
			return res.status(400).json({ message: "Invalid code(body), failed to get user information" });
		}

		const { email, name }: { email: string; name: string } = googleUserInfo as GoogleTokenPayload;

		const user: User | undefined = await User.findOne({ email });
		//* 유저 없음 -> 회원가입
		if (!user) {
			if (googleUserInfo.picture) {
				const profileImage: string = googleUserInfo.picture;
				await User.insertUser(email, "", name, "google", "user", profileImage);
			} else {
				await User.insertUser(email, "", name, "google", "user");
			}
			res.status(201);
		} else {
			res.status(200);
		}

		//* 유저 존재. 소셜 로그인 대신 먼저 이메일로 가입한 유저
		//? 이메일 도용 문제 존재
		//! 일반 회원가입 -> 소셜 로그인 가능. 소셜 로그인 -> 일반 회원가입 불가.(소셜 로그인 유저는 비밀번호 변경을 통해 일반 로그인 가능)
		if (user && user.signUpType === "email") {
			user.signUpType = "intergration"; // 계정 통합
			await user.save();
		}

		const userInfo = (await User.findUserByEmail(email)) as User;

		//* 토큰 발급
		const accessToken: string = generateAccessToken(userInfo);
		const refreshToken: string = generateRefreshToken(userInfo);

		await UserToken.insertToken(userInfo.id, refreshToken);

		return res.json({ data: { accessToken, userInfo }, message: "Login succeed" });
	} catch (err) {
		logError("Faild to google login");
		next(err);
	}
};

export default loginGoogle;
