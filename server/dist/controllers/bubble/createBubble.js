"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bubble_1 = require("../../entity/Bubble");
const createBubble = async (req, res) => {
    const { userId } = req.userInfo;
    const { textContent } = req.body;
    try {
        //* 파라미터 검사
        if (!textContent) {
            return res.status(400).json({ message: `Invalid textContent(FormData), input 'textContent': ${textContent}` });
        }
        const { image: imageInfo, sound: soundInfo } = req.files;
        if (!imageInfo) {
            return res.status(400).json({ message: `Invalid image(FormData), input 'image': ${imageInfo}` });
        }
        if (!soundInfo) {
            return res.status(400).json({ message: `Invalid sound(FormData), input 'sound': ${soundInfo}` });
        }
        //* 이미지 및 소리 경로 추출
        const imageSrc = imageInfo[0].location;
        const thumbnailSrc = imageSrc.replace("original", "thumb").replace("jpg", "jpeg");
        const soundSrc = soundInfo[0].location;
        //* DB 입력
        await Bubble_1.Bubble.insertBubble(userId, textContent, imageSrc, soundSrc, thumbnailSrc);
        res.status(201).json({ message: "Bubble successfully uploaded" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to upload bubble" });
    }
};
exports.default = createBubble;
//# sourceMappingURL=createBubble.js.map