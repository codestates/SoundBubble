"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bubble_1 = require("../../entity/Bubble");
const log_1 = require("../../utils/log");
const createBubble = async (req, res, next) => {
    const { userId } = req.userInfo;
    let textContent = req.body.textContent;
    try {
        //* 파라미터 검사
        const { image: imageInfo, sound: soundInfo } = req.files;
        if (!imageInfo) {
            return res.status(400).json({ message: `Invalid image(FormData), input 'image': ${imageInfo}` });
        }
        if (!soundInfo) {
            return res.status(400).json({ message: `Invalid sound(FormData), input 'sound': ${soundInfo}` });
        }
        if (!textContent) {
            textContent = "";
        }
        //* 이미지 및 소리 S3 경로 추출
        const imageSrc = imageInfo[0].location;
        const thumbnailSrc = imageSrc.replace("original", "thumb").replace("jpg", "jpeg");
        const soundSrc = soundInfo[0].location;
        //* DB 입력
        const bubbleInfo = await Bubble_1.Bubble.insertBubble(userId, textContent, imageSrc, soundSrc, thumbnailSrc);
        res.setHeader("Content-Location", `/bubble/${bubbleInfo.id}`);
        res.status(201).json({ message: "Bubble successfully uploaded" });
    }
    catch (err) {
        log_1.logError("Failed to upload bubble");
        next(err);
    }
};
exports.default = createBubble;
