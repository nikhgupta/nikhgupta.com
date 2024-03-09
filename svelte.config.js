import adapter from '@sveltejs/adapter-vercel';

import { mdsvex, escapeSvelte } from 'mdsvex';
import { getHighlighter } from 'shiki';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.svx', '.md'],
	highlight: {
		highlighter: async (code, lang = 'text') => {
			const highlighter = await getHighlighter({
				themes: ['night-owl', 'nord'],
				langs: ['javascript', 'typescript', 'svelte']
			});
			await highlighter.loadLanguage('javascript', 'typescript', 'svelte');
			const html = escapeSvelte(
				highlighter.codeToHtml(code, {
					lang,
					themes: { light: 'nord', dark: 'night-owl' }
				})
			);
			return `{@html \`${html}\` }`;
		}
	}
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter()
	},
	extensions: ['.svelte', '.svx', '.md'],
	preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)]
};

export default config;
