import { Request, Response, NextFunction, RequestHandler } from "express";
import getUserInfo from "./getUserInfo";
import { RequestUserInfo, UserInfo } from "../@type/userInfo";
import { cookieOptions } from "../token";
import { log } from "../utils/log";

const authUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
	//* 토큰 획득
	const accessToken: string | undefined = req.cookies.accessToken;
	if (!accessToken) {
		return res.status(401).json({ message: "Invalid token, token does not exist" });
	}

	//* 토큰으로부터 유저 정보 획득
	const userInfo: RequestUserInfo = await getUserInfo(res, accessToken);

	//* (1) 토큰 검증 실패
	if (userInfo.error) {
		// 액세스 토큰 초기화
		res.cookie("accessToken", "", cookieOptions);
		if (userInfo.error === "EXPIRED") {
			return res.status(401).json({ message: "Expired token, login again" });
		} else if (userInfo.error === "INVALID") {
			return res.status(401).json({ message: "Invalid token, login again" });
		} else if (userInfo.error === "SERVER") {
			return res.status(500).json({ message: "Server error" });
		}
	}
	const { userId, email, accountType, accessToken: currentToken } = userInfo;
	if (!userId || !email || !accountType || !currentToken) {
		res.cookie("accessToken", "", cookieOptions);
		return res.status(401).json({ message: "Invalid token, login again" });
	}

	//* (2) 토큰 검증 성공
	// req 객체에 유저 정보를 담고 컨트롤러로 이동
	log(`[유저 ${userId}] 토큰 검증 성공: email: ${email}. accountType: ${accountType}`);
	req.userInfo = userInfo as UserInfo;
	next();
};

export default authUser;
