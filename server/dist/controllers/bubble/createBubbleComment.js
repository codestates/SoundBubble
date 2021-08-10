"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bubble_1 = require("../../entity/Bubble");
const BubbleComment_1 = require("../../entity/BubbleComment");
const createBubbleComment = async (req, res) => {
    //* 임시로 userId를 이용하여 유저 특정 -> 토큰에서 검증한 값으로 변경
    const userId = 1;
    //* ---------------------------
    const { id: bubbleId } = req.params;
    const { textContent } = req.body;
    if (!bubbleId || !textContent) {
        return res.status(400).json({ message: "Insufficient parameters supplied" });
    }
    try {
        const bubbleInfo = await Bubble_1.Bubble.findOne(bubbleId);
        if (!bubbleInfo) {
            return res.status(400).json({ message: "Invalid request" });
        }
        const newBubbleComment = new BubbleComment_1.BubbleComment();
        newBubbleComment.textContent = textContent;
        newBubbleComment.bubble = bubbleInfo;
        newBubbleComment.userId = userId;
        // newBubbleComment.user = userInfo;
        newBubbleComment.save();
        res.status(201).json({ message: "Comment successfully registered" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to register comment" });
    }
};
exports.default = createBubbleComment;
//# sourceMappingURL=createBubbleComment.js.map