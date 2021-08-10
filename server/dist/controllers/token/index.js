"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jwt = require("jsonwebtoken");
const accessSecret = process.env.ACCESS_SECRET;
const refreshSecret = process.env.REFRESH_SECRET;
const generateAccessToken = (user) => {
    return jwt.sign({
        userId: user.id,
        email: user.email,
        accountType: user.accountType,
    }, accessSecret, { expiresIn: '1d' });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (user) => {
    return jwt.sign({
        userId: user.id,
        email: user.email,
        accountType: user.accountType,
    }, refreshSecret, { expiresIn: '14d' });
};
exports.generateRefreshToken = generateRefreshToken;
const verifyAccessToken = (accessToken) => {
    try {
        return jwt.verify(accessToken, accessSecret);
    }
    catch (error) {
        return error;
    }
};
exports.verifyAccessToken = verifyAccessToken;
//# sourceMappingURL=index.js.map