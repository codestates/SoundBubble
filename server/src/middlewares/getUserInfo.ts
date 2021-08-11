import { Response } from "express";
import {
  verifyAccessToken,
  verifyExpiredAccessToken,
  verifyRefreshToken,
  generateAccessToken,
} from "../controllers/token";
import { TokenUserInfo } from "../@type/tokenUserInfo";
import { User } from "../entity/User";

const getUserInfo = async (accessToken: string, loginType: string, res: Response): Promise<TokenUserInfo> => {
  const tokenUserInfo: TokenUserInfo = {
    userId: null,
    email: null,
    accountType: null,
    error: null,
  };

  try {
    if (loginType === "email") {
      const decoded = await verifyAccessToken(accessToken);

      //* 만료된 토큰
      if (decoded.name === "TokenExpiredError") {
        // tokenUserInfo.error = "EXPIRED";
        // return tokenUserInfo;
        //! 만료된 토큰 재발급
        //?-------------------------------------------------------
        // 만료된 액세스 토큰 강제 검증
        const decodedExpired = await verifyExpiredAccessToken(accessToken);
        if (!decodedExpired.userId || !decodedExpired.email || !decodedExpired.accountType) {
          tokenUserInfo.error = "INVALID";
          return tokenUserInfo;
        }

        // 검증한 값으로 유저를 특정하여 리프레시 토큰 획득
        const userInfo: User | undefined = await User.findOne(decodedExpired.userId);
        if (!userInfo) {
          tokenUserInfo.error = "INVALID";
          return tokenUserInfo;
        }

        // 리프레시 토큰 검증
        const refreshToken: string = userInfo.refreshToken;
        if (!refreshToken) {
          tokenUserInfo.error = "INVALID";
          return tokenUserInfo;
        }
        const decodedRefresh = await verifyRefreshToken(refreshToken);
        if (decodedRefresh.name) {
          if (decodedRefresh.name === "TokenExpiredError") {
            tokenUserInfo.error = "EXPIRED";
          } else if (decodedRefresh.name === "JsonWebTokenError") {
            tokenUserInfo.error = "INVALID";
          }
          if (userInfo.id !== decodedRefresh.userId) {
            tokenUserInfo.error = "INVALID";
          }
          userInfo.refreshToken = "";
          await userInfo.save();
          return tokenUserInfo;
        }

        // 액세스 토큰 재발급하고 헤더에 저장
        const newAccessToken = await generateAccessToken(userInfo);
        res.setHeader("authorization", `Bearer ${newAccessToken}`);
        tokenUserInfo.userId = decodedRefresh.userId;
        tokenUserInfo.email = decodedRefresh.email;
        tokenUserInfo.accountType = decodedRefresh.accountType;
        //?-------------------------------------------------------

        //* 유효하지 않은 토큰
      } else if (decoded.name === "JsonWebTokenError") {
        tokenUserInfo.error = "INVALID";
        return tokenUserInfo;
      } else {
        tokenUserInfo.userId = decoded.userId;
        tokenUserInfo.email = decoded.email;
        tokenUserInfo.accountType = decoded.accountType;
        return tokenUserInfo;
      }
    } else if (loginType === "google") {
    } else if (loginType === "naver") {
    }
    
    return tokenUserInfo;
  } catch (error) {
    console.error(error);
    tokenUserInfo.error = "SERVER";
    return tokenUserInfo;
  }
};

export default getUserInfo;
