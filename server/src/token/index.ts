import { User } from "../entity/User";
import jwt, { JwtPayload } from "jsonwebtoken";
import { logError } from "../utils/log";
import { CookieOptions } from "express";

export const cookieOptions: CookieOptions = {
	// domain: "localhost",
	// path: "/",
	// maxAge: 24 * 60 * 60 * 1000,
	sameSite: "none",
	httpOnly: true,
	secure: true,
};

const accessSecret: string = process.env.ACCESS_SECRET as string;
const refreshSecret: string = process.env.REFRESH_SECRET as string;

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

export const verifyAccessToken = (accessToken: string): JwtPayload => {
	try {
		return jwt.verify(accessToken, accessSecret) as JwtPayload;
	} catch (error) {
		logError("Invalid access token:", error.name, error.message);
		return Object.assign(error, { error: true });
	}
};

export const verifyExpiredAccessToken = (accessToken: string): JwtPayload => {
	try {
		return jwt.verify(accessToken, accessSecret, { ignoreExpiration: true }) as JwtPayload;
	} catch (error) {
		logError("Invalid access token:", error.name, error.message);
		return Object.assign(error, { error: true });
	}
};

export const verifyRefreshToken = (refreshToken: string): JwtPayload => {
	try {
		return jwt.verify(refreshToken, refreshSecret) as JwtPayload;
	} catch (error) {
		logError("Invalid refresh token:", error.name, error.message);
		return Object.assign(error, { error: true });
	}
};
