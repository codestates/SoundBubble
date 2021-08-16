// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const log = (...values: any[]): void => {
	console.log("[LOG]", ...values);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const logError = (...values: any[]): void => {
	console.log("[ERROR]", ...values);
};
