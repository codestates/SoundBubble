"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bubble_1 = require("../../entity/Bubble");
const s3_1 = require("../../aws/s3");
const deleteBubble = async (req, res) => {
    const { userId, accountType } = req.userInfo;
    const { id: bubbleId } = req.params;
    if (!bubbleId) {
        return res.status(400).json({ message: "Insufficient parameters supplied" });
    }
    try {
        const bubbleInfo = await Bubble_1.Bubble.findOne(bubbleId);
        if (!bubbleInfo) {
            return res.status(400).json({ message: "Invalid request" });
        }
        const soundSrc = bubbleInfo.sound.split("/").pop();
        const imageSrc = bubbleInfo.image.split("/").pop();
        if (accountType === "admin") {
            await bubbleInfo.remove();
        }
        else {
            if (bubbleInfo.userId === userId) {
                await bubbleInfo.remove();
            }
            else {
                return res.status(400).json({ message: "Invalid request" });
            }
        }
        await s3_1.deleteResource("soundbubble-resource/resource", soundSrc);
        await s3_1.deleteResource("soundbubble-resource/resource", imageSrc);
        res.status(201).json({ message: "Bubble successfully deleted" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to delete bubble" });
    }
};
exports.default = deleteBubble;
//# sourceMappingURL=deleteBubble.js.map