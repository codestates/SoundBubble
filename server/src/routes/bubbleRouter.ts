import * as controller from "../controllers";
import express from "express";
import upload from "../middlewares/uploadResources";

const bubbleRouter = express.Router();

// 모든 버블 조회
bubbleRouter.get("/", controller.readAllBubble);

// 버블 업로드
bubbleRouter.post(
  "/upload",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "sound", maxCount: 1 },
  ]),
  controller.createBubble
);

// 버블 상세 조회
bubbleRouter.get("/:id", controller.readBubble);

// 버블 댓글 등록
bubbleRouter.post("/:id/comment", controller.createBubbleComment);

// 본인 댓글 삭제
bubbleRouter.delete("/:id/comment", controller.deleteBubbleComment);

export default bubbleRouter;
