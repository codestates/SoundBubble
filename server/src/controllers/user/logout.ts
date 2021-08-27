import { Request, Response, RequestHandler, NextFunction } from "express";
import { UserInfo } from "../../@type/userInfo";
import { UserToken } from "../../entity/UserToken";
import { insertBlackList } from "../../redis";
import { logError } from "../../utils/log";
import { cookieOptions } from "../../token";

const logout: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
	const { userId, accessToken }: { userId: number; accessToken: string } = req.userInfo as UserInfo;

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
		// 서버 상황에 관계 없이 유저는 로그아웃 가능
		res.status(200).json({ message: "Logout succeed" });
		next(err);
	}
};

export default logout;
