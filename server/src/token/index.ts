import { User } from "../entity/User";
import jwt, { JwtPayload } from "jsonwebtoken";
import { logError } from "../utils/log";
import { CookieOptions } from "express";

//* 토큰 쿠키 옵션
export const cookieOptions: CookieOptions = {
	maxAge: 24 * 60 * 60 * 1000 * 14,
	httpOnly: true,
	secure: true,
	sameSite: "strict",
};

const accessSecret: string = process.env.ACCESS_SECRET as string;
const refreshSecret: string = process.env.REFRESH_SECRET as string;

//* 액세스 토큰 생성
export const generateAccessToken = (user: User): string => {
	return jwt.sign(
		{
			userId: user.id,
			email: user.email,
			accountType: user.accountType,
		},
		accessSecret,
		{ expiresIn: "1d" },
	);
};

//* 리프레시 토큰 생성
export const generateRefreshToken = (user: User): string => {
	return jwt.sign(
		{
			userId: user.id,
			email: user.email,
			accountType: user.accountType,
		},
		refreshSecret,
		{ expiresIn: "14d" },
	);
};

//* 액세스 토큰 검증
export const verifyAccessToken = (accessToken: string): JwtPayload => {
	try {
		return jwt.verify(accessToken, accessSecret) as JwtPayload;
	} catch (error) {
		logError("Invalid access token:", error.name, error.message);
		return Object.assign(error, { error: true });
	}
};

//* 만료된 액세스 토큰 검증
export const verifyExpiredAccessToken = (accessToken: string): JwtPayload => {
	try {
		return jwt.verify(accessToken, accessSecret, { ignoreExpiration: true }) as JwtPayload;
	} catch (error) {
		logError("Invalid access token:", error.name, error.message);
		return Object.assign(error, { error: true });
	}
};

//* 리프레시 토큰 검증
export const verifyRefreshToken = (refreshToken: string): JwtPayload => {
	try {
		return jwt.verify(refreshToken, refreshSecret) as JwtPayload;
	} catch (error) {
		logError("Invalid refresh token:", error.name, error.message);
		return Object.assign(error, { error: true });
	}
};
