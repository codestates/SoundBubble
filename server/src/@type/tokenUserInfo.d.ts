type TokenError = "EXPIRED" | "INVALID" | "SERVER"

export interface TokenUserInfo {
  userId: string | null;
  email: string | null;
  accountType: string | null;
  error: TokenError | null;
}

declare module "express" {
  interface Request {
    userInfo?: TokenUserInfo
  }
}