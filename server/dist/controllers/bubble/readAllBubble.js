"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bubble_1 = require("../../entity/Bubble");
const checkQueryParam_1 = require("../../utils/checkQueryParam");
const log_1 = require("../../utils/log");
const readAllBubble = async (req, res, next) => {
    const { start, end, limit, order } = req.query;
    try {
        //* 파라미터 조정
        const _start = checkQueryParam_1.checkStartQuery(start);
        const _end = checkQueryParam_1.checkEndQuery(end);
        const _limit = checkQueryParam_1.checkLimitQuery(limit);
        const _order = checkQueryParam_1.checkOrderQuery(order);
        //* 모든 버블 조회
        const bubbles = await Bubble_1.Bubble.findAllBubbles(_start, _end, _limit, _order);
        res.status(200).json({ data: { bubbles }, message: "All bubbles successfully read" });
    }
    catch (err) {
        log_1.logError("Failed to read all bubbles");
        next(err);
    }
};
exports.default = readAllBubble;
