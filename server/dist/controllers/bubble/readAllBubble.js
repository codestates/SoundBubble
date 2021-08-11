"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Bubble_1 = require("../../entity/Bubble");
const checkQueryParam_1 = __importDefault(require("../../utils/checkQueryParam"));
const readAllBubble = async (req, res) => {
    let { start, end, limit, order } = req.query;
    try {
        const _start = checkQueryParam_1.default("start", start);
        const _end = checkQueryParam_1.default("end", end);
        const _limit = checkQueryParam_1.default("limit", limit);
        const _order = checkQueryParam_1.default("order", order);
        const bubbles = await Bubble_1.Bubble.findAllBubbles(_start, _end, _limit, _order);
        res.json({ data: { bubbles }, message: "All bubbles successfully read" });
    }
    catch (error) {
        console.error(error);
        res.json({ message: "Failed to read all bubbles" });
    }
};
exports.default = readAllBubble;
//# sourceMappingURL=readAllBubble.js.map