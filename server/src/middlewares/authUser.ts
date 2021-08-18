import { Request, Response, NextFunction, RequestHandler } from "express";
import getUserInfo from "./getUserInfo";
import { RequestTokenInfo, UserInfo } from "../@type/userInfo";
import redisClient from "../redis";

const authUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
	const authorization: string | undefined = req.headers.authorization;

	//* 파라미터 검사
	if (!authorization) {
		return res.status(401).json({ message: "Invalid authorization(headers)" });
	}
	const accessToken: string = authorization.split("Bearer ")[1];
	if (!accessToken) {
		return res.status(401).json({ message: "Token must be Bearer type" });
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

	//* 블랙리스트에 등록된 토큰인지 확인
	if (process.env.NODE_ENV === "production") {
		redisClient.get(String(userId), (err, data) => {
			if (err) {
				console.log("블랙리스트 조회 실패");
				req.userInfo = userInfo as UserInfo;
				next(err);
			} else if (data) {
				console.log("데이터 존재");
				const parsedList = JSON.parse(data);
				if (parsedList.includes(currentToken)) {
					console.log("데이터내부에 토큰 존재");
					return res.status(401).json({ message: "Invalid token, login again" });
				}
			}
			console.log("데이터 없음");
			req.userInfo = userInfo as UserInfo;
			next();
		});
	} else {
		req.userInfo = userInfo as UserInfo;
		next();
	}
};

export default authUser;
