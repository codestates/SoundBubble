import { Request, Response, RequestHandler } from "express";
import { User } from "../../entity/User";
import { UserInfo } from "../../@type/tokenUserInfo";
import hash from "../../utils/hash";

const updatePassword: RequestHandler = async (req: Request, res: Response) => {
  const { userId }: { userId: number } = req.userInfo as UserInfo;

  const { password, newPassword } = req.body;
  if (!password || !newPassword) {
    return res.status(400).send({ message: "Insufficient parameters supplied" });
  }

  if (newPassword === "") {
    // 비밀번호 유효성 검사 필요
    return res.status(400).send({ message: "Invalid format" });
  }

  try {
    const hashedPassword = hash(password);

    const userInfo = await User.findUserById(userId, hashedPassword);
    if (!userInfo) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedNewPassword = hash(newPassword);

    userInfo.password = hashedNewPassword;
    await userInfo.save();

    return res.status(201).json({ message: "Update password succeed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Update password failed" });
  }
};

export default updatePassword;
