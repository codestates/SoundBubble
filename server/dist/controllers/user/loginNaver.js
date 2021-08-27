"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const User_1 = require("../../entity/User");
const UserToken_1 = require("../../entity/UserToken");
const token_1 = require("../../token");
const log_1 = require("../../utils/log");
const redis_1 = require("../../redis");
const loginNaver = async (req, res, next) => {
    //* 클라이언트로부터 Authorization Code 획득
    const { authorizationCode } = req.body;
    try {
        //* 파라미터 검사
        if (!authorizationCode) {
            return res.status(400).json({ message: "Invalid authorizationCode(body), failed to get token" });
        }
        //* 네이버 토큰 획득
        const NaverClientId = process.env.NAVER_CLIENT_ID;
        const NaverClientSecret = process.env.NAVER_CLIENT_SECRET;
        const NaverRedirectUri = process.env.NAVER_REDIRECT_URI;
        const token = await axios_1.default({
            url: "https://nid.naver.com/oauth2.0/token",
            method: "post",
            params: {
                client_id: NaverClientId,
                client_secret: NaverClientSecret,
                code: authorizationCode,
                redirect_uri: NaverRedirectUri,
                grant_type: "authorization_code",
                state: "naverstate",
            },
        });
        const naverAccessToken = token.data.access_token;
        if (!naverAccessToken) {
            return res.status(400).json({ message: "Invalid authorizationCode(body), failed to get token" });
        }
        //* 액세스 토큰으로 유저 정보 요청
        const profile = await axios_1.default({
            url: "https://openapi.naver.com/v1/nid/me",
            headers: {
                Authorization: `bearer ${naverAccessToken}`,
            },
        });
        const { email, nickname } = profile.data.response;
        if (!email || !nickname) {
            return res.status(406).json({ message: "Invalid scope, failed to get user information" });
        }
        //* 유저 검색
        const userUsingEmail = await User_1.User.findOne({ email });
        // (1) 유저 없음 -> 회원가입
        if (!userUsingEmail) {
            // 유효한 닉네임 획득
            const validName = await User_1.User.getValidNickname(nickname);
            if (!validName) {
                return next(new Error("Failed to get valid nickname"));
            }
            const profileImage = profile.data.response.profile_image;
            if (profileImage) {
                await User_1.User.insertUser(email, "", validName, "naver", "user", profileImage);
            }
            else {
                await User_1.User.insertUser(email, "", validName, "naver", "user");
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
        const accessToken = token_1.generateAccessToken(userInfo);
        const refreshToken = token_1.generateRefreshToken(userInfo);
        // DB에 리프레시 토큰 저장
        await UserToken_1.UserToken.insertToken(userInfo.id, refreshToken);
        // 토큰 화이트리스트에 액세스 토큰 저장
        if (process.env.NODE_ENV === "production") {
            await redis_1.insertWhiteList(userInfo.id, accessToken);
        }
        // 응답 쿠키에 액세스 토큰 저장
        res.cookie("accessToken", accessToken, token_1.cookieOptions);
        return res.json({ data: { userInfo }, message: "Login succeed" });
    }
    catch (err) {
        log_1.logError("Faild to Naver login");
        next(err);
    }
};
exports.default = loginNaver;
