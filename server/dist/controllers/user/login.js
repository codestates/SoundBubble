"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../entity/User");
const UserToken_1 = require("../../entity/UserToken");
const validate_1 = require("../../utils/validate");
const token_1 = require("../../token");
const hash_1 = __importDefault(require("../../utils/hash"));
const log_1 = require("../../utils/log");
const redis_1 = require("../../redis");
const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        //* 파라미터 검사
        if (!email || !validate_1.checkEmailFormat(email)) {
            return res.status(400).json({ message: `Invalid email(body), input 'email': ${email}` });
        }
        if (!password || !validate_1.checkPasswordFormat(password)) {
            return res.status(400).json({ message: `Invalid password(body)` });
        }
        //* 유저 조회
        const hashedPassword = hash_1.default(password);
        const userInfo = await User_1.User.findUserByEmail(email, hashedPassword);
        if (!userInfo || (userInfo.signUpType !== "email" && userInfo.signUpType !== "intergration")) {
            // 계정 정보가 없거나, 소셜 로그인으로 가입하고 비밀번호 설정을 안한 유저는 기존 로그인 사용 불가
            return res.status(401).json({ message: "Not authorized" });
        }
        //* 토큰 발급
        const accessToken = token_1.generateAccessToken(userInfo);
        const refreshToken = token_1.generateRefreshToken(userInfo);
        // DB에 리프레시 토큰 저장
        await UserToken_1.UserToken.insertToken(userInfo.id, refreshToken);
        // 토큰 화이트리스트에 액세스 토큰 저장
        if (process.env.NODE_ENV === "production") {
            await redis_1.insertWhiteList(userInfo.id, accessToken);
        }
        // 응답 쿠키에 액세스 토큰 설정
        res.cookie("accessToken", accessToken, token_1.cookieOptions);
        return res.status(201).json({ data: { userInfo }, message: "Login succeed" });
    }
    catch (err) {
        log_1.logError("Failed to login");
        next(err);
    }
};
exports.default = login;
//# sourceMappingURL=login.js.map