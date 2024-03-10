import { posts } from '$lib';

export async function load({}) {
	return { posts: await posts.getPosts() };
}
