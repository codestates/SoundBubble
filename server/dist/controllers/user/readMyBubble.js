"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bubble_1 = require("../../entity/Bubble");
const User_1 = require("../../entity/User");
const readMyBubble = async (req, res) => {
    const { userId } = req.userInfo;
    try {
        const userInfo = await User_1.User.findOne(userId);
        if (!userInfo) {
            return res.status(404).json({ message: "User not found" });
        }
        const bubbles = await Bubble_1.Bubble.findBubblesByUserId(userId);
        return res.status(200).json({ data: { bubbles }, message: "All my bubbles successfully read" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to read all bubbles" });
    }
};
exports.default = readMyBubble;
//# sourceMappingURL=readMyBubble.js.map