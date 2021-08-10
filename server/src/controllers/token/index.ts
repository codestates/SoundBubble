import { Request, Response } from "express";
import { User } from "../../entity/User";
import jwt = require("jsonwebtoken");

const accessSecret = process.env.ACCESS_SECRET;
const refreshSecret = process.env.REFRESH_SECRET;

export const generateAccessToken = (user: User) => {
  return jwt.sign({
    userId: user.id,
    email: user.email,
  }, accessSecret!, { expiresIn: '1d' });
}

export const generateRefreshToken = (user: User) => {
  return jwt.sign({
    userId: user.id,
    email: user.email,
  }, refreshSecret!, { expiresIn: '14d' });
}

export const verifyAccessToken = (req: Request) => {
  const authorization = req.headers["authorization"];
  if (!authorization) {
    return "not authorized";
  }
  const token = authorization.split(" ")[1];
  try {
    return jwt.verify(token, accessSecret!);
  } catch (error) {
    return error;
  }
}