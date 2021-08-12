"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../entity/User");
const UserToken_1 = require("../../entity/UserToken");
const index_1 = require("../token/index");
const google_auth_library_1 = require("google-auth-library");
const loginGoogle = async (req, res) => {
    // 클라이언트로부터 code 획득
    const { authorizationCode } = req.body;
    if (!authorizationCode) {
        return res.status(400).json({ message: "Code does not exist" });
    }
    try {
        const googleClientId = process.env.GOOGLE_CLIENT_ID;
        const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const redirect_url = process.env.CLIENT_REDIRECT_URL;
        const googleClient = new google_auth_library_1.OAuth2Client(googleClientId, googleClientSecret, redirect_url);
        // 토큰 획득
        const response = await googleClient.getToken(authorizationCode);
        if (!response.tokens || !response.tokens.id_token) {
            return res.status(400).json({ "message": "Failed to get google token" });
        }
        const idToken = response.tokens.id_token;
        const ticket = await googleClient.verifyIdToken({ idToken: idToken });
        const googleUserInfo = ticket.getPayload();
        if (!googleUserInfo || !googleUserInfo.email || !googleUserInfo.name) {
            return res.status(400).json({ "message": "Failed to get google user info" });
        }
        const { email, name } = googleUserInfo;
        const user = await User_1.User.findOne({ email });
        // 유저 없음. 회원가입
        if (!user) {
            if (googleUserInfo.picture) {
                const profileImage = googleUserInfo.picture;
                await User_1.User.insertUser(email, "", name, "google", "user", profileImage);
            }
            else {
                await User_1.User.insertUser(email, "", name, "google", "user");
            }
        }
        // 유저 존재. 소셜 로그인 대신 먼저 이메일로 가입한 유저
        //! 이메일 도용 문제 존재
        if (user && user.signUpType === "email") {
            user.signUpType = "intergration"; // 계정 통합
            await user.save();
        }
        const userInfo = await User_1.User.findUserByEmail(email);
        const accessToken = index_1.generateAccessToken(userInfo);
        const refreshToken = index_1.generateRefreshToken(userInfo);
        await UserToken_1.UserToken.insertToken(userInfo.id, refreshToken);
        return res.status(200).json({ data: { accessToken, userInfo }, message: "Login succeed" });
    }
    catch (error) {
        console.error(error);
        return res.status(200).json({ message: "Faild to google login" });
    }
};
exports.default = loginGoogle;
//# sourceMappingURL=loginGoogle.js.map