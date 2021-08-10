"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bubble_1 = require("../../entity/Bubble");
const createBubble = async (req, res) => {
    const { userId } = req.userInfo;
    const { textContent } = req.body;
    try {
        if (!textContent) {
            return res.status(422).json({ message: "Insufficient parameters supplied" });
        }
        const { image: imageInfo, sound: soundInfo } = req.files;
        if (!imageInfo || !soundInfo) {
            return res.status(400).json({ message: "Image or Sound does not exist" });
        }
        const imageSrc = imageInfo[0].location;
        const soundSrc = soundInfo[0].location;
        const newBubble = new Bubble_1.Bubble();
        newBubble.image = imageSrc;
        newBubble.sound = soundSrc;
        newBubble.textContent = textContent;
        newBubble.userId = userId;
        newBubble.save();
        res.status(201).json({ message: "create succeed" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to upload bubble" });
    }
};
exports.default = createBubble;
//# sourceMappingURL=createBubble.js.map