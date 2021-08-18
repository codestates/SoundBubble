import { Request, Response, RequestHandler, NextFunction } from "express";
import { UserInfo } from "../../@type/userInfo";
import { UserToken } from "../../entity/UserToken";
import redisClient from "../../redis";
import { logError } from "../../utils/log";

const logout: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
	const { userId, accessToken }: { userId: number; accessToken: string } = req.userInfo as UserInfo;

	try {
		redisClient.get(String(userId), async (error, data) => {
			if (error) {
				logError("Redis 조회 실패");
			} else if (data) {
				const parsedList = JSON.parse(data);
				parsedList.push(accessToken);
				redisClient.setex(String(userId), 86400, JSON.stringify(parsedList));
				console.log("Redis 추가 토큰 등록");
			} else {
				const blackList = [];
				blackList.push(accessToken);
				redisClient.setex(String(userId), 86400, JSON.stringify(blackList));
				console.log("Redis 신규 토큰 등록");
			}

			const userToken: UserToken | undefined = await UserToken.findOne(userId);
			if (userToken) {
				userToken.refreshToken = "";
				await userToken.save();
			}

			res.status(200).json({ message: "Logout succeed" });
		});
	} catch (err) {
    logError("Failed to logout");
    res.status(200).json({ message: "Logout failed" });
		// next(err);
	}
};

export default logout;
