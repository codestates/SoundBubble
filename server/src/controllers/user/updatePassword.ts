import { Request, Response } from "express";
import crypto = require("crypto");
import { User } from "../../entity/User";

const updatePassword = async (req: Request, res: Response) => {
  // 클라이언트에서 이메일정보 넘겨주기?
  const { email, password, newPassword } = req.body;
  if (!password ) {
    return res.status(400).send({ message: "Insufficient parameters supplied" });
  }
  const salt = process.env.PASSWORD_SALT;
  const hashedPassword = crypto
    .createHash("sha512")
    .update(password + salt)
    .digest("hex")

  try {
    const userInfo = await User.findOne({
      where: { email: email, password: hashedPassword },
    });
    if (!userInfo) {
      return res.status(404).json({ message: "User not found" });
    }
    const updatePassword = crypto
      .createHash("sha512")
      .update(newPassword + salt)
      .digest("hex")
    
    userInfo.password = updatePassword;
    User.update({ email: email }, { password: updatePassword });
    return res.status(201).json({ data: { userInfo }, message: "Update password succeed" });   
  } catch (error) {
    return res.status(500).json({ message: "Update password failed"})
  }
};

export default updatePassword;
