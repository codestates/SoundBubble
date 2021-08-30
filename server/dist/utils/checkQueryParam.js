"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOrderQuery = exports.checkLimitQuery = exports.checkEndQuery = exports.checkStartQuery = void 0;
//? 버블 조회 옵션 점검 함수
//* 검색할 버블의 처음 id 조정
const checkStartQuery = (value) => {
    let _value;
    if (value && !isNaN(Number(value)))
        _value = Number(value);
    else
        _value = 1;
    return _value;
};
exports.checkStartQuery = checkStartQuery;
//* 검색할 버블의 마지막 id 조정
const checkEndQuery = (value) => {
    let _value;
    if (value && !isNaN(Number(value)))
        _value = Number(value);
    else
        _value = Number.MAX_SAFE_INTEGER;
    return _value;
};
exports.checkEndQuery = checkEndQuery;
//* 검색할 버블의 개수 조정
const checkLimitQuery = (value) => {
    let _value;
    if (value && !isNaN(Number(value)))
        _value = Number(value);
    else
        _value = undefined;
    return _value;
};
exports.checkLimitQuery = checkLimitQuery;
//* 검색할 버블의 정렬 순서 조정
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
