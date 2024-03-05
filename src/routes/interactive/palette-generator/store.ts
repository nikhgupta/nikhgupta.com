import { writable } from 'svelte/store';

export const showColor = writable<boolean>(false);
export const zoomedPalette = writable<string | null>(null);
