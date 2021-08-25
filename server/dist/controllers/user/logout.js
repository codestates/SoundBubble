"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserToken_1 = require("../../entity/UserToken");
const redis_1 = require("../../redis");
const log_1 = require("../../utils/log");
const logout = async (req, res, next) => {
    const { userId, accessToken, tokenExpIn } = req.userInfo;
    try {
        //* 토큰 블랙리스트에 만료되지 않은 액세스 토큰 저장
        if (process.env.NODE_ENV === "production") {
            await redis_1.insertBlackList(userId, accessToken);
            // const redisData: string | null = await getAsync(String(userId));
            // if (redisData) {
            // 	const list: RedisTokenList = JSON.parse(redisData);
            // 	// 블랙리스트에서 토큰을 저장된 순서대로 검사하여 만료되었으면 삭제
            // 	let validTokenIdx = -1;
            // 	for (let i = 0; i < list.black.length; i++) {
            // 		const decoded: JwtPayload = await verifyAccessToken(list.black[i]);
            // 		if (!decoded.error) {
            // 			// 아직 만료되지 않은 토큰이 있으면 중지 (이전 인덱스까지의 토큰은 전부 만료)
            // 			validTokenIdx = i;
            // 			break;
            // 		}
            // 		// 배열 내부에는 전부 만료된 토큰 (break에 걸리지 않음)
            // 		validTokenIdx = list.black.length;
            // 	}
            // 	if (validTokenIdx >= 1) {
            // 		list.black = list.black.slice(validTokenIdx);
            // 		log(`[유저 ${userId}] 토큰 블랙리스트: ${validTokenIdx}개의 만료된 토큰 삭제`);
            // 	}
            // 	list.black.push(accessToken);
            // 	// await setexAsync(String(userId), tokenExpIn, JSON.stringify(list));
            // 	await setAsync(String(userId), JSON.stringify(list));
            // 	log(`[유저 userId] 토큰 블랙리스트: 토큰 등록`);
            // } else {
            // 	const list: RedisTokenList = {
            // 		white: [],
            // 		black: [],
            // 	};
            // 	list.black.push(accessToken);
            // 	// await setexAsync(String(userId), tokenExpIn, JSON.stringify(list));
            // 	await setAsync(String(userId), JSON.stringify(list));				
            // 	log(`[유저 ${userId}] 토큰 리스트 생성`);
            // 	log(`[유저 ${userId}] 토큰 블랙리스트: 토큰 등록`);
            // }
        }
        // 리프레시 토큰 삭제
        const userToken = await UserToken_1.UserToken.findOne(userId);
        if (userToken) {
            userToken.refreshToken = "";
            await userToken.save();
        }
        res.status(200).json({ message: "Logout succeed" });
    }
    catch (err) {
        log_1.logError("Logout error");
        // 서버 상황에 관계 없이 사용자는 로그아웃 할 수 있어야 됨
        res.status(200).json({ message: "Logout succeed" });
        next(err);
    }
};
exports.default = logout;
//# sourceMappingURL=logout.js.map