import { Response } from "express";
import {
  verifyAccessToken,
  verifyExpiredAccessToken,
  verifyRefreshToken,
  generateAccessToken,
} from "../controllers/token";
import { TokenInfo } from "../@type/tokenUserInfo";
import { User } from "../entity/User";
import { UserToken } from "../entity/UserToken";

const getUserInfo = async (res: Response, accessToken: string): Promise<TokenInfo> => {
  const tokenInfo: TokenInfo = {
    userId: null,
    email: null,
    accountType: null,
    error: null,
  };

  try {
    // 토큰 검사
    const decoded = await verifyAccessToken(accessToken);

    //* (1) 만료된 토큰
    if (decoded.name === "TokenExpiredError") {
      // 만료된 액세스 토큰 강제 검증
      const decodedExpired = await verifyExpiredAccessToken(accessToken);
      if (!decodedExpired.userId || !decodedExpired.email || !decodedExpired.accountType) {
        tokenInfo.error = "INVALID";
        return tokenInfo;
      }

      // 검증한 값으로 유저를 특정하여 리프레시 토큰 획득
      const userInfo: User | undefined = await User.findOne(decodedExpired.userId);
      if (!userInfo) {
        tokenInfo.error = "INVALID";
        return tokenInfo;
      }
      const userToken: UserToken | undefined = await UserToken.findOne(userInfo.id);
      if (!userToken) {
        tokenInfo.error = "INVALID";
        return tokenInfo;
      }

      // 리프레시 토큰 검증
      const refreshToken = userToken.refreshToken;
      const decodedRefresh = await verifyRefreshToken(refreshToken);
      if (decodedRefresh.name) {
        if (decodedRefresh.name === "TokenExpiredError") {
          tokenInfo.error = "EXPIRED";
        } else if (decodedRefresh.name === "JsonWebTokenError") {
          tokenInfo.error = "INVALID";
        }
        if (userInfo.id !== decodedRefresh.userId) {
          tokenInfo.error = "INVALID";
        }
        // 검증 실패 -> 리프레시 토큰 삭제
        userToken.refreshToken = "";
        await userToken.save();
        return tokenInfo;
      }

      // 액세스 토큰 재발급, 응답 헤더에 저장
      const newAccessToken = await generateAccessToken(userInfo);
      res.setHeader("authorization", `Bearer ${newAccessToken}`);
      console.log("액세스 토큰 재발급");
      tokenInfo.userId = decodedRefresh.userId;
      tokenInfo.email = decodedRefresh.email;
      tokenInfo.accountType = decodedRefresh.accountType;
      return tokenInfo;
      //* (2) 유효하지 않은 토큰
    } else if (decoded.name === "JsonWebTokenError") {
      tokenInfo.error = "INVALID";
      return tokenInfo;
      //* (3) 유효한 토큰
    } else {
      tokenInfo.userId = decoded.userId;
      tokenInfo.email = decoded.email;
      tokenInfo.accountType = decoded.accountType;
      return tokenInfo;
    }
  } catch (error) {
    console.error(error);
    tokenInfo.error = "SERVER";
    return tokenInfo;
  }
};

export default getUserInfo;
