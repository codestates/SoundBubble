/* eslint-disable @typescript-eslint/no-explicit-any */

//? 커스텀 로그

export const log = (...values: any[]): void => {
	console.log("[LOG]", ...values);
};

export const logError = (...values: any[]): void => {
	console.log("[ERROR]", ...values);
};
