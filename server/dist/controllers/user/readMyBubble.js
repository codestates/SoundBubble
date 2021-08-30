"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bubble_1 = require("../../entity/Bubble");
const User_1 = require("../../entity/User");
const log_1 = require("../../utils/log");
const readMyBubble = async (req, res, next) => {
    const { userId } = req.userInfo;
    try {
        const userInfo = await User_1.User.findOne(userId);
        if (!userInfo) {
            return res.status(404).json({ message: "User not found" });
        }
        const bubbles = await Bubble_1.Bubble.findBubblesByUserId(userId);
        return res.status(200).json({ data: { bubbles }, message: "All my bubbles successfully read" });
    }
    catch (err) {
        log_1.logError("Failed to read all bubbles");
        next(err);
    }
};
exports.default = readMyBubble;
