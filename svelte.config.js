import adapter from '@sveltejs/adapter-vercel';

import { mdsvex } from 'mdsvex';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.svx']
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter()
	},
	extensions: ['.svelte', '.svx'],
	preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)]
};

export default config;
