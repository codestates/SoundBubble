import { Request, Response, RequestHandler } from "express";
import { User } from "../../entity/User";
import hash from "../../utils/hash";

const signUp: RequestHandler = async (req: Request, res: Response) => {
  const { email, password, nickname }: { email: string; password: string; nickname: string } = req.body;
  console.log(email, password, nickname);

  if (!email || !password || !nickname) {
    return res.status(400).json({ message: "Insufficient parameters supplied" });
  }
  try {
    const userInfo: User | undefined = await User.findOne({ email });

    if (userInfo) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword: string = hash(password);

    const newUser: User = await User.insertUser(email, hashedPassword, nickname, "email", "user");

    res.status(201).json({ message: "signup succeed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "User registration failed" });
  }
};

export default signUp;
