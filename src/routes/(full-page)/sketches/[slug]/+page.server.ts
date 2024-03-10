import { error } from '@sveltejs/kit';

export async function load({ params }: { params: { slug: string } }) {
	return { slug: params.slug };
}
