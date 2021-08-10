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
    }, accessSecret, { expiresIn: '1d' });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (user) => {
    return jwt.sign({
        userId: user.id,
        email: user.email,
    }, refreshSecret, { expiresIn: '14d' });
};
exports.generateRefreshToken = generateRefreshToken;
const verifyAccessToken = (req) => {
    const authorization = req.headers["authorization"];
    if (!authorization) {
        return "not authorized";
    }
    const token = authorization.split(" ")[1];
    try {
        return jwt.verify(token, accessSecret);
    }
    catch (error) {
        return error;
    }
};
exports.verifyAccessToken = verifyAccessToken;
//# sourceMappingURL=index.js.map