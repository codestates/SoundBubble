"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserToken_1 = require("../../entity/UserToken");
const redis_1 = require("../../redis");
const log_1 = require("../../utils/log");
const token_1 = require("../../token");
const logout = async (req, res, next) => {
    const { userId, accessToken } = req.userInfo;
    try {
        //* 토큰 블랙리스트에 만료되지 않은 액세스 토큰 저장
        if (process.env.NODE_ENV === "production") {
            await redis_1.insertBlackList(userId, accessToken);
        }
        // 클라이언트 액세스 토큰 삭제
        res.cookie("accessToken", "", token_1.cookieOptions);
        // 리프레시 토큰 삭제
        const userToken = await UserToken_1.UserToken.findOne(userId);
        if (userToken) {
            userToken.refreshToken = "";
            await userToken.save();
        }
        res.status(200).json({ message: "Logout succeed" });
    }
    catch (err) {
        log_1.logError("Logout error");
        // 서버 상황에 관계 없이 유저는 로그아웃 가능
        res.status(200).json({ message: "Logout succeed" });
        next(err);
    }
};
exports.default = logout;
