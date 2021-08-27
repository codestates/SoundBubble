//* 타입: 요청의 유저 정보
export interface RequestUserInfo {
	userId: number | null;
	email: string | null;
	accountType: string | null;
	accessToken: string | null;
	error: null | TokenError;
}

type TokenError = "EXPIRED" | "INVALID" | "SERVER";

//* 타입: 요청의 인증된 유저 정보
export interface UserInfo extends RequestUserInfo {
	userId: number;
	email: string;
	accountType: string;
	accessToken: string;
	error: null;
}

declare module "express" {
	interface Request {
		userInfo?: UserInfo;
	}
}
