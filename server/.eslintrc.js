module.exports = {
	env: {
		node: true,
		es2021: true,
	},
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: 12,
		sourceType: "module",
	},
	plugins: ["@typescript-eslint"],
	rules: {
		"no-empty": "error", // 빈 블록문을 지양
		"default-case": "error", // switch 문 default가 포함
		"default-case-last": "error", // switch 문 default 항상 마지막에 작성
		eqeqeq: ["error", "always"], // '==' 밎 '!=' 사용을 지양
	},
	ignorePatterns: ["dist", "lambda"],
};
