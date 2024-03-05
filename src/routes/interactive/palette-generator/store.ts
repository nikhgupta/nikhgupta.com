import { writable } from 'svelte/store';
import { Color } from './colors';

export const baseColor = writable<Color>(Color.fromRgb('#fab'));
export const showColor = writable<boolean>(true);
export const zoomedPalette = writable<string | null>(null);
