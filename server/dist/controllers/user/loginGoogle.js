"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../entity/User");
const UserToken_1 = require("../../entity/UserToken");
const index_1 = require("../token/index");
const google_auth_library_1 = require("google-auth-library");
const loginGoogle = async (req, res) => {
    //* 클라이언트로부터 Authorization Code 획득
    const { authorizationCode } = req.body;
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
        const response = await googleClient.getToken(authorizationCode);
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
        const { email, name } = googleUserInfo;
        const user = await User_1.User.findOne({ email });
        //* 유저 없음 -> 회원가입
        if (!user) {
            if (googleUserInfo.picture) {
                const profileImage = googleUserInfo.picture;
                await User_1.User.insertUser(email, "", name, "google", "user", profileImage);
            }
            else {
                await User_1.User.insertUser(email, "", name, "google", "user");
            }
            res.status(201);
        }
        else {
            res.status(200);
        }
        //* 유저 존재. 소셜 로그인 대신 먼저 이메일로 가입한 유저
        //? 이메일 도용 문제 존재
        //! 일반 회원가입 -> 소셜 로그인 가능. 소셜 로그인 -> 일반 회원가입 불가.(소셜 로그인 유저는 비밀번호 변경을 통해 일반 로그인 가능)
        if (user && user.signUpType === "email") {
            user.signUpType = "intergration"; // 계정 통합
            await user.save();
        }
        const userInfo = (await User_1.User.findUserByEmail(email));
        //* 토큰 발급
        const accessToken = index_1.generateAccessToken(userInfo);
        const refreshToken = index_1.generateRefreshToken(userInfo);
        await UserToken_1.UserToken.insertToken(userInfo.id, refreshToken);
        return res.json({ data: { accessToken, userInfo }, message: "Login succeed" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Faild to google login" });
    }
};
exports.default = loginGoogle;
//# sourceMappingURL=loginGoogle.js.map