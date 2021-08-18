import { Request, Response, RequestHandler, NextFunction } from "express";
import { UserInfo } from "../../@type/userInfo";
import { UserToken } from "../../entity/UserToken";
import { setexAsync, getAsync } from "../../redis";
import { logError } from "../../utils/log";

const logout: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
	const { userId, accessToken, tokenExpIn }: { userId: number; accessToken: string; tokenExpIn: number } =
		req.userInfo as UserInfo;

	try {
		if (process.env.NODE_ENV === "production") {
			const data: string | null = await getAsync(String(userId));

			if (data) {
				const parsedList: string[] = JSON.parse(data);
				parsedList.push(accessToken);
				await setexAsync(String(userId), tokenExpIn, JSON.stringify(parsedList));
				console.log("Redis 추가 토큰 등록");
			} else {
				const blackList: string[] = [];
				blackList.push(accessToken);
				await setexAsync(String(userId), tokenExpIn, JSON.stringify(blackList));
				console.log("Redis 신규 토큰 등록");
			}
		}

		const userToken: UserToken | undefined = await UserToken.findOne(userId);
		if (userToken) {
			userToken.refreshToken = "";
			await userToken.save();
		}
		res.status(200).json({ message: "Logout succeed" });
	} catch (err) {
		logError("Failed to logout");
		res.status(200).json({ message: "Logout faild" });
		next(err);
	}
};

export default logout;
