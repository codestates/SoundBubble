"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../entity/User");
const log_1 = require("../../utils/log");
const checkNickname = async (req, res, next) => {
    const nickname = req.body.nickname;
    try {
        //* 파라미터 검사
        if (!nickname) {
            return res.status(400).json({ message: `Invalid nickname(body), input 'nickname': ${nickname}` });
        }
        const maybeUser = await User_1.User.findOne({ where: { nickname: nickname } });
        if (maybeUser) {
            return res.status(409).json({ message: "Nickname already exists" });
        }
        return res.status(200).json({ message: "Available nickname" });
    }
    catch (err) {
        log_1.logError("Failed to check nickname");
        next(err);
    }
};
exports.default = checkNickname;
//# sourceMappingURL=checkNickname.js.map