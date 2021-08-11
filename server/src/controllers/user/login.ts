import { Request, Response, RequestHandler } from "express";
import { User } from "../../entity/User";
import { UserToken } from "../../entity/UserToken";
import { generateAccessToken, generateRefreshToken } from "../token/index";
import hash from "../../utils/hash";

const login: RequestHandler = async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Insufficient parameters supplied" });
  }

  try {
    const hashedPassword: string = hash(password);

    const userInfo: User | undefined = await User.findUserByEmail(email, hashedPassword);
    console.log(userInfo);

    if (!userInfo) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const accessToken = generateAccessToken(userInfo);
    const refreshToken = generateRefreshToken(userInfo);

    // DB에 리프레시 토큰 저장
    await UserToken.insertToken(userInfo.id, refreshToken);

    return res.status(201).json({ data: { accessToken, userInfo }, message: "Login succeed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export default login;
