import { Request, Response, RequestHandler, NextFunction } from "express";
import { UserInfo } from "../../@type/userInfo";
import { UserToken } from "../../entity/UserToken";
import redisClient from "../../redis";
import { logError } from "../../utils/log";

const logout: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
	const { userId, accessToken, tokenExpiredIn }: { userId: number; accessToken: string; tokenExpiredIn: number } =
		req.userInfo as UserInfo;
	
	try {
		if (process.env.NODE_ENV === "production") {
			console.log("비동기 테스트1");
			redisClient.get(String(userId), async (err, data) => {
				if (err) {
					logError("Redis 조회 실패");
				} else if (data) {
					const parsedList = JSON.parse(data);
					parsedList.push(accessToken);
					redisClient.setex(String(userId), tokenExpiredIn, JSON.stringify(parsedList));
					console.log("Redis 추가 토큰 등록");
				} else {
					const blackList = [];
					blackList.push(accessToken);
					redisClient.setex(String(userId), tokenExpiredIn, JSON.stringify(blackList));
					console.log("Redis 신규 토큰 등록");
				}

				const userToken: UserToken | undefined = await UserToken.findOne(userId);
				if (userToken) {
					userToken.refreshToken = "";
					await userToken.save();
				}
				console.log("비동기 테스트2");
				res.status(200).json({ message: "Logout succeed" });
			});
			console.log("비동기 테스트3");
		} else {
			res.status(200).json({ message: "Logout succeed" });
		}
	} catch (err) {
		logError("Failed to logout");
		res.status(200).json({ message: "Logout faild" });
		next(err);
	}
};

export default logout;
