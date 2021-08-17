import { QueryOrder } from "../@type/query";

export const checkStartQuery = (value: string | undefined): number => {
	let _value;
	if (value && !isNaN(Number(value))) _value = Number(value);
	else _value = 1;
	return _value;
};

export const checkEndQuery = (value: string | undefined): number => {
	let _value;
	if (value && !isNaN(Number(value))) _value = Number(value);
	else _value = Number.MAX_SAFE_INTEGER;
	return _value;
};

export const checkLimitQuery = (value: string | undefined): number | undefined => {
	let _value;
	if (value && !isNaN(Number(value))) _value = Number(value);
	else _value = undefined;
	return _value;
};

export const checkOrderQuery = (value: string | undefined): QueryOrder => {
	let _value;
	if (typeof value === "string") _value = value.toUpperCase();
	if (_value !== "ASC" && _value !== "DESC") return "ASC";
	else if (_value === "ASC") return "ASC";
	else return "DESC";
};
