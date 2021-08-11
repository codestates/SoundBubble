"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../entity/User");
const hash_1 = __importDefault(require("../../utils/hash"));
const updateNickname = async (req, res) => {
    const { userId } = req.userInfo;
    const { nickname, password } = req.body;
    if (!password || !nickname) {
        return res.status(400).send({ message: "Insufficient parameters supplied" });
    }
    if (nickname === "") {
        return res.status(400).send({ message: "Invalid format" });
    }
    try {
        const hashedPassword = hash_1.default(password);
        const userInfo = await User_1.User.findUserById(userId, hashedPassword);
        if (!userInfo) {
            return res.status(404).json({ message: "User not found" });
        }
        userInfo.nickname = nickname;
        await userInfo.save();
        return res.status(201).json({ data: { userInfo }, message: "Update nickname succeed" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Update nickname failed" });
    }
};
exports.default = updateNickname;
//# sourceMappingURL=updateNickname.js.map