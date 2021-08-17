"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../entity/User");
const validate_1 = require("../../utils/validate");
const hash_1 = __importDefault(require("../../utils/hash"));
const log_1 = require("../../utils/log");
const signUp = async (req, res, next) => {
    const { email, password, nickname } = req.body;
    try {
        //* 파라미터 검사
        if (!email || !validate_1.checkEmail(email)) {
            return res.status(400).json({ message: `Invalid email(body), input 'email': ${email}` });
        }
        if (!password || !validate_1.checkPassword(password)) {
            return res.status(400).json({ message: "Invalid password(body)" });
        }
        //? 닉네임 중복 검사, 유효성 검사
        if (!nickname) {
            return res.status(400).json({ message: `Invalid nickname(body), input 'nickname: ${nickname}` });
        }
        //* 유저 조회. 이메일 중복 확인
        const userInfo = await User_1.User.findOne({ email });
        if (userInfo) {
            return res.status(409).json({ message: "Email already exists" });
        }
        const hashedPassword = hash_1.default(password);
        //* DB 입력
        await User_1.User.insertUser(email, hashedPassword, nickname, "email", "user");
        res.status(201).json({ message: "User registration completed" });
    }
    catch (err) {
        log_1.logError("Failed to registration");
        next(err);
    }
};
exports.default = signUp;
//# sourceMappingURL=signUp.js.map