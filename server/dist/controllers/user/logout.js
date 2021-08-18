"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserToken_1 = require("../../entity/UserToken");
const redis_1 = require("../../redis");
const log_1 = require("../../utils/log");
const logout = async (req, res, next) => {
    const { userId, accessToken, tokenExpIn } = req.userInfo;
    try {
        if (process.env.NODE_ENV === "production") {
            const data = await redis_1.getAsync(String(userId));
            if (data) {
                const parsedList = JSON.parse(data);
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
        res.status(200).json({ message: "Logout faild" });
        next(err);
    }
};
exports.default = logout;
//# sourceMappingURL=logout.js.map