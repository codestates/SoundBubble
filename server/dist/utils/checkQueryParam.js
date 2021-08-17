"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOrderQuery = exports.checkLimitQuery = exports.checkEndQuery = exports.checkStartQuery = void 0;
const checkStartQuery = (value) => {
    let _value;
    if (value && !isNaN(Number(value)))
        _value = Number(value);
    else
        _value = 1;
    return _value;
};
exports.checkStartQuery = checkStartQuery;
const checkEndQuery = (value) => {
    let _value;
    if (value && !isNaN(Number(value)))
        _value = Number(value);
    else
        _value = Number.MAX_SAFE_INTEGER;
    return _value;
};
exports.checkEndQuery = checkEndQuery;
const checkLimitQuery = (value) => {
    let _value;
    if (value && !isNaN(Number(value)))
        _value = Number(value);
    else
        _value = undefined;
    return _value;
};
exports.checkLimitQuery = checkLimitQuery;
const checkOrderQuery = (value) => {
    let _value;
    if (typeof value === "string")
        _value = value.toUpperCase();
    if (_value !== "ASC" && _value !== "DESC")
        return "ASC";
    else if (_value === "ASC")
        return "ASC";
    else
        return "DESC";
};
exports.checkOrderQuery = checkOrderQuery;
//# sourceMappingURL=checkQueryParam.js.map