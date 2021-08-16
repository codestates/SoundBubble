"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../entity/User");
const validate_1 = require("../../utils/validate");
const hash_1 = __importDefault(require("../../utils/hash"));
const updateNickname = async (req, res) => {
    const { userId } = req.userInfo;
    const { nickname, password } = req.body;
    try {
        //* 파라미터 검사
        if (!password || !validate_1.checkPassword(password)) {
            return res.status(400).json({ message: "Invalid password(body)" });
        }
        //? 닉네임 중복 검사, 유효성 검사
        if (!nickname) {
            return res.status(400).json({ message: `Invalid nickname(body), input 'nickname: ${nickname}` });
        }
        const hashedPassword = hash_1.default(password);
        //* 유저 조회
        const userInfo = await User_1.User.findUserById(userId, hashedPassword);
        if (!userInfo) {
            // 패스워드 다름
            return res.status(403).json({ message: "Not authorized" });
        }
        if (userInfo.nickname === nickname) {
            // 이전과 동일한 닉네임
            return res.status(409).json({ message: "Same nickname" });
        }
        //* 닉네임 변경
        userInfo.nickname = nickname;
        await userInfo.save();
        return res.status(200).json({ data: { userInfo }, message: "User nickname successfully updated" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to update nickname" });
    }
};
exports.default = updateNickname;
//# sourceMappingURL=updateNickname.js.map