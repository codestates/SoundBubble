"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller = __importStar(require("../controllers"));
const express_1 = __importDefault(require("express"));
const authUser_1 = __importDefault(require("../middlewares/authUser"));
const userRouter = express_1.default.Router();
// 회원가입
userRouter.post("/signup", controller.signUp);
// 로그인
userRouter.post("/login", controller.login);
// 구글 로그인
userRouter.post("/login/google", controller.loginGoogle);
// 네이버 로그인
userRouter.post("/login/naver", controller.loginNaver);
// 이메일 중복 확인
userRouter.post("/check/email", controller.checkEmail);
// 닉네임 중복 확인
userRouter.post("/check/nickname", controller.checkNickname);
//* 로그인이 필요한 요청
userRouter.use("/", authUser_1.default);
// 로그아웃
userRouter.get("/logout", controller.logout);
// 닉네임 수정
userRouter.patch("/mypage/nickname", controller.updateNickname);
// 비밀번호 수정
userRouter.patch("/mypage/password", controller.updatePassword);
// 본인 버블 조회
userRouter.get("/mypage/bubble", controller.readMyBubble);
exports.default = userRouter;
//# sourceMappingURL=userRouter.js.map