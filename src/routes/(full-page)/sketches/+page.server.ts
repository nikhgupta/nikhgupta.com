import { redirect } from '@sveltejs/kit';
import { AVAILABLE_SKETCHES } from '../../../sketches/base';

export async function load() {
	let name = AVAILABLE_SKETCHES[0];
	name = AVAILABLE_SKETCHES[Math.floor(Math.random() * AVAILABLE_SKETCHES.length)] || name;
	redirect(302, `/sketches/${name}`);
}
