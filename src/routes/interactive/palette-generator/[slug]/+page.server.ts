export async function load({ params }: { params: { slug: string } }) {
	return { rgbValue: `#${params.slug}` };
}
