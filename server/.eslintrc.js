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
		"no-empty": "error", // 빈 블록문을 지양한다.
		"default-case": "error", // switch 문에 default가 포함되어야 한다.
		"default-case-last": "error", // switch 문에 default가 항상 마지막에 작성되어야 한다.
        eqeqeq: ["error", "always"], // '==' 밎 '!=' 사용을 지양한다.
        "@typescript-eslint/no-unused-vars": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/explicit-function-return-type": "off",
	},
};
