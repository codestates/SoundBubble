"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = require("../controllers/token");
const User_1 = require("../entity/User");
const UserToken_1 = require("../entity/UserToken");
const getUserInfo = async (accessToken, loginType, res) => {
    const tokenInfo = {
        userId: null,
        email: null,
        accountType: null,
        error: null,
    };
    try {
        if (loginType === "email") {
            const decoded = await token_1.verifyAccessToken(accessToken);
            //* 만료된 토큰
            if (decoded.name === "TokenExpiredError") {
                // tokenInfo.error = "EXPIRED";
                // return tokenInfo;
                //! 만료된 토큰 재발급
                //?-------------------------------------------------------
                // 만료된 액세스 토큰 강제 검증
                const decodedExpired = await token_1.verifyExpiredAccessToken(accessToken);
                if (!decodedExpired.userId || !decodedExpired.email || !decodedExpired.accountType) {
                    tokenInfo.error = "INVALID";
                    return tokenInfo;
                }
                // 검증한 값으로 유저를 특정하여 리프레시 토큰 획득
                const userInfo = await User_1.User.findOne(decodedExpired.userId);
                if (!userInfo) {
                    tokenInfo.error = "INVALID";
                    return tokenInfo;
                }
                const userToken = await UserToken_1.UserToken.findOne(userInfo.id);
                if (!userToken) {
                    tokenInfo.error = "INVALID";
                    return tokenInfo;
                }
                // 리프레시 토큰
                const refreshToken = userToken.refreshToken;
                const decodedRefresh = await token_1.verifyRefreshToken(refreshToken);
                if (decodedRefresh.name) {
                    if (decodedRefresh.name === "TokenExpiredError") {
                        tokenInfo.error = "EXPIRED";
                    }
                    else if (decodedRefresh.name === "JsonWebTokenError") {
                        tokenInfo.error = "INVALID";
                    }
                    if (userInfo.id !== decodedRefresh.userId) {
                        tokenInfo.error = "INVALID";
                    }
                    userToken.refreshToken = "";
                    await userToken.save();
                    return tokenInfo;
                }
                // 액세스 토큰 재발급하고 헤더에 저장
                const newAccessToken = await token_1.generateAccessToken(userInfo);
                res.setHeader("authorization", `Bearer ${newAccessToken}`);
                console.log("액세스 토큰 재발급");
                tokenInfo.userId = decodedRefresh.userId;
                tokenInfo.email = decodedRefresh.email;
                tokenInfo.accountType = decodedRefresh.accountType;
                //?-------------------------------------------------------
                //* 유효하지 않은 토큰
            }
            else if (decoded.name === "JsonWebTokenError") {
                tokenInfo.error = "INVALID";
                return tokenInfo;
            }
            else {
                tokenInfo.userId = decoded.userId;
                tokenInfo.email = decoded.email;
                tokenInfo.accountType = decoded.accountType;
                return tokenInfo;
            }
        }
        else if (loginType === "google") {
        }
        else if (loginType === "naver") {
        }
        return tokenInfo;
    }
    catch (error) {
        console.error(error);
        tokenInfo.error = "SERVER";
        return tokenInfo;
    }
};
exports.default = getUserInfo;
//# sourceMappingURL=getUserInfo.js.map