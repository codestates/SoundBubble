import axios from "axios";
import { Request, Response, RequestHandler, NextFunction } from "express";
import { User } from "../../entity/User";
import { UserToken } from "../../entity/UserToken";
import { generateAccessToken, generateRefreshToken, cookieOptions } from "../../token";
import { logError } from "../../utils/log";
import { insertWhiteList } from "../../redis";

const loginNaver: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
	//* 클라이언트로부터 Authorization Code 획득
	const { authorizationCode }: { authorizationCode: string } = req.body;

	try {
		//* 파라미터 검사
		if (!authorizationCode) {
			return res.status(400).json({ message: "Invalid code(body), failed to get token" });
		}

		//* 네이버 토큰 획득
		const NaverClientId = process.env.NAVER_CLIENT_ID as string;
		const NaverClientSecret = process.env.NAVER_CLIENT_SECRET as string;
		const NaverRedirectUri = process.env.NAVER_REDIRECT_URI as string;

		const token = await axios({
			url: "https://nid.naver.com/oauth2.0/token",
			method: "post",
			params: {
				client_id: NaverClientId,
				client_secret: NaverClientSecret,
				code: authorizationCode,
				redirect_uri: NaverRedirectUri,
				grant_type: "authorization_code",
				state: "naverstate",
			},
		});

		const naverAccessToken: string | undefined = token.data.access_token;
		if (!naverAccessToken) {
			return res.status(400).json({ message: "Invalid code(body), failed to get token" });
		}

		//* 액세스 토큰으로 유저 정보 요청
		const profile = await axios({
			url: "https://openapi.naver.com/v1/nid/me",
			headers: {
				Authorization: `bearer ${naverAccessToken}`,
			},
		});

		const { email, nickname }: { email: string; nickname: string } = profile.data.response;
		if (!email || !nickname) {
			return res.status(406).json({ message: "Invalid scope, failed to get user information" });
		}

		//* 유저 검색
		const userUsingEmail: User | undefined = await User.findOne({ email });
		// (1) 유저 없음 -> 회원가입
		if (!userUsingEmail) {
			// 유효한 닉네임 획득
			const validName: string | undefined = await User.getValidNickname(nickname);
			if (!validName) {
				return next(new Error("Failed to get valid nickname"));
			}

			const profileImage: string = profile.data.response.profile_image;
			if (profileImage) {
				await User.insertUser(email, "", validName, "naver", "user", profileImage);
			} else {
				await User.insertUser(email, "", validName, "naver", "user");
			}
			res.status(201);
		} else {
			res.status(200);
		}

		// (2) 유저 존재. 소셜 로그인 대신 먼저 이메일로 가입한 유저
		if (userUsingEmail && userUsingEmail.signUpType === "email") {
			userUsingEmail.signUpType = "intergration"; // 계정 통합
			await userUsingEmail.save();
		}

		const userInfo: User = (await User.findUserByEmail(email)) as User;

		//* 토큰 발급
		const accessToken: string = generateAccessToken(userInfo);
		const refreshToken: string = generateRefreshToken(userInfo);

		await UserToken.insertToken(userInfo.id, refreshToken);

		if (process.env.NODE_ENV === "production") {
			await insertWhiteList(userInfo.id, accessToken);
		}

		res.cookie("accessToken", accessToken, cookieOptions);

		return res.json({ data: { accessToken, userInfo }, message: "Login succeed" });
	} catch (err) {
		logError("Faild to Naver login");
		next(err);
	}
};

export default loginNaver;
