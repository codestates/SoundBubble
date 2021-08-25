import { Request, Response, RequestHandler, NextFunction } from "express";
import { UserInfo } from "../../@type/userInfo";
import { UserToken } from "../../entity/UserToken";
import { setAsync, setexAsync, getAsync, insertBlackList } from "../../redis";
import { log, logError } from "../../utils/log";
import { verifyAccessToken, cookieOptions } from "../../token";
import { JwtPayload } from "jsonwebtoken";
import { RedisTokenList } from "../../@type/redis";

const logout: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
	const { userId, accessToken, tokenExpIn }: { userId: number; accessToken: string; tokenExpIn: number } =
		req.userInfo as UserInfo;

	try {
		//* 토큰 블랙리스트에 만료되지 않은 액세스 토큰 저장
		if (process.env.NODE_ENV === "production") {
			await insertBlackList(userId, accessToken);
		}

		// 클라이언트 액세스 토큰 삭제
		res.cookie("accessToken", "", cookieOptions);

		// 리프레시 토큰 삭제
		const userToken: UserToken | undefined = await UserToken.findOne(userId);
		if (userToken) {
			userToken.refreshToken = "";
			await userToken.save();
		}
		res.status(200).json({ message: "Logout succeed" });
	} catch (err) {
		logError("Logout error");
		// 서버 상황에 관계 없이 사용자는 로그아웃 할 수 있어야 됨
		res.status(200).json({ message: "Logout succeed" });
		next(err);
	}
};

export default logout;
