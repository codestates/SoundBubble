import { Request, Response, NextFunction, RequestHandler } from "express";
import getUserInfo from "./getUserInfo";
import { TokenInfo, UserInfo } from "../@type/tokenUserInfo";

const authUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization }: { authorization: string } = req.headers as any;

  //* 파라미터 검사
  if (!authorization) {
    return res.status(401).json({ message: "Invalid authorization(headers)" });
  }
  const accessToken: string = authorization.split("Bearer ")[1];
  if (!accessToken) {
    return res.status(401).json({ message: "Token must be Bearer type" });
  }

  //* 토큰으로부터 유저 정보 획득
  const userInfo: TokenInfo = await getUserInfo(res, accessToken);

  if (userInfo.error) {
    if (userInfo.error === "EXPIRED") {
      return res.status(401).json({ message: "Expired token, login again" });
    } else if (userInfo.error === "INVALID") {
      return res.status(401).json({ message: "Invalid token, login again" });
    } else if (userInfo.error === "SERVER") {
      return res.status(500).json({ message: "Server error" });
    }
  }
  const { userId, email, accountType } = userInfo;
  if (!userId || !email || !accountType) {
    return res.status(401).json({ message: "Invalid token, login again" });
  }

  req.userInfo = userInfo as UserInfo;
  next();
};

export default authUser;
