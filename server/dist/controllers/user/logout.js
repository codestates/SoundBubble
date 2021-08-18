"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserToken_1 = require("../../entity/UserToken");
const redis_1 = __importDefault(require("../../redis"));
const log_1 = require("../../utils/log");
const logout = async (req, res, next) => {
    const { userId, accessToken, tokenExpiredIn } = req.userInfo;
    try {
        if (process.env.NODE_ENV === "production") {
            console.log("비동기 테스트1");
            redis_1.default.get(String(userId), async (err, data) => {
                if (err) {
                    log_1.logError("Redis 조회 실패");
                }
                else if (data) {
                    const parsedList = JSON.parse(data);
                    parsedList.push(accessToken);
                    redis_1.default.setex(String(userId), tokenExpiredIn, JSON.stringify(parsedList));
                    console.log("Redis 추가 토큰 등록");
                }
                else {
                    const blackList = [];
                    blackList.push(accessToken);
                    redis_1.default.setex(String(userId), tokenExpiredIn, JSON.stringify(blackList));
                    console.log("Redis 신규 토큰 등록");
                }
                const userToken = await UserToken_1.UserToken.findOne(userId);
                if (userToken) {
                    userToken.refreshToken = "";
                    await userToken.save();
                }
                console.log("비동기 테스트2");
                res.status(200).json({ message: "Logout succeed" });
            });
            console.log("비동기 테스트3");
        }
        else {
            res.status(200).json({ message: "Logout succeed" });
        }
    }
    catch (err) {
        log_1.logError("Failed to logout");
        res.status(200).json({ message: "Logout faild" });
        next(err);
    }
};
exports.default = logout;
//# sourceMappingURL=logout.js.map