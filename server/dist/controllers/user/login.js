"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../entity/User");
const UserToken_1 = require("../../entity/UserToken");
const index_1 = require("../token/index");
const hash_1 = __importDefault(require("../../utils/hash"));
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Insufficient parameters supplied" });
    }
    try {
        const hashedPassword = hash_1.default(password);
        const userInfo = await User_1.User.findUserByEmail(email, hashedPassword);
        console.log(userInfo);
        if (!userInfo) {
            return res.status(401).json({ message: "Not authorized" });
        }
        const accessToken = index_1.generateAccessToken(userInfo);
        const refreshToken = index_1.generateRefreshToken(userInfo);
        // DB에 리프레시 토큰 저장
        await UserToken_1.UserToken.insertToken(userInfo.id, refreshToken);
        return res.status(201).json({ data: { accessToken, userInfo }, message: "Login succeed" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.default = login;
//# sourceMappingURL=login.js.map