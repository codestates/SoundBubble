"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
//* 해싱 함수
const hash = (value) => {
    const hashed = crypto_1.default
        .createHash("sha512")
        .update(value + process.env.SALT_SECRET)
        .digest("hex");
    return hashed;
};
exports.default = hash;
