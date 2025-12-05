// @ts-check
import { defineConfig } from "astro/config";
import alpinejs from "@astrojs/alpinejs";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
	output: "server",
	server: {
		host: true,
		open: true,
	},
	integrations: [alpinejs()],
	vite: {
		plugins: [tailwindcss()],
	},
});
