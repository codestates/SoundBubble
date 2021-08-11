"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bubble_1 = require("../../entity/Bubble");
const BubbleComment_1 = require("../../entity/BubbleComment");
const deleteBubbleComment = async (req, res) => {
    const { userId, accountType } = req.userInfo;
    const { id: bubbleId } = req.params;
    const { commentId } = req.body;
    if (!commentId) {
        return res.status(400).json({ message: "Insufficient parameters supplied" });
    }
    try {
        const bubbleInfo = await Bubble_1.Bubble.findOne(bubbleId);
        if (!bubbleInfo) {
            return res.status(400).json({ message: "Invalid bubble" });
        }
        const commentInfo = await BubbleComment_1.BubbleComment.findOne(commentId);
        if (!commentInfo) {
            return res.status(400).json({ message: "Invalid comment" });
        }
        if (accountType === "admin") {
            await commentInfo.remove();
        }
        else {
            if (commentInfo.userId === userId) {
                await commentInfo.remove();
            }
            else {
                return res.status(400).json({ message: "Invalid request" });
            }
        }
        const comments = await BubbleComment_1.BubbleComment.findComments(Number(bubbleId));
        res.json({ data: { comments }, message: "Comment successfully deleted" });
    }
    catch (error) {
        console.error(error);
        res.json({ message: "Failed to delete comment" });
    }
};
exports.default = deleteBubbleComment;
//# sourceMappingURL=deleteBubbleComment.js.map