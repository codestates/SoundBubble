"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = require("../token");
const User_1 = require("../entity/User");
const UserToken_1 = require("../entity/UserToken");
const getUserInfo = async (res, accessToken) => {
    const tokenInfo = {
        userId: null,
        email: null,
        accountType: null,
        accessToken: null,
        tokenExpIn: null,
        error: null,
    };
    try {
        // 토큰 검사
        const decoded = await token_1.verifyAccessToken(accessToken);
        //* (1) 유효하지 않은 토큰
        if (decoded.error) {
            //* (1-1) 만료된 토큰
            if (decoded.name === "TokenExpiredError") {
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
                // 리프레시 토큰 검증
                const refreshToken = userToken.refreshToken;
                const decodedRefresh = await token_1.verifyRefreshToken(refreshToken);
                if (decodedRefresh.error) {
                    // 검증 실패
                    if (decodedRefresh.name === "TokenExpiredError") {
                        tokenInfo.error = "EXPIRED";
                    }
                    else if (decodedRefresh.name === "JsonWebTokenError") {
                        tokenInfo.error = "INVALID";
                    }
                    // -> 리프레시 토큰 삭제
                    userToken.refreshToken = "";
                    await userToken.save();
                    return tokenInfo;
                }
                // 검증 성공 -> 액세스 토큰 재발급, 응답 헤더에 저장
                const newAccessToken = await token_1.generateAccessToken(userInfo);
                res.setHeader("authorization", `Bearer ${newAccessToken}`);
                console.log("액세스 토큰 재발급");
                // 리턴 객체에 유저 및 토큰 정보 저장
                tokenInfo.userId = decodedRefresh.userId;
                tokenInfo.email = decodedRefresh.email;
                tokenInfo.accountType = decodedRefresh.accountType;
                tokenInfo.accessToken = newAccessToken;
                tokenInfo.tokenExpIn = 86400;
                return tokenInfo;
            }
            //* (1-2) 유효하지 않은 토큰
            else {
                tokenInfo.error = "INVALID";
                return tokenInfo;
            }
        }
        //* (2) 유효한 토큰
        else {
            // 리턴 객체에 유저 및 토큰 정보 저장
            tokenInfo.userId = decoded.userId;
            tokenInfo.email = decoded.email;
            tokenInfo.accountType = decoded.accountType;
            tokenInfo.accessToken = accessToken;
            const expiredAt = decoded.exp;
            tokenInfo.tokenExpIn = expiredAt - Math.floor(new Date().getTime() / 1000);
            return tokenInfo;
        }
    }
    catch (error) {
        console.error(error);
        tokenInfo.error = "SERVER";
        return tokenInfo;
    }
};
exports.default = getUserInfo;
//# sourceMappingURL=getUserInfo.js.map