import { json } from '@sveltejs/kit';
import type { types } from '$lib';

function safeCompareDates(a: types.Post, b: types.Post) {
	const firstDate = a.date ? new Date(a.date) : new Date(0);
	const secondDate = b.date ? new Date(b.date) : new Date(0);
	return secondDate.getTime() - firstDate.getTime();
}

async function getPosts() {
	let posts: types.Post[] = [];

	let paths = import.meta.glob('/src/{posts/**/*.{svx,md},routes/posts/*/+page.svx}', {
		eager: true
	});

	for (const path in paths) {
		if (path.endsWith('/[slug]/+page.svx')) continue;

		const file = paths[path];
		let slug = path.split('/').at(-1)?.replace('.svx', '');
		if (path.endsWith('/+page.svx')) slug = path.split('/').at(-2);

		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Omit<types.Post, 'slug'>;
			const post = { ...metadata, slug } satisfies types.Post;
			post.published && posts.push(post);
		}
	}

	return posts.sort(safeCompareDates);
}

export async function GET() {
	const posts = await getPosts();
	return json(posts);
}
