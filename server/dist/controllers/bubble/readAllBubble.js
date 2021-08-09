"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Bubble_1 = require("../../entity/Bubble");
const checkQueryParams_1 = __importDefault(require("../../utils/checkQueryParams"));
const readAllBubble = async (req, res) => {
    let { start, end, limit, order } = req.query;
    try {
        const _start = checkQueryParams_1.default("start", start);
        const _end = checkQueryParams_1.default("end", end);
        const _limit = checkQueryParams_1.default("limit", limit);
        const _order = checkQueryParams_1.default("order", order);
        const bubbles = await Bubble_1.Bubble.createQueryBuilder("bubble")
            .where("bubble.id >= :sId AND bubble.id <= :eId", { sId: _start, eId: _end })
            .limit(_limit)
            .leftJoinAndSelect("bubble.user", "user")
            .select(["bubble", "user.nickname"])
            .orderBy("bubble.id", _order)
            .getMany();
        res.json({ data: { bubbles }, message: "All bubbles successfully read" });
    }
    catch (error) {
        console.error(error);
        res.json({ message: "Failed to read all bubbles" });
    }
};
exports.default = readAllBubble;
//# sourceMappingURL=readAllBubble.js.map