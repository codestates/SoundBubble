"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getUserInfo_1 = __importDefault(require("./getUserInfo"));
const token_1 = require("../token");
const log_1 = require("../utils/log");
const authUser = async (req, res, next) => {
    //* 토큰 획득
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        return res.status(401).json({ message: "Invalid token, token does not exist" });
    }
    //* 토큰으로부터 유저 정보 획득
    const userInfo = await getUserInfo_1.default(res, accessToken);
    //* (1) 토큰 검증 실패
    if (userInfo.error) {
        // 액세스 토큰 초기화
        res.cookie("accessToken", "", token_1.cookieOptions);
        if (userInfo.error === "EXPIRED") {
            return res.status(401).json({ message: "Expired token, login again" });
        }
        else if (userInfo.error === "INVALID") {
            return res.status(401).json({ message: "Invalid token, login again" });
        }
        else if (userInfo.error === "SERVER") {
            return res.status(500).json({ message: "Server error" });
        }
    }
    const { userId, email, accountType, accessToken: currentToken } = userInfo;
    if (!userId || !email || !accountType || !currentToken) {
        res.cookie("accessToken", "", token_1.cookieOptions);
        return res.status(401).json({ message: "Invalid token, login again" });
    }
    //* (2) 토큰 검증 성공
    // req 객체에 유저 정보를 담고 컨트롤러로 이동
    log_1.log(`[유저 ${userId}] 토큰 검증 성공: email: ${email}. accountType: ${accountType}`);
    req.userInfo = userInfo;
    next();
};
exports.default = authUser;
