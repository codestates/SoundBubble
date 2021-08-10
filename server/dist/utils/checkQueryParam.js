"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkQueryParam = (type, value) => {
    switch (type) {
        case "start":
            if (value && !isNaN(Number(value)))
                value = Number(value);
            else
                value = 1;
            return value;
        case "end":
            if (value && !isNaN(Number(value)))
                value = Number(value);
            else
                value = Number.MAX_SAFE_INTEGER;
            return value;
        case "limit":
            if (value && !isNaN(Number(value)))
                value = Number(value);
            else
                value = undefined;
            return value;
        case "order":
            if (typeof value === "string")
                value = value.toUpperCase();
            if (value !== "ASC" && value !== "DESC")
                value = "ASC";
            return value;
        default:
            return null;
    }
};
exports.default = checkQueryParam;
//# sourceMappingURL=checkQueryParam.js.map