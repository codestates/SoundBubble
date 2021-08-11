"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../entity/User");
const hash_1 = __importDefault(require("../../utils/hash"));
const updatePassword = async (req, res) => {
    const { userId } = req.userInfo;
    const { password, newPassword } = req.body;
    if (!password || !newPassword) {
        return res.status(400).send({ message: "Insufficient parameters supplied" });
    }
    if (newPassword === "") {
        // 비밀번호 유효성 검사 필요
        return res.status(400).send({ message: "Invalid format" });
    }
    try {
        const hashedPassword = hash_1.default(password);
        const userInfo = await User_1.User.findUserById(userId, hashedPassword);
        if (!userInfo) {
            return res.status(404).json({ message: "User not found" });
        }
        const hashedNewPassword = hash_1.default(newPassword);
        userInfo.password = hashedNewPassword;
        await userInfo.save();
        return res.status(201).json({ message: "Update password succeed" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Update password failed" });
    }
};
exports.default = updatePassword;
//# sourceMappingURL=updatePassword.js.map