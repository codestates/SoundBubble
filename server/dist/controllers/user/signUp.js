"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../entity/User");
const hash_1 = __importDefault(require("../../utils/hash"));
const signUp = async (req, res) => {
    const { email, password, nickname } = req.body;
    console.log(email, password, nickname);
    if (!email || !password || !nickname) {
        return res.status(400).json({ message: "Insufficient parameters supplied" });
    }
    try {
        const userInfo = await User_1.User.findOne({ email });
        if (userInfo) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const hashedPassword = hash_1.default(password);
        const newUser = await User_1.User.insertUser(email, hashedPassword, nickname, "email", "user");
        res.status(201).json({ message: "signup succeed" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "User registration failed" });
    }
};
exports.default = signUp;
//# sourceMappingURL=signUp.js.map