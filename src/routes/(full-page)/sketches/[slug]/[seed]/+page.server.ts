export async function load({ params }: { params: { slug: string; seed: number } }) {
	return { slug: params.slug, seed: params.seed };
}
