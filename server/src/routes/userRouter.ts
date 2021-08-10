import * as controller from "../controllers";
import express from "express";
import authUser from "../middlewares/authUser";

const userRouter = express.Router();

// 회원가입
userRouter.post("/signup", controller.signUp);

// 로그인
userRouter.post("/login", controller.login);

//* 로그인이 필요한 요청
userRouter.use("/", authUser);

// 닉네임 수정
userRouter.patch("/mypage/nickname", controller.updateNickname);

// 비밀번호 수정
userRouter.patch("/mypage/password", controller.updatePassword);

// 본인 버블 조회
userRouter.get("/mypage/bubble", controller.readMyBubble);

export default userRouter;
