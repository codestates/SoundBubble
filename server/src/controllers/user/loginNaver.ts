import axios from "axios";
import { Request, Response, RequestHandler } from "express";
import { User } from "../../entity/User";
import { UserToken } from "../../entity/UserToken";
import { generateAccessToken, generateRefreshToken } from "../token/index";

const loginNaver: RequestHandler = async (req: Request, res: Response) => {
	//* 클라이언트로부터 Authorization Code 획득
	const { authorizationCode }: { authorizationCode: string } = req.body;

	try {
		//* 파라미터 검사
		if (!authorizationCode) {
			return res.status(400).json({ message: "Code(body) does not exist" });
		}

		//* 네이버 아이디 로그인 버튼 생성
		const NaverClientId = process.env.NAVER_CLIENT_ID as string;
		const NaverClientSecret = process.env.NAVER_CLIENT_SECRET as string;
		const NaverRedirectUri = process.env.NAVER_REDIRECT_URI as string;

		//* 토큰 발급
		const data = await axios({
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
    
    const naverAccessToken = data.data.access_token;

		//* 유저 정보 요청
		const profile = await axios({
			url: "https://openapi.naver.com/v1/nid/me",
			headers: {
				Authorization: `bearer ${naverAccessToken}`,
			},
		});

		//* 회원가입된 유저인지 확인
		const email = profile.data.response.email;
		const user: User | undefined = await User.findOne({ email });

		if (!user) {
			const nickname = profile.data.response.nickname;
			const profileImage = profile.data.response.profileImage;

			console.log("nickname", nickname);
			console.log("profileImage", profileImage);

			if (profileImage) {
				await User.insertUser(email, "", nickname, "naver", "user", profileImage);
			} else {
				await User.insertUser(email, "", nickname, "naver", "user");
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
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Faild to Naver login" });
	}
};

export default loginNaver;
