import { User } from "../../entity/User";
import jwt from "jsonwebtoken";

const accessSecret: string = process.env.ACCESS_SECRET as string;
const refreshSecret: string = process.env.REFRESH_SECRET as string;

export const generateAccessToken = (user: User): string => {
  return jwt.sign({
    userId: user.id,
    email: user.email,
    accountType: user.accountType,
  }, accessSecret, { expiresIn: '1d' });
}

export const generateRefreshToken = (user: User): string => {
  return jwt.sign({
    userId: user.id,
    email: user.email,
    accountType: user.accountType,
  }, refreshSecret, { expiresIn: '14d' });
}

export const verifyAccessToken = (accessToken: string): any => {
  try {
    return jwt.verify(accessToken, accessSecret);
  } catch (error) {
    return error;
  }
}

export const verifyExpiredAccessToken = (accessToken: string): any => {
  try {
    return jwt.verify(accessToken, accessSecret, { ignoreExpiration: true });
  } catch (error) {
    return error;
  }
}

export const verifyRefreshToken = (refreshToken: string): any => {
  try {
    return jwt.verify(refreshToken, refreshSecret);
  } catch (error) {
    return error;
  }
}