"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../entity/User");
const Bubble_1 = require("../../entity/Bubble");
const s3_1 = require("../../aws/s3");
const deleteBubble = async (req, res) => {
    //* 임시로 userId를 이용하여 유저 특정 -> 토큰에서 검증한 값으로 변경
    const userId = 1;
    //* ---------------------------
    const { id: bubbleId } = req.params;
    if (!bubbleId) {
        return res.status(400).json({ message: "Insufficient parameters supplied" });
    }
    try {
        const userInfo = (await User_1.User.findOne(userId)); //! Not necessary. 토큰에 권한 정보 존재
        const bubbleInfo = await Bubble_1.Bubble.findOne(bubbleId);
        if (!bubbleInfo) {
            return res.status(400).json({ message: "Invalid request" });
        }
        const soundSrc = bubbleInfo.sound.split("/").pop();
        const imageSrc = bubbleInfo.image.split("/").pop();
        console.log(userInfo, bubbleInfo);
        if (userInfo.accountType === "admin") {
            await bubbleInfo.remove();
        }
        else {
            if (bubbleInfo.userId === userId) {
                await bubbleInfo.remove();
            }
            else {
                console.log('본인 아님');
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