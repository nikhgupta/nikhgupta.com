import { writable } from 'svelte/store';

import lchChromaMapLocal from '$lib/data/oklch-color-mapping.json';
export const lchChromaMap = writable(lchChromaMapLocal);
