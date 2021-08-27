import { Response } from "express";
import {
	verifyAccessToken,
	verifyExpiredAccessToken,
	verifyRefreshToken,
	generateAccessToken,
	cookieOptions,
} from "../token";
import { RequestUserInfo } from "../@type/userInfo";
import { User } from "../entity/User";
import { UserToken } from "../entity/UserToken";
import { JwtPayload } from "jsonwebtoken";
import { log, logError } from "../utils/log";
import { checkBlackList, checkWhiteList, clearWhiteList, insertWhiteList } from "../redis";

const getUserInfo = async (res: Response, accessToken: string): Promise<RequestUserInfo> => {
	//* 요청의 유저 정보 초기값
	const tokenInfo: RequestUserInfo = {
		userId: null,
		email: null,
		accountType: null,
		accessToken: null,
		error: null,
	};

	try {
		// 토큰 검사
		const decoded: JwtPayload = await verifyAccessToken(accessToken);
		//* (1) 유효하지 않은 토큰
		if (decoded.error) {
			//* (1-1) 만료된 토큰
			if (decoded.name === "TokenExpiredError") {
				// 만료된 액세스 토큰 강제 검증
				const decodedExpired: JwtPayload = await verifyExpiredAccessToken(accessToken);
				log(`[유저 ${decodedExpired.userId}] 액세스 토큰 만료`);
				if (!decodedExpired.userId || !decodedExpired.email || !decodedExpired.accountType) {
					tokenInfo.error = "INVALID";
					return tokenInfo;
				}

				//? 화이트 리스트에 등록된 토큰인지 확인
				if (process.env.NODE_ENV === "production") {
					const isTokenInWhiteList = await checkWhiteList(decodedExpired.userId, accessToken);
					if (!isTokenInWhiteList) {
						tokenInfo.error = "INVALID";
						return tokenInfo;
					}
				}

				// 검증한 값으로 유저를 특정하여 리프레시 토큰 획득
				const userInfo: User | undefined = await User.findOne(decodedExpired.userId);
				if (!userInfo) {
					logError("존재하지 않는 유저의 토큰 사용");
					tokenInfo.error = "INVALID";
					return tokenInfo;
				}
				const userToken: UserToken | undefined = await UserToken.findOne(userInfo.id);
				if (!userToken) {
					tokenInfo.error = "INVALID";
					return tokenInfo;
				}

				// 리프레시 토큰 검증
				const refreshToken: string = userToken.refreshToken;
				const decodedRefresh: JwtPayload = await verifyRefreshToken(refreshToken);
				if (decodedRefresh.error) {
					// 검증 실패
					if (decodedRefresh.name === "TokenExpiredError") {
						tokenInfo.error = "EXPIRED";
					} else if (decodedRefresh.name === "JsonWebTokenError") {
						tokenInfo.error = "INVALID";
					}
					// -> 리프레시 토큰 삭제
					log(`[유저 ${userToken.userId}] 리프레시 토큰 만료`);
					userToken.refreshToken = "";
					await userToken.save();

					// -> 토큰 화이트리스트 삭제
					if (process.env.NODE_ENV === "production") {
						await clearWhiteList(userToken.userId);
					}

					return tokenInfo;
				}

				// 검증 성공 -> 액세스 토큰 재발급, 응답 쿠키에 저장
				const newAccessToken: string = await generateAccessToken(userInfo);
				res.cookie("accessToken", newAccessToken, cookieOptions);
				log(`[유저 ${userInfo.id}] 액세스 토큰 재발급 완료`);

				// 토큰 화이트리스트에 액세스 토큰 저장
				if (process.env.NODE_ENV === "production") {
					await insertWhiteList(userInfo.id, newAccessToken);
				}

				// 리턴 객체에 유저 및 토큰 정보 저장
				tokenInfo.userId = decodedRefresh.userId;
				tokenInfo.email = decodedRefresh.email;
				tokenInfo.accountType = decodedRefresh.accountType;
				tokenInfo.accessToken = newAccessToken;
				return tokenInfo;
			}
			//* (1-2) 유효하지 않은 토큰
			else {
				tokenInfo.error = "INVALID";
				return tokenInfo;
			}
		}
		//* (2) 유효한 토큰
		else {
			//? 블랙리스트에 등록된 토큰인지 확인
			if (process.env.NODE_ENV === "production") {
				const isTokenInBlackList = await checkBlackList(decoded.userId, accessToken);
				if (isTokenInBlackList) {
					tokenInfo.error = "INVALID";
					return tokenInfo;
				}
			}

			// 리턴 객체에 유저 및 토큰 정보 저장
			tokenInfo.userId = decoded.userId;
			tokenInfo.email = decoded.email;
			tokenInfo.accountType = decoded.accountType;
			tokenInfo.accessToken = accessToken;
			return tokenInfo;
		}
	} catch (error) {
		console.error(error);
		tokenInfo.error = "SERVER";
		return tokenInfo;
	}
};

export default getUserInfo;
