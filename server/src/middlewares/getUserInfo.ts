import { Response } from "express";
import { verifyAccessToken } from "../controllers/token";
import { TokenUserInfo } from "../@type/tokenUserInfo";

const getUserInfo = async (accessToken: string, loginType: string, res: Response) => {
  const userInfo: TokenUserInfo = {
    userId: null,
    email: null,
    accountType: null,
    error: null,
  };

  try {
    if (loginType === "email") {
      const decoded = await verifyAccessToken(accessToken);

      if (decoded.error === "expired") {
        userInfo.error = "EXPIRED";
        //? 리프레시 토큰으로 재발급 가능
        // -> verifyExpiredAccessToken으로 유저 정보 획득
        // -> 유저 정보로 해당 유저의 Refresh token 획득
        // -> Refresh token으로 Access token의 재발급
        // -> 성공 시 res의 헤더에 Acess token 삽입?
        // -> 실패 시 expired
      } else if (decoded.error === "invalid") {
        userInfo.error = "INVALID";
      } else {
        userInfo.userId = decoded.userId;
        userInfo.email = decoded.email;
        userInfo.accountType = decoded.accountType;
      }
    } else if (loginType === "google") {
    } else if (loginType === "naver") {
    }

    return userInfo;
  } catch (error) {
    console.error(error);
    userInfo.error = "SERVER";
  }
};

export default getUserInfo;
