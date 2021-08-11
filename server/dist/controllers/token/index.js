"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyExpiredAccessToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const accessSecret = process.env.ACCESS_SECRET;
const refreshSecret = process.env.REFRESH_SECRET;
const generateAccessToken = (user) => {
    return jsonwebtoken_1.default.sign({
        userId: user.id,
        email: user.email,
        accountType: user.accountType,
    }, accessSecret, { expiresIn: '1d' });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (user) => {
    return jsonwebtoken_1.default.sign({
        userId: user.id,
        email: user.email,
        accountType: user.accountType,
    }, refreshSecret, { expiresIn: '14d' });
};
exports.generateRefreshToken = generateRefreshToken;
const verifyAccessToken = (accessToken) => {
    try {
        return jsonwebtoken_1.default.verify(accessToken, accessSecret);
    }
    catch (error) {
        return error;
    }
};
exports.verifyAccessToken = verifyAccessToken;
const verifyExpiredAccessToken = (accessToken) => {
    try {
        return jsonwebtoken_1.default.verify(accessToken, accessSecret, { ignoreExpiration: true });
    }
    catch (error) {
        return error;
    }
};
exports.verifyExpiredAccessToken = verifyExpiredAccessToken;
const verifyRefreshToken = (refreshToken) => {
    try {
        return jsonwebtoken_1.default.verify(refreshToken, refreshSecret);
    }
    catch (error) {
        return error;
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
//# sourceMappingURL=index.js.map