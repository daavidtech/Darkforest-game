// Flat ESLint config (CommonJS) for ESLint v9+
const js = require("@eslint/js")
const tsParser = require("@typescript-eslint/parser")
const tsPlugin = require("@typescript-eslint/eslint-plugin")
const eslintConfigPrettier = require("eslint-config-prettier")
const globals = require("globals")

module.exports = [
	// Ignore patterns
	{
		ignores: [
			"node_modules/**",
			"dist/**",
			"server/assets/**",
			"ios/**",
			"**/*.d.ts",
			"bun.lockb",
		],
	},

	// Base JS recommended rules
	js.configs.recommended,

	// Set browser + node globals so ESLint knows about window/document/etc.
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				...globals.bun,
			},
		},
	},

	// TypeScript setup + recommended rules
	{
		files: ["**/*.ts", "**/*.tsx"],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				sourceType: "module",
				ecmaVersion: "latest",
			},
		},
		plugins: {
			"@typescript-eslint": tsPlugin,
		},
		rules: {
			...tsPlugin.configs.recommended.rules,
			"no-console": "off",
			// Typescript handles undefined vars/types; avoid false positives on types like ResponseInit
			"no-undef": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-unused-vars": "off",
			"@typescript-eslint/ban-ts-comment": "off",
			"no-empty": ["error", { allowEmptyCatch: true }],
		},
	},

	// Disable rules conflicting with Prettier formatting
	eslintConfigPrettier,
]
