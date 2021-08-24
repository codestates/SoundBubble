"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserToken_1 = require("../../entity/UserToken");
const redis_1 = require("../../redis");
const log_1 = require("../../utils/log");
const token_1 = require("../../token");
const logout = async (req, res, next) => {
    const { userId, accessToken, tokenExpIn } = req.userInfo;
    try {
        if (process.env.NODE_ENV === "production") {
            const data = await redis_1.getAsync(String(userId));
            if (data) {
                let parsedList = JSON.parse(data);
                // 토큰을 저장된 순서대로 검사하여 만료되었으면 삭제
                let validTokenIdx = -1;
                for (let i = 0; i < parsedList.length; i++) {
                    const decoded = await token_1.verifyAccessToken(parsedList[i]);
                    if (!decoded.error) {
                        // 아직 만료되지 않은 토큰이 있으면 중지
                        validTokenIdx = i;
                        break;
                    }
                    // 전부 만료된 토큰
                    validTokenIdx = parsedList.length;
                }
                if (validTokenIdx >= 1) {
                    parsedList = parsedList.slice(validTokenIdx);
                    console.log(`${validTokenIdx}개의 만료된 토큰 삭제`);
                }
                parsedList.push(accessToken);
                await redis_1.setexAsync(String(userId), tokenExpIn, JSON.stringify(parsedList));
                console.log("Redis 추가 토큰 등록");
            }
            else {
                const blackList = [];
                blackList.push(accessToken);
                await redis_1.setexAsync(String(userId), tokenExpIn, JSON.stringify(blackList));
                console.log("Redis 신규 토큰 등록");
            }
        }
        const userToken = await UserToken_1.UserToken.findOne(userId);
        if (userToken) {
            userToken.refreshToken = "";
            await userToken.save();
        }
        res.status(200).json({ message: "Logout succeed" });
    }
    catch (err) {
        log_1.logError("Failed to logout");
        res.status(200).json({ message: "Logout succeed" });
        next(err);
    }
};
exports.default = logout;
//# sourceMappingURL=logout.js.map