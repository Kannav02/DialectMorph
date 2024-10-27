import globals from "globals";
import tseslint from "@typescript-eslint/eslint-plugin";
import tseslintParser from "@typescript-eslint/parser";

export default [
	{
		files: ["**/*.{js,mjs,cjs,ts}"],
		languageOptions: {
			globals: {
				...globals.browser,
			},
			parser: tseslintParser,
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module",
			},
		},
		plugins: {
			"@typescript-eslint": tseslint,
		},
		rules: {
			...tseslint.configs.recommended.rules,
		},
	},
	{
		files: ["dist/**/*.js"],
		rules: {
			"@typescript-eslint/no-unused-expressions": "off",
			"@typescript-eslint/no-require-imports": "off",
		},
	},
	{
		files: ["examples/**/*.js"],
		rules: {
			"@typescript-eslint/no-unused-expressions": "off",
			"@typescript-eslint/no-require-imports": "off",
			"@typescript-eslint/no-unused-vars": "off",
		},
	},
	{
		files: ["src/index.ts"],
		rules: {
			"@typescript-eslint/no-explicit-any": "off",
		},
	},
];
