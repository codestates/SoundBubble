"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = exports.log = void 0;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const log = (...values) => {
    console.log("[LOG]", ...values);
};
exports.log = log;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const logError = (...values) => {
    console.log("[ERROR]", ...values);
};
exports.logError = logError;
//# sourceMappingURL=log.js.map