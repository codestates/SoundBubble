type TokenError = "EXPIRED" | "INVALID" | "SERVER";

export interface RequestTokenInfo {
	userId: number | null;
	email: string | null;
	accountType: string | null;
	accessToken: string | null;
	tokenExpIn: null | number;
	error: null | TokenError;
}

export interface UserInfo {
	userId: number;
	email: string;
	accountType: string;
	accessToken: string;
	tokenExpIn: number;
	error: null;
}

declare module "express" {
	interface Request {
		userInfo?: UserInfo;
	}
}
