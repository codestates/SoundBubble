//* 타입: 유저 정보
export interface UserInfo {
	id: number;
	email: string;
	nickname: string;
	accountType: accountType;
	signUpType: SignUpType;
	profileImage: string | null;
	createdAt: string;
}

export type SignUpType = "email" | "google" | "naver" | "intergration" | "";
export type accountType = "user" | "admin" | "";
