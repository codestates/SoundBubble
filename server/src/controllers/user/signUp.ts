import { Request, Response } from "express";
import { User } from "../../entity/User";

const signUp = async (req: Request, res: Response) => {
  const { email, password, nickname }: { email: string; password: string; nickname: string } = req.body;

  const userInfo = await User.findOne({
    email: email,
  });

  if (userInfo) {
    return res.status(400).json({ message: "email exist" });
  }

  const newUser: User = new User();
  newUser.email = email;
  newUser.password = password;
  newUser.nickname = nickname;
  newUser.signUpType = "email";
  newUser.accountType = "user";
  
  try {
    newUser.save();
  } catch (error) {
    console.log(error);
  }
  res.status(201).json({ message: "signup succeed" });
};

export default signUp;
