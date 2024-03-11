import { redirect } from '@sveltejs/kit';
import { AVAILABLE_SKETCHES } from '../../../sketches/base';
import { randomSeedFrom } from '$lib/random';

export async function load() {
	let name = AVAILABLE_SKETCHES[0];
	name = AVAILABLE_SKETCHES[Math.floor(Math.random() * AVAILABLE_SKETCHES.length)] || name;
	redirect(302, `/sketches/${name}/${randomSeedFrom()}`);
}
