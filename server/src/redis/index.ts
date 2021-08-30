import redis, { RedisClient } from "redis";
import { log, logError } from "../utils/log";
import { promisify } from "util";
import { RedisTokenList } from "../@type/redis";
import { verifyAccessToken } from "../token";
import { JwtPayload } from "jsonwebtoken";

const redisPort: number = Number(process.env.REDIS_PORT) as number;
const redisHost: string = process.env.REDIS_HOST as string;

//* Redis Client
export const redisClient: RedisClient = redis.createClient(redisPort, redisHost);

redisClient.on("error", function (error) {
	logError("Redis 접속 실패");
	console.error(error);
});

// promisification: 콜백을 받는 함수를 프로미스를 반환하는 함수로 변경
const setAsync = promisify(redisClient.set).bind(redisClient);
const getAsync = promisify(redisClient.get).bind(redisClient);

//? Redis 구조
// userId: {
// 	white: [화이트리스트에 등록된 토큰들],
// 	black: [블랙리스트에 등록된 토큰들]
// }

//* 화이트 리스트에 액세스 토큰 등록: 로그인
export const insertWhiteList = async (userId: number, accessToken: string): Promise<void> => {
	const redisData: string | null = await getAsync(String(userId));

	if (redisData) {
		const list: RedisTokenList = JSON.parse(redisData);
		list.white.push(accessToken);
		await setAsync(String(userId), JSON.stringify(list));
		log(`[유저 ${userId}] 토큰 화이트리스트: 토큰 등록`);
	} else {
		const list: RedisTokenList = {
			white: [],
			black: [],
		};
		list.white.push(accessToken);
		await setAsync(String(userId), JSON.stringify(list));
		log(`[유저 ${userId}] 토큰 리스트 생성`);
		log(`[유저 ${userId}] 토큰 화이트리스트: 토큰 등록`);
	}
};

//* 블랙 리스트에 액세스 토큰 등록: 로그아웃
export const insertBlackList = async (userId: number, accessToken: string): Promise<void> => {
	const redisData: string | null = await getAsync(String(userId));

	if (redisData) {
		const list: RedisTokenList = JSON.parse(redisData);

		// 블랙리스트에서 토큰을 저장된 순서대로 검사하여 만료되었으면 삭제
		let validTokenIdx = -1;
		for (let i = 0; i < list.black.length; i++) {
			const decoded: JwtPayload = await verifyAccessToken(list.black[i]);
			if (!decoded.error) {
				// 아직 만료되지 않은 토큰이 있으면 중지 (이전 인덱스까지의 토큰은 전부 만료)
				validTokenIdx = i;
				break;
			}
			// 배열 내부에는 전부 만료된 토큰 (break에 걸리지 않음)
			validTokenIdx = list.black.length;
		}
		if (validTokenIdx >= 1) {
			list.black = list.black.slice(validTokenIdx);
			log(`[유저 ${userId}] 토큰 블랙리스트: ${validTokenIdx}개의 만료된 토큰 삭제`);
		}

		list.black.push(accessToken);
		await setAsync(String(userId), JSON.stringify(list));
		log(`[유저 ${userId}] 토큰 블랙리스트: 토큰 등록`);
	} else {
		const list: RedisTokenList = {
			white: [],
			black: [],
		};
		list.black.push(accessToken);
		await setAsync(String(userId), JSON.stringify(list));
		log(`[유저 ${userId}] 토큰 리스트 생성`);
		log(`[유저 ${userId}] 토큰 블랙리스트: 토큰 등록`);
	}
};

//* 화이트리스트 조회: 만료된 액세스 토큰 검증 이후 (1회성. 액세스 토큰 재발급용)
export const checkWhiteList = async (userId: number, accessToken: string): Promise<boolean> => {
	const redisData: string | null = await getAsync(String(userId));

	if (redisData) {
		const list: RedisTokenList = JSON.parse(redisData);
		const idx: number = list.white.indexOf(accessToken);

		if (idx >= 0) {
			log(`[유저 ${userId}] 토큰 화이트리스트: 토큰 존재`);
			list.white.splice(idx, 1); // 조회한 토큰은 삭제 (다시 조회 불가 -> 다시 토큰 재발급 불가)
			await setAsync(String(userId), JSON.stringify(list));
			return true;
		}
	}
	return false;
};

//* 블랙리스트 조회: 유효한 액세스 토큰 검증 이후
export const checkBlackList = async (userId: number, accessToken: string): Promise<boolean> => {
	const redisData: string | null = await getAsync(String(userId));

	if (redisData) {
		const list: RedisTokenList = JSON.parse(redisData);
		if (list.black.includes(accessToken)) {
			log(`[유저 ${userId}] 토큰 블랙리스트: 토큰 존재`);
			return true;
		}
	}
	return false;
};

//* 화이트리스트 삭제: 리프레시 토큰 만료시
export const clearWhiteList = async (userId: number): Promise<void> => {
	const redisData: string | null = await getAsync(String(userId));

	if (redisData) {
		const list: RedisTokenList = JSON.parse(redisData);
		list.white = [];
		await setAsync(String(userId), JSON.stringify(list));
		log(`[유저 ${userId}] 토큰 화이트리스트: 초기화`);
	}
};
