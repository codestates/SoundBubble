"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAsync = exports.setexAsync = exports.redisClient = void 0;
const redis_1 = __importDefault(require("redis"));
const log_1 = require("../utils/log");
const util_1 = require("util");
const redisPort = Number(process.env.REDIS_PORT);
const redisHost = process.env.REDIS_HOST;
exports.redisClient = redis_1.default.createClient(redisPort, redisHost);
exports.redisClient.on("error", function (error) {
    log_1.logError("Redis 접속 실패");
    console.error(error);
    // redisClient.quit();
});
exports.redisClient.flushall();
exports.setexAsync = util_1.promisify(exports.redisClient.setex);
exports.getAsync = util_1.promisify(exports.redisClient.get);
//# sourceMappingURL=index.js.map