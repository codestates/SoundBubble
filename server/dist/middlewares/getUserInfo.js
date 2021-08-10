"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = require("../controllers/token");
const User_1 = require("../entity/User");
const getUserInfo = async (accessToken, loginType, res) => {
    const tokenUserInfo = {
        userId: null,
        email: null,
        accountType: null,
        error: null,
    };
    try {
        if (loginType === "email") {
            const decoded = await token_1.verifyAccessToken(accessToken);
            //* 만료된 토큰
            if (decoded.error === "TokenExpiredError") {
                // tokenUserInfo.error = "EXPIRED";
                //! 만료된 토큰 재발급
                //?-------------------------------------------------------
                // 만료된 액세스 토큰 강제 검증
                const decodedExpired = await token_1.verifyExpiredAccessToken(accessToken);
                if (!decodedExpired.userId || !decodedExpired.email || !decodedExpired.accountType) {
                    tokenUserInfo.error = "INVALID";
                    return tokenUserInfo;
                }
                // 검증한 값으로 유저를 특정하여 리프레시 토큰 획득
                const userInfo = await User_1.User.findOne(decodedExpired.userId);
                if (!userInfo) {
                    tokenUserInfo.error = "INVALID";
                    return tokenUserInfo;
                }
                // 리프레시 토큰 검증
                const refreshToken = userInfo.refreshToken;
                if (!refreshToken) {
                    tokenUserInfo.error = "INVALID";
                    return tokenUserInfo;
                }
                const decodedRefresh = await token_1.verifyRefreshToken(refreshToken);
                if (decodedRefresh.name) {
                    if (decodedRefresh.name === "TokenExpiredError") {
                        tokenUserInfo.error = "EXPIRED";
                    }
                    else if (decodedRefresh.name === "JsonWebTokenError") {
                        tokenUserInfo.error = "INVALID";
                    }
                    if (userInfo.id !== decodedRefresh.userId) {
                        tokenUserInfo.error = "INVALID";
                    }
                    userInfo.refreshToken = "";
                    await userInfo.save();
                    return tokenUserInfo;
                }
                // 액세스 토큰 재발급하고 헤더에 저장
                const newAccessToken = await token_1.generateAccessToken(userInfo);
                res.setHeader("authorization", `Bearer ${newAccessToken}`);
                tokenUserInfo.userId = decodedRefresh.userId;
                tokenUserInfo.email = decodedRefresh.email;
                tokenUserInfo.accountType = decodedRefresh.accountType;
                //?-------------------------------------------------------
                //* 유효하지 않은 토큰
            }
            else if (decoded.name === "JsonWebTokenError") {
                tokenUserInfo.error = "INVALID";
            }
            else {
                tokenUserInfo.userId = decoded.userId;
                tokenUserInfo.email = decoded.email;
                tokenUserInfo.accountType = decoded.accountType;
            }
        }
        else if (loginType === "google") {
        }
        else if (loginType === "naver") {
        }
        return tokenUserInfo;
    }
    catch (error) {
        console.error(error);
        tokenUserInfo.error = "SERVER";
        return tokenUserInfo;
    }
};
exports.default = getUserInfo;
//# sourceMappingURL=getUserInfo.js.map