"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const User_1 = require("../../entity/User");
const updateNickname = async (req, res) => {
    // email?
    const { email, nickname, password } = req.body;
    if (!password || !nickname) {
        return res.status(400).send({ message: "Insufficient parameters supplied" });
    }
    if (nickname === "") {
        return res.status(400).send({ message: "Invalid format" });
    }
    const salt = process.env.PASSWORD_SALT;
    const hashedPassword = crypto
        .createHash("sha512")
        .update(password + salt)
        .digest("hex");
    try {
        const userInfo = await User_1.User.findOne({
            where: { email: email, password: hashedPassword },
        });
        if (!userInfo) {
            return res.status(404).json({ message: "User not found" });
        }
        userInfo.nickname = nickname;
        User_1.User.update({ email: email }, { nickname: nickname });
        return res.status(201).json({ data: { userInfo }, message: "Update nickname succeed" });
    }
    catch (error) {
        return res.status(500).json({ message: "Update nickname failed" });
    }
};
exports.default = updateNickname;
//# sourceMappingURL=updateNickname.js.map