"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Bubble_1 = require("../../entity/Bubble");
const BubbleComment_1 = require("../../entity/BubbleComment");
const checkQueryParams_1 = __importDefault(require("../../utils/checkQueryParams"));
const readBubble = async (req, res) => {
    const { id: bubbleId } = req.params;
    let { order } = req.query;
    try {
        const _order = checkQueryParams_1.default("order", order);
        const bubble = await Bubble_1.Bubble.createQueryBuilder("bubble")
            .where("bubble.id = :id", { id: bubbleId })
            .leftJoinAndSelect("bubble.user", "user")
            .select(["bubble.id", "bubble.image", "bubble.sound", "bubble.textContent", "user.nickname"])
            .getOne();
        if (!bubble) {
            return res.status(400).json({ message: "Invalid request" });
        }
        const comments = await BubbleComment_1.BubbleComment.createQueryBuilder("comment")
            .where("bubbleId = :id", { id: bubble.id })
            .leftJoinAndSelect("comment.user", "user")
            .select(["comment.id", "comment.textContent", "user.nickname"])
            .orderBy("comment.id", _order)
            .getMany();
        res.json({ data: { bubble, comments }, message: "All bubble info successfully read" });
    }
    catch (error) {
        console.error(error);
        res.json({ message: "Failed to read all bubbles" });
    }
};
exports.default = readBubble;
//# sourceMappingURL=readBubble.js.map