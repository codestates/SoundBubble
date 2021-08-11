import { Request, Response, RequestHandler } from "express";
import { User } from "../../entity/User";
import { UserInfo } from "../../@type/tokenUserInfo";
import hash from "../../utils/hash";

const updateNickname: RequestHandler = async (req: Request, res: Response) => {
  const { userId }: { userId: number } = req.userInfo as UserInfo;

  const { nickname, password } = req.body;
  if (!password || !nickname) {
    return res.status(400).send({ message: "Insufficient parameters supplied" });
  }
  if (nickname === "") {
    return res.status(400).send({ message: "Invalid format" });
  }
  try {
    const hashedPassword = hash(password);

    const userInfo = await User.findUserById(userId, hashedPassword);
    if (!userInfo) {
      return res.status(404).json({ message: "User not found" });
    }

    userInfo.nickname = nickname;
    await userInfo.save();

    return res.status(201).json({ data: { userInfo }, message: "Update nickname succeed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Update nickname failed" });
  }
};

export default updateNickname;
