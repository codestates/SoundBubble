"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyExpiredAccessToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = exports.cookieOptions = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const log_1 = require("../utils/log");
exports.cookieOptions = {
    maxAge: 24 * 60 * 60 * 1000 * 3,
    httpOnly: true,
    secure: true,
    sameSite: "none",
};
const accessSecret = process.env.ACCESS_SECRET;
const refreshSecret = process.env.REFRESH_SECRET;
const generateAccessToken = (user) => {
    return jsonwebtoken_1.default.sign({
        userId: user.id,
        email: user.email,
        accountType: user.accountType,
    }, accessSecret, { expiresIn: "1d" });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (user) => {
    return jsonwebtoken_1.default.sign({
        userId: user.id,
        email: user.email,
        accountType: user.accountType,
    }, refreshSecret, { expiresIn: "14d" });
};
exports.generateRefreshToken = generateRefreshToken;
const verifyAccessToken = (accessToken) => {
    try {
        return jsonwebtoken_1.default.verify(accessToken, accessSecret);
    }
    catch (error) {
        log_1.logError("Invalid access token:", error.name, error.message);
        return Object.assign(error, { error: true });
    }
};
exports.verifyAccessToken = verifyAccessToken;
const verifyExpiredAccessToken = (accessToken) => {
    try {
        return jsonwebtoken_1.default.verify(accessToken, accessSecret, { ignoreExpiration: true });
    }
    catch (error) {
        log_1.logError("Invalid access token:", error.name, error.message);
        return Object.assign(error, { error: true });
    }
};
exports.verifyExpiredAccessToken = verifyExpiredAccessToken;
const verifyRefreshToken = (refreshToken) => {
    try {
        return jsonwebtoken_1.default.verify(refreshToken, refreshSecret);
    }
    catch (error) {
        log_1.logError("Invalid refresh token:", error.name, error.message);
        return Object.assign(error, { error: true });
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
//# sourceMappingURL=index.js.map