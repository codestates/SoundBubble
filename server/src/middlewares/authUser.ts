import { Request, Response, NextFunction, RequestHandler } from "express";
import getUserInfo from "./getUserInfo";
import { TokenInfo, UserInfo } from "../@type/tokenUserInfo";

const authUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization }: { authorization: string } = req.headers as any;

  if (!authorization) {
    return res.status(401).json({ message: "Token does not exist" });
  }

  const accessToken: string = authorization.split("Bearer ")[1];

  const userInfo: TokenInfo = await getUserInfo(res, accessToken);

  if (userInfo.error) {
    if (userInfo.error === "EXPIRED") {
      return res.status(403).json({ message: "Expired token" });
    } else if (userInfo.error === "INVALID") {
      return res.status(403).json({ message: "Invalid token" });
    } else if (userInfo.error === "SERVER") {
      return res.status(500).json({ message: "Server error" });
    }
  }

  const { userId, email, accountType } = userInfo;
  if (!userId || !email || !accountType) {
    return res.status(403).json({ message: "Invalid token" });
  }

  req.userInfo = userInfo as UserInfo;
  next();
};

export default authUser;
