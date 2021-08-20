"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../entity/User");
const validate_1 = require("../../utils/validate");
const hash_1 = __importDefault(require("../../utils/hash"));
const log_1 = require("../../utils/log");
const updatePassword = async (req, res, next) => {
    const { userId } = req.userInfo;
    const { password, newPassword } = req.body;
    try {
        //* 파라미터 검사
        if (!newPassword || !validate_1.checkPasswordFormat(newPassword)) {
            return res.status(400).json({ message: "Invalid newPassword(body)" });
        }
        //* 유저 조회: 인증 시 계정 확인됨
        const userInfo = (await User_1.User.findOne(userId));
        //* (1) 이메일 가입 or 통합 유저 (기존 비밀번호 존재)
        if (userInfo.signUpType === "email" || userInfo.signUpType === "intergration") {
            if (!password) {
                return res.status(400).json({ message: "Invalid password(body)" });
            }
            const hashedPassword = hash_1.default(password);
            if (userInfo.password !== hashedPassword) {
                return res.status(403).json({ message: "Incorrect password" });
            }
            const hashedNewPassword = hash_1.default(newPassword);
            if (userInfo.password === hashedNewPassword) {
                // 이전과 동일한 비밀번호
                return res.status(409).json({ message: "Same password" });
            }
            // 비밀번호 변경
            userInfo.password = hashedNewPassword;
            await userInfo.save();
        }
        //* (2) 소셜 로그인으로 가입하고 아직 비빌번호를 변경하지 않은 유저
        else {
            const hashedNewPassword = hash_1.default(newPassword);
            userInfo.password = hashedNewPassword;
            userInfo.signUpType = "intergration";
            // 비밀번호 변경 -> 일반 로그인 사용 가능
            await userInfo.save();
        }
        return res.status(200).json({ message: "User password successfully updated" });
    }
    catch (err) {
        log_1.logError("Failed to update password");
        next(err);
    }
};
exports.default = updatePassword;
//# sourceMappingURL=updatePassword.js.map