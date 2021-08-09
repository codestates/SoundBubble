"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../entity/User");
const signUp = async (req, res) => {
    const { email, password, nickname } = req.body;
    const userInfo = await User_1.User.findOne({
        email: email,
    });
    if (userInfo) {
        return res.status(400).json({ message: "email exist" });
    }
    const newUser = new User_1.User();
    newUser.email = email;
    newUser.password = password;
    newUser.nickname = nickname;
    newUser.signUpType = "email";
    newUser.accountType = "user";
    try {
        newUser.save();
    }
    catch (error) {
        console.log(error);
    }
    res.status(201).json({ message: "signup succeed" });
};
exports.default = signUp;
//# sourceMappingURL=signUp.js.map