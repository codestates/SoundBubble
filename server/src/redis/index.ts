import redis from "redis";
import { logError } from "../utils/log";

const redisPort: number = Number(process.env.REDIS_PORT) as number;
const redisHost: string = process.env.REDIS_HOST as string;

const redisClient = redis.createClient(redisPort, redisHost);

redisClient.on("error", function (error) {
	logError("Redis 접속 실패");
	console.error(error);
	// redisClient.quit();
});

redisClient.flushall();

export default redisClient;
