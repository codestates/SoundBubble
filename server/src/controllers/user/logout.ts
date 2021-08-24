import { Request, Response, RequestHandler, NextFunction } from "express";
import { UserInfo } from "../../@type/userInfo";
import { UserToken } from "../../entity/UserToken";
import { setexAsync, getAsync } from "../../redis";
import { logError } from "../../utils/log";
import { verifyAccessToken } from "../../token";
import { JwtPayload } from "jsonwebtoken";

const logout: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
	const { userId, accessToken, tokenExpIn }: { userId: number; accessToken: string; tokenExpIn: number } =
		req.userInfo as UserInfo;

	try {
		if (process.env.NODE_ENV === "production") {
			const data: string | null = await getAsync(String(userId));

			if (data) {
				let parsedList: string[] = JSON.parse(data);

				// 토큰을 저장된 순서대로 검사하여 만료되었으면 삭제
				let validTokenIdx = -1;
				for (let i = 0; i < parsedList.length; i++) {
					const decoded: JwtPayload = await verifyAccessToken(parsedList[i]);
					if (!decoded.error) {
						// 아직 만료되지 않은 토큰이 있으면 중지
						validTokenIdx = i;
						break;
					}
					// 전부 만료된 토큰
					validTokenIdx = parsedList.length;
				}
				if (validTokenIdx >= 1) {
					parsedList = parsedList.slice(validTokenIdx);
					console.log(`${validTokenIdx}개의 만료된 토큰 삭제`);
				}

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
		res.status(200).json({ message: "Logout succeed" });
		next(err);
	}
};

export default logout;
