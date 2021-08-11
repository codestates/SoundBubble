import { Request, Response } from "express";
import { User } from "../../entity/User";
import jwt, { JwtPayload } from "jsonwebtoken";
import { TokenUserInfo, TokenError } from '../../@type/tokenUserInfo';

const accessSecret = process.env.ACCESS_SECRET;
const refreshSecret = process.env.REFRESH_SECRET;

export const generateAccessToken = (user: User): string => {
  return jwt.sign({
    userId: user.id,
    email: user.email,
    accountType: user.accountType,
  }, accessSecret!, { expiresIn: '1d' });
}

export const generateRefreshToken = (user: User): string => {
  return jwt.sign({
    userId: user.id,
    email: user.email,
    accountType: user.accountType,
  }, refreshSecret!, { expiresIn: '14d' });
}

export const verifyAccessToken = (accessToken: string) => {
  try {
    return jwt.verify(accessToken, accessSecret!);
  } catch (error) {
    return error;
  }
}

export const verifyExpiredAccessToken = (accessToken: string) => {
  try {
    return jwt.verify(accessToken, accessSecret!, { ignoreExpiration: true });
  } catch (error) {
    return error;
  }
}

export const verifyRefreshToken = (refreshToken: string) => {
  try {
    return jwt.verify(refreshToken, refreshSecret!);
  } catch (error) {
    return error;
  }
}