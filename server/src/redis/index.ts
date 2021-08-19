import redis, { RedisClient } from "redis";
import { logError } from "../utils/log";
import { promisify } from "util";

const redisPort: number = Number(process.env.REDIS_PORT) as number;
const redisHost: string = process.env.REDIS_HOST as string;

export const redisClient: RedisClient = redis.createClient(redisPort, redisHost);

redisClient.on("error", function (error) {
	logError("Redis 접속 실패");
	console.error(error);
	// redisClient.quit();
});

redisClient.flushall();

export const setexAsync = promisify(redisClient.setex).bind(redisClient);
export const getAsync = promisify(redisClient.get).bind(redisClient);
