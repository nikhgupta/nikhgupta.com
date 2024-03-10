import { error } from '@sveltejs/kit';
import type { types } from '$lib';

export function loadSingularContentFrom(name: string) {
	return async function load({ params }: { params: { slug: string } }) {
		let data: types.PageData;
		try {
			const post = await import(`../../../src/${name}/${params.slug}.svx`);
			data = { content: post.default, metadata: post.metadata, snippets: {} };
			return data;
		} catch (e) {
			try {
				const post = await import(`../../../src/${name}/${params.slug}/+page.svx`);
				return { content: post.default, metadata: post.metadata, snippets: {} };
			} catch (e) {
				console.log(name, e);
				error(404, `Could not find ${params.slug}`);
			}
		}
	};
}
