"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../entity/User");
const validate_1 = require("../../utils/validate");
const hash_1 = __importDefault(require("../../utils/hash"));
const log_1 = require("../../utils/log");
const updateNickname = async (req, res, next) => {
    const { userId } = req.userInfo;
    const { nickname, password } = req.body;
    try {
        //* 파라미터 검사
        if (!nickname || !validate_1.checkNicknameFormat(nickname)) {
            return res.status(400).json({ message: `Invalid nickname(body), input 'nickname: ${nickname}` });
        }
        //* 유저 조회: 인증 시 계정 확인됨
        const userInfo = (await User_1.User.findOne(userId));
        // 이메일 가입 or 통합 유저 (비밀번호 존재)
        if (userInfo.signUpType === "email" || userInfo.signUpType === "intergration") {
            if (!password) {
                return res.status(400).json({ message: "Invalid password(body)" });
            }
            const hashedPassword = hash_1.default(password);
            if (userInfo.password !== hashedPassword) {
                // 패스워드 다름
                return res.status(403).json({ message: "Incorrect password" });
            }
        }
        if (userInfo.nickname === nickname) {
            // 이전과 동일한 닉네임
            return res.status(409).json({ message: "Same nickname" });
        }
        const userUsingNickname = await User_1.User.findOne({ nickname });
        if (userUsingNickname) {
            // 중복된 닉네임
            return res.status(409).json({ message: "Nickname already in use" });
        }
        //* 닉네임 변경
        userInfo.nickname = nickname;
        await userInfo.save();
        const resUserInfo = (await User_1.User.findUserByEmail(userInfo.email));
        return res.status(200).json({ data: { userInfo: resUserInfo }, message: "User nickname successfully updated" });
    }
    catch (err) {
        log_1.logError("Failed to update nickname");
        next(err);
    }
};
exports.default = updateNickname;
//# sourceMappingURL=updateNickname.js.map