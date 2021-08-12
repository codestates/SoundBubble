import { Request, Response, RequestHandler } from "express";
import { User } from "../../entity/User";
import { UserToken } from "../../entity/UserToken";
import { generateAccessToken, generateRefreshToken } from "../token/index";
import { LoginTicket, OAuth2Client, TokenPayload } from "google-auth-library";
import { GoogleTokenPayload } from '../../@type/oAuthUserInfo';
import { GetTokenResponse } from 'google-auth-library/build/src/auth/oauth2client';

const loginGoogle: RequestHandler = async (req: Request, res: Response) => {
  // 클라이언트로부터 code 획득
  const { authorizationCode }: { authorizationCode: string } = req.body;
  
  if (!authorizationCode) {
    return res.status(400).json({ message: "Code does not exist" });
  }
  
  try {
    const googleClientId = process.env.GOOGLE_CLIENT_ID as string;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET as string;
    const redirect_url = process.env.CLIENT_REDIRECT_URL as string;

    const googleClient: OAuth2Client = new OAuth2Client(googleClientId, googleClientSecret, redirect_url);

    // 토큰 획득
    const response: GetTokenResponse = await googleClient.getToken(authorizationCode);

    if (!response.tokens || !response.tokens.id_token) {
      return res.status(400).json({ "message": "Failed to get google token" });
    }

    const idToken: string = response.tokens.id_token;

    const ticket: LoginTicket = await googleClient.verifyIdToken({ idToken: idToken });
    const googleUserInfo: TokenPayload | undefined = ticket.getPayload();

    if (!googleUserInfo || !googleUserInfo.email || !googleUserInfo.name) {
      return res.status(400).json({ "message": "Failed to get google user info" });
    }
    
    const { email, name }: { email: string, name: string } = googleUserInfo as GoogleTokenPayload;

    const user: User | undefined = await User.findOne({ email });
    
    // 유저 없음. 회원가입
    if (!user) {  
      if (googleUserInfo.picture) {
        const profileImage: string = googleUserInfo.picture;
        await User.insertUser(email, "", name, "google", "user", profileImage);
      } else {
        await User.insertUser(email, "", name, "google", "user");
      }
    }

    // 유저 존재. 소셜 로그인 대신 먼저 이메일로 가입한 유저
    //! 이메일 도용 문제 존재
    if (user && user.signUpType === "email") {
      user.signUpType = "intergration"; // 계정 통합
      await user.save();
    }
    
    const userInfo = await User.findUserByEmail(email) as User;
     
    const accessToken: string = generateAccessToken(userInfo);
    const refreshToken: string = generateRefreshToken(userInfo);

    await UserToken.insertToken(userInfo.id, refreshToken);

    return res.status(200).json({ data: { accessToken, userInfo }, message: "Login succeed" });
  } catch (error) {
    console.error(error);
    return res.status(200).json({ message: "Faild to google login" });
  }
};

export default loginGoogle;
