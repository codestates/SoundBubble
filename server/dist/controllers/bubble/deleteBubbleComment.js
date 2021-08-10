"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../entity/User");
const Bubble_1 = require("../../entity/Bubble");
const BubbleComment_1 = require("../../entity/BubbleComment");
const deleteBubbleComment = async (req, res) => {
    //* 임시로 userId를 이용하여 유저 특정 -> 토큰에서 검증한 값으로 변경
    const userId = 1;
    //* ---------------------------
    const { id: bubbleId } = req.params;
    const { commentId } = req.body;
    if (!commentId) {
        return res.status(400).json({ message: "Insufficient parameters supplied" });
    }
    try {
        const bubbleInfo = await Bubble_1.Bubble.findOne(bubbleId);
        if (!bubbleInfo) {
            return res.status(400).json({ message: "Invalid request" });
        }
        const userInfo = (await User_1.User.findOne(userId)); //! Not necessary. 토큰에 권한 정보 존재
        const commentInfo = await BubbleComment_1.BubbleComment.findOne(commentId);
        if (!commentInfo) {
            return res.status(400).json({ message: "Invalid request" });
        }
        if (userInfo.accountType === "admin") {
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
        const comments = await BubbleComment_1.BubbleComment.createQueryBuilder("comment")
            .where("bubbleId = :id", { id: bubbleId })
            .leftJoinAndSelect("comment.user", "user")
            .select(["comment.id", "comment.textContent", "user.nickname"])
            .getMany();
        res.json({ data: { comments }, message: "Comment successfully deleted" });
    }
    catch (error) {
        console.error(error);
        res.json({ message: "Failed to delete comment" });
    }
};
exports.default = deleteBubbleComment;
//# sourceMappingURL=deleteBubbleComment.js.map