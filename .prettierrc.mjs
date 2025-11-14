export default {
	// オプションはPrettierのデフォルト値に従う
	// https://prettier.io/docs/en/options.html
	printWidth: 80,

	plugins: ["prettier-plugin-astro"],
	overrides: [
		{
			files: "*.astro",
			options: {
				parser: "astro",
			},
		},
	],
};
