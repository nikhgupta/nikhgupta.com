import { writable, derived } from 'svelte/store';

import { Color } from './colors';
import { goto } from '$app/navigation';

const color = Color.default();
export const ls = writable<number>(color.l);
export const cs = writable<number>(color.c);
export const hs = writable<number>(color.h);

export const baseColor = derived([ls, cs, hs], ([$ls, $cs, $hs]) => new Color($ls, $cs, $hs));
export const showFallback = writable<boolean>(false);
export const showColor = writable<boolean>(false);
export const zoomedPalette = writable<string | null>(null);

export const setBaseColor = (color: Color) => {
	ls.set(color.l);
	cs.set(color.c);
	hs.set(color.h);
};

export const setBaseColorFromLCH = (l: number, c: number, h: number) => {
	ls.set(l);
	cs.set(c);
	hs.set(h);
};

export const visitColor = (color: Color | undefined) => {
	if (color) {
		goto(`/tools/palette-generator/${color.toHex().slice(1)}`);
	}
};

export const onHexInput = (e: Event) => {
	const input = e.target as HTMLInputElement;
	const color = Color.fromRgb(input.value, false);
	if (color) visitColor(color);
};
