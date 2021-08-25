"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../entity/User");
const UserToken_1 = require("../../entity/UserToken");
const index_1 = require("../../token/index");
const google_auth_library_1 = require("google-auth-library");
const log_1 = require("../../utils/log");
const redis_1 = require("../../redis");
const loginGoogle = async (req, res, next) => {
    //* 클라이언트로부터 Authorization Code 획득
    const authorizationCode = req.body.authorizationCode;
    try {
        //* 파라미터 검사
        if (!authorizationCode) {
            return res.status(400).json({ message: "Code(body) does not exist" });
        }
        //* 구글 유저 정보 획득
        const googleClientId = process.env.GOOGLE_CLIENT_ID;
        const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const redirect_url = process.env.CLIENT_REDIRECT_URL;
        const googleClient = new google_auth_library_1.OAuth2Client(googleClientId, googleClientSecret, redirect_url);
        //* 구글 토큰 획득
        let response;
        try {
            response = await googleClient.getToken(authorizationCode);
        }
        catch (err) {
            console.log("Invalid Authorization Code");
            console.error(err);
            return res.status(400).json({ message: "Invalid code(body), failed to get token" });
        }
        if (!response.tokens || !response.tokens.id_token) {
            return res.status(400).json({ message: "Invalid code(body), failed to get token" });
        }
        //* 구글 id 토큰 검증하여 유저 정보 획득
        const idToken = response.tokens.id_token;
        const ticket = await googleClient.verifyIdToken({ idToken: idToken });
        const googleUserInfo = ticket.getPayload();
        if (!googleUserInfo || !googleUserInfo.email || !googleUserInfo.name) {
            return res.status(400).json({ message: "Invalid code(body), failed to get user information" });
        }
        // const { email, name }: { email: string; name: string } = googleUserInfo as GoogleTokenPayload;
        const email = googleUserInfo.email;
        const nickname = googleUserInfo.name;
        //* 유저 검색
        const userUsingEmail = await User_1.User.findOne({ email });
        // (1) 유저 없음 -> 회원가입
        if (!userUsingEmail) {
            // 유효한 닉네임 획득
            const validName = await User_1.User.getValidNickname(nickname);
            if (!validName) {
                return next(new Error("Failed to get valid nickname"));
            }
            // DB 입력
            if (googleUserInfo.picture) {
                const profileImage = googleUserInfo.picture;
                await User_1.User.insertUser(email, "", validName, "google", "user", profileImage);
            }
            else {
                await User_1.User.insertUser(email, "", validName, "google", "user");
            }
            res.status(201);
        }
        else {
            res.status(200);
        }
        // (2) 유저 존재. 소셜 로그인 대신 먼저 이메일로 가입한 유저
        if (userUsingEmail && userUsingEmail.signUpType === "email") {
            userUsingEmail.signUpType = "intergration"; // 계정 통합
            await userUsingEmail.save();
        }
        const userInfo = (await User_1.User.findUserByEmail(email));
        //* 토큰 발급
        const accessToken = index_1.generateAccessToken(userInfo);
        const refreshToken = index_1.generateRefreshToken(userInfo);
        await UserToken_1.UserToken.insertToken(userInfo.id, refreshToken);
        if (process.env.NODE_ENV === "production") {
            await redis_1.insertWhiteList(userInfo.id, accessToken);
        }
        return res.json({ data: { accessToken, userInfo }, message: "Login succeed" });
    }
    catch (err) {
        log_1.logError("Faild to google login");
        next(err);
    }
};
exports.default = loginGoogle;
//# sourceMappingURL=loginGoogle.js.map