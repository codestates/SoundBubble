"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = exports.log = void 0;
//? 커스텀 로그
const log = (...values) => {
    console.log("[LOG]", ...values);
};
exports.log = log;
const logError = (...values) => {
    console.log("[ERROR]", ...values);
};
exports.logError = logError;
