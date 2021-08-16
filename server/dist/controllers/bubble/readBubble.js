"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bubble_1 = require("../../entity/Bubble");
const BubbleComment_1 = require("../../entity/BubbleComment");
const readBubble = async (req, res) => {
    const bubbleId = req.params.id;
    try {
        //* 버블 조회
        const bubble = await Bubble_1.Bubble.findBubble(Number(bubbleId));
        if (!bubble) {
            return res.status(404).json({ message: "Bubble not found" });
        }
        //* 해당 버블의 댓글 조회
        const comments = await BubbleComment_1.BubbleComment.findComments(Number(bubbleId));
        res.status(200).json({ data: { bubble, comments }, message: "Bubble and comments successfully read" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to read bubble and comments" });
    }
};
exports.default = readBubble;
//# sourceMappingURL=readBubble.js.map