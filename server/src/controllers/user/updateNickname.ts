import { Request, Response, RequestHandler } from "express";
import { User } from "../../entity/User";
import { UserInfo } from "../../@type/tokenUserInfo";
import { checkPassword } from "../../utils/validate";
import hash from "../../utils/hash";

const updateNickname: RequestHandler = async (req: Request, res: Response) => {
  const { userId }: { userId: number } = req.userInfo as UserInfo;
  const { nickname, password } = req.body;

  try {
    //* 파라미터 검사
    if (!password || !checkPassword(password)) {
      return res.status(400).json({ message: "Invalid password(body)" });
    }
    //? 닉네임 중복 검사, 유효성 검사
    if (!nickname) {
      return res.status(400).json({ message: `Invalid nickname(body), input 'nickname: ${nickname}` });
    }

    const hashedPassword: string = hash(password);
    
    //* 유저 조회
    const userInfo: User | undefined = await User.findOne(userId);

    if (!userInfo) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (userInfo.password !== hashedPassword) {
      // 패스워드 다름
      return res.status(403).json({ message: "Incorrect password" });
    }
    if (userInfo.nickname === nickname) {
      // 이전과 동일한 닉네임
      return res.status(409).json({ message: "Same nickname" });
    }

    //* 닉네임 변경
    userInfo.nickname = nickname;
    await userInfo.save();

    return res.status(200).json({ data: { userInfo }, message: "User nickname successfully updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update nickname" });
  }
};

export default updateNickname;
