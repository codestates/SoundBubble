type TokenError = "EXPIRED" | "INVALID" | "SERVER";

export interface TokenUserInfo {
  userId: number | null;
  email: string | null;
  accountType: string | null;
  error: null | TokenError;
}
export interface UserInfo {
  userId: number;
  email: string;
  accountType: string;
  error: null;
}
declare module "express" {
  interface Request {
    userInfo?: UserInfo;
  }
}
