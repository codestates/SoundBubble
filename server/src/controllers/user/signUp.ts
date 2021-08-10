import { Request, Response } from "express";
import crypto from "crypto";
import { User } from "../../entity/User";

const signUp = async (req: Request, res: Response) => {
  const { email, password, nickname }: { email: string; password: string; nickname: string } = req.body;
  console.log(email, password, nickname);

  if (!email || !password || !nickname) {
    return res.status(422).json({ message: "Insufficient parameters supplied" });
  }
  try {
    const userInfo = await User.findOne({
      email: email,
    });

    if (userInfo) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = crypto
      .createHash("sha512")
      .update(password + process.env.PASSWORD_SALT)
      .digest("hex");

    const newUser: User = new User();
    newUser.email = email;
    newUser.password = hashedPassword;
    newUser.nickname = nickname;
    newUser.signUpType = "email";
    newUser.accountType = "user";

    try {
      newUser.save();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "User registration failed" });
    }
    res.status(201).json({ message: "signup succeed" });
  } catch (error) {
    return res.status(500).json({ message: "User registration failed" });
  }
};

export default signUp;
