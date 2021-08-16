"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bubble_1 = require("../../entity/Bubble");
const s3_1 = require("../../aws/s3");
const deleteBubble = async (req, res) => {
    const { userId, accountType } = req.userInfo;
    const bubbleId = req.params.id;
    try {
        //* 버블 조회. 존재하는 버블인지 확인
        const bubbleInfo = await Bubble_1.Bubble.findOne(bubbleId);
        if (!bubbleInfo) {
            return res.status(404).json({ message: "Bubble not found" });
        }
        const soundSrc = bubbleInfo.sound.split("/").pop();
        const imageSrc = bubbleInfo.image.split("/").pop();
        const thumbnailSrc = bubbleInfo.thumbnail.split("/").pop();
        //* 버블 삭제
        // 관리자 권한 -> 모든 버블 삭제 가능
        if (accountType === "admin") {
            await bubbleInfo.remove();
        }
        // 일반 유저 -> 본인이 작성한 버블만 삭제 가능
        else {
            if (bubbleInfo.userId !== userId) {
                return res.status(403).json({ message: "Not authorized" });
            }
            else {
                await bubbleInfo.remove();
            }
        }
        //* S3에 저장된 리소스 삭제
        await s3_1.deleteResource("soundbubble-resource/sound", soundSrc);
        await s3_1.deleteResource("soundbubble-resource/original", imageSrc);
        await s3_1.deleteResource("soundbubble-resource/thumb", thumbnailSrc);
        res.status(200).json({ message: "Bubble successfully deleted" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to delete bubble" });
    }
};
exports.default = deleteBubble;
//# sourceMappingURL=deleteBubble.js.map