import { Request, Response } from "express";
import crypto = require("crypto");
import { User } from "../../entity/User";
import { generateAccessToken, generateRefreshToken } from "../token/index";


const login = async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Insufficient parameters supplied" });
  }
  const salt = process.env.PASSWORD_SALT;
  const hashedPassword = crypto
    .createHash("sha512")
    .update(password + salt)
    .digest("hex");
  try {
    const userInfo = await User.findOne({
      where: { email: email, password: hashedPassword },
    });
    console.log("userInfo\n", userInfo);
    if (!userInfo) {
      return res.status(401).json({ message: "Not authorized" });
    }
    if (userInfo.password !== hashedPassword) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // 비밀번호 제외하고 액세스 토큰 발급
    const { password: temp, ...userWithoutPassword } = userInfo;
    const accessToken = generateAccessToken(userInfo);
    // const refreshToken = generateRefreshToken(userInfo);

    return res.status(201).json({ data: { accessToken, userWithoutPassword }, message: "Login succeed" });
  } catch(error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export default login;
