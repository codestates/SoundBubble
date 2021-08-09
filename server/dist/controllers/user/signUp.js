"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const User_1 = require("../../entity/User");
const signUp = async (req, res) => {
    const { email, password, nickname } = req.body;
    console.log(email, password, nickname);
    if (!email || !password || !nickname) {
        return res.status(422).json({ message: "Insufficient parameters supplied" });
    }
    try {
        const userInfo = await User_1.User.findOne({
            email: email,
        });
        if (userInfo) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const hashedPassword = crypto_1.default
            .createHash("sha512")
            .update(password + process.env.PASSWORD_SALT)
            .digest("hex");
        const newUser = new User_1.User();
        newUser.email = email;
        newUser.password = hashedPassword;
        newUser.nickname = nickname;
        newUser.signUpType = "email";
        newUser.accountType = "user";
        try {
            newUser.save();
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: "User registration failed" });
        }
        res.status(201).json({ message: "signup succeed" });
    }
    catch (error) {
        return res.status(500).json({ message: "User registration failed" });
    }
};
exports.default = signUp;
//# sourceMappingURL=signUp.js.map