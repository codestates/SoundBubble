import { Request, Response, NextFunction, RequestHandler } from "express";
import getUserInfo from "./getUserInfo";
import { RequestTokenInfo, UserInfo } from "../@type/userInfo";
import { getAsync } from "../redis";
import { log, logError } from "../utils/log";

const authUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
	// const authorization: string | undefined = req.headers.authorization;
	const accessToken: string | undefined = req.cookies.AccessToken;

	//* 파라미터 검사
	// if (!authorization) {
	// 	return res.status(401).json({ message: "Invalid authorization(headers)" });
	// }
	// const accessToken: string = authorization.split("Bearer ")[1];
	// if (!accessToken) {
	// 	return res.status(401).json({ message: "Token must be Bearer type" });
	// }
	if (!accessToken) {
		return res.status(401).json({ message: "Invalid token, token does not exist" });
	}

	//* 토큰으로부터 유저 정보 획득
	const userInfo: RequestTokenInfo = await getUserInfo(res, accessToken);

	if (userInfo.error) {
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
		return res.status(401).json({ message: "Invalid token, login again" });
	}

	//! 블랙리스트에 등록된 토큰인지 확인
	// if (process.env.NODE_ENV === "production") {
	// 	try {
	// 		const data: string | null = await getAsync(String(userId));

	// 		if (data) {
	// 			const parsedList: string[] = JSON.parse(data);
	// 			if (parsedList.includes(currentToken)) {
	// 				log(`[유저 ${userId}] 토큰 검증 실패: 블랙리스트에 등록된 토큰 사용`);
	// 				return res.status(401).json({ message: "Invalid token, login again" });
	// 			}
	// 		}
	// 	} catch (err) {
	// 		logError("[유저 ${userId}] 블랙리스트 조회 실패");
	// 		next(err);
	// 	}
	// }

	//* req 객체에 유저 정보를 담고 컨트롤러로 이동
	log(`[유저 ${userId}] 토큰 검증 성공: email: ${email}. accountType: ${accountType}`);
	req.userInfo = userInfo as UserInfo;
	next();
};

export default authUser;
