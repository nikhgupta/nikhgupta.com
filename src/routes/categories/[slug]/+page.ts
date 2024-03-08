import { posts } from '$lib';

export async function load({ params }) {
	return { slug: params.slug, posts: await posts.getPostsForCategory(params.slug) };
}
