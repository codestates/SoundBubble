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
const uploadResources_1 = __importDefault(require("../middlewares/uploadResources"));
const bubbleRouter = express_1.default.Router();
// 모든 버블 조회
bubbleRouter.get("/", controller.readAllBubble);
// 버블 업로드
bubbleRouter.post("/upload", uploadResources_1.default.fields([
    { name: "image", maxCount: 1 },
    { name: "sound", maxCount: 1 },
]), controller.createBubble);
// 버블 상세 조회
bubbleRouter.get("/:id", controller.readBubble);
// 버블 댓글 등록
bubbleRouter.post("/:id/comment", controller.createBubbleComment);
// 본인 댓글 삭제
bubbleRouter.delete("/:id/comment", controller.deleteBubbleComment);
exports.default = bubbleRouter;
//# sourceMappingURL=bubbleRouter.js.map