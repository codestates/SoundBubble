"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bubble_1 = require("../../entity/Bubble");
const BubbleComment_1 = require("../../entity/BubbleComment");
const createBubbleComment = async (req, res) => {
    const { userId } = req.userInfo;
    const textContent = req.body.textContent;
    const bubbleId = req.params.id;
    // const { id: bubbleId }: { id: string } = req.params as any;
    try {
        //* 파라미터 검사
        if (!textContent) {
            return res.status(400).json({ message: `Invalid textContent(body), input 'textContent': ${textContent}` });
        }
        //* 버블 조회. 존재하는 버블인지 확인
        const bubbleInfo = await Bubble_1.Bubble.findOne(bubbleId);
        if (!bubbleInfo) {
            return res.status(404).json({ message: "Bubble not found" });
        }
        //* 댓글 입력
        await BubbleComment_1.BubbleComment.insertComment(userId, Number(bubbleId), textContent);
        //* 갱신된 댓글 목록 조회
        const comments = await BubbleComment_1.BubbleComment.findComments(Number(bubbleId));
        res.status(201).json({ data: { comments }, message: "Comment successfully registered" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to register comment" });
    }
};
exports.default = createBubbleComment;
//# sourceMappingURL=createBubbleComment.js.map