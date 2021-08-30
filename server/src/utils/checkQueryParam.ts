import { QueryOrder } from "../@type/query";

//? 버블 조회 옵션 점검 함수

//* 검색할 버블의 처음 id 조정
export const checkStartQuery = (value: string | undefined): number => {
	let _value;
	if (value && !isNaN(Number(value))) _value = Number(value);
	else _value = 1;
	return _value;
};

//* 검색할 버블의 마지막 id 조정
export const checkEndQuery = (value: string | undefined): number => {
	let _value;
	if (value && !isNaN(Number(value))) _value = Number(value);
	else _value = Number.MAX_SAFE_INTEGER;
	return _value;
};

//* 검색할 버블의 개수 조정
export const checkLimitQuery = (value: string | undefined): number | undefined => {
	let _value;
	if (value && !isNaN(Number(value))) _value = Number(value);
	else _value = undefined;
	return _value;
};

//* 검색할 버블의 정렬 순서 조정
export const checkOrderQuery = (value: string | undefined): QueryOrder => {
	let _value;
	if (typeof value === "string") _value = value.toUpperCase();
	if (_value !== "ASC" && _value !== "DESC") return "ASC";
	else if (_value === "ASC") return "ASC";
	else return "DESC";
};
