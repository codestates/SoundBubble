"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../entity/User");
const log_1 = require("../../utils/log");
const validate_1 = require("../../utils/validate");
const checkNickname = async (req, res, next) => {
    const nickname = req.body.nickname;
    try {
        //* 파라미터 검사
        if (!nickname || !validate_1.checkNicknameFormat(nickname)) {
            return res.status(400).json({ message: `Invalid nickname(body), input 'nickname': ${nickname}` });
        }
        //* 닉네임 중복 검사
        const userUsingNickname = await User_1.User.findOne({ nickname });
        if (userUsingNickname) {
            // 사용 중인 닉네임
            return res.status(409).json({ message: "Nickname already in use" });
        }
        return res.status(200).json({ message: "Available nickname" });
    }
    catch (err) {
        log_1.logError("Failed to check nickname");
        next(err);
    }
};
exports.default = checkNickname;
