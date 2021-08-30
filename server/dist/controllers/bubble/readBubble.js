"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bubble_1 = require("../../entity/Bubble");
const BubbleComment_1 = require("../../entity/BubbleComment");
const log_1 = require("../../utils/log");
const readBubble = async (req, res, next) => {
    const bubbleId = req.params.id;
    try {
        //* 파라미터 검사
        if (isNaN(Number(bubbleId))) {
            return res.status(400).json({ message: `Invalid bubbleId(param), input 'bubbleId': ${bubbleId}` });
        }
        //* 버블 조회
        const bubble = await Bubble_1.Bubble.findBubble(Number(bubbleId));
        if (!bubble) {
            return res.status(404).json({ message: "Bubble not found" });
        }
        //* 해당 버블의 댓글 조회
        const comments = await BubbleComment_1.BubbleComment.findComments(Number(bubbleId));
        res.status(200).json({ data: { bubble, comments }, message: "Bubble and comments successfully read" });
    }
    catch (err) {
        log_1.logError("Failed to read bubble and comments");
        next(err);
    }
};
exports.default = readBubble;
