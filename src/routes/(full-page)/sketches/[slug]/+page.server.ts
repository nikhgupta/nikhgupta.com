import { redirect } from '@sveltejs/kit';
import { randomSeedFrom } from '$lib/random';

export async function load({ params }: { params: { slug: string } }) {
	redirect(302, `/sketches/${params.slug}/${randomSeedFrom()}`);
}
