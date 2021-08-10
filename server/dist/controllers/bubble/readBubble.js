"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bubble_1 = require("../../entity/Bubble");
const BubbleComment_1 = require("../../entity/BubbleComment");
const readBubble = async (req, res) => {
    const { id: bubbleId } = req.params;
    try {
        const bubble = await Bubble_1.Bubble.findBubble(Number(bubbleId));
        if (!bubble) {
            return res.status(400).json({ message: "Invalid request" });
        }
        const comments = await BubbleComment_1.BubbleComment.findComments(Number(bubbleId));
        res.json({ data: { bubble, comments }, message: "All bubble info successfully read" });
    }
    catch (error) {
        console.error(error);
        res.json({ message: "Failed to read all bubbles" });
    }
};
exports.default = readBubble;
//# sourceMappingURL=readBubble.js.map