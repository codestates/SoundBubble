"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = __importDefault(require("redis"));
const log_1 = require("../utils/log");
const redisPort = Number(process.env.REDIS_PORT);
const redisHost = process.env.REDIS_HOST;
const redisClient = redis_1.default.createClient(redisPort, redisHost);
redisClient.on("error", function (error) {
    log_1.logError("Redis 접속 실패");
    console.error(error);
});
redisClient.flushall();
console.log("Redis 접속 완료");
exports.default = redisClient;
//# sourceMappingURL=index.js.map