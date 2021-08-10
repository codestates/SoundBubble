import { Request, Response } from "express";
import { User } from "../../entity/User";
import jwt from "jsonwebtoken";

const accessSecret = process.env.ACCESS_SECRET;
const refreshSecret = process.env.REFRESH_SECRET;

export const generateAccessToken = (user: User) => {
  return jwt.sign({
    userId: user.id,
    email: user.email,
    accountType: user.accountType,
  }, accessSecret!, { expiresIn: '1d' });
}

export const generateRefreshToken = (user: User) => {
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