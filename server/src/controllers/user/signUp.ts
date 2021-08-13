import { Request, Response, RequestHandler } from "express";
import { User } from "../../entity/User";
import { checkEmail, checkPassword } from "../../utils/validate";
import hash from "../../utils/hash";

const signUp: RequestHandler = async (req: Request, res: Response) => {
  const { email, password, nickname }: { email: string; password: string; nickname: string } = req.body;

  try {
    //* 파라미터 검사
    if (!email || !checkEmail(email)) {
      return res.status(400).json({ message: `Invalid email(body), input 'email': ${email}` });
    }
    if (!password || !checkPassword(password)) {
      return res.status(400).json({ message: "Invalid password(body)" });
    }
    //? 닉네임 중복 검사, 유효성 검사
    if (!nickname) {
      return res.status(400).json({ message: `Invalid nickname(body), input 'nickname: ${nickname}` });
    }

    //* 유저 조회. 이메일 중복 확인
    const userInfo: User | undefined = await User.findOne({ email });

    if (userInfo) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword: string = hash(password);

    //* DB 입력
    await User.insertUser(email, hashedPassword, nickname, "email", "user");

    res.status(201).json({ message: "User registration completed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to registration" });
  }
};

export default signUp;
