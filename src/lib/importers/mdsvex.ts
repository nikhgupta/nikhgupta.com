import { error } from '@sveltejs/kit';

export function loadTaxonomy(name: string) {
	return async function load({ params }: { params: { slug: string } }) {
		try {
			const post = await import(`../../../src/${name}/${params.slug}.svx`);
			return { content: post.default, metadata: post.metadata };
		} catch (e) {
			console.log(name, e);
			error(404, `Could not find ${params.slug}`);
		}
	};
}
