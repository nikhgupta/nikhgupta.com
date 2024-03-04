// mapper.ts

// @ts-ignore
import { readJsonSync, writeJsonSync } from 'https://deno.land/std@0.52.0/fs/mod.ts';

// @ts-ignore
import { useMode, modeOklch, modeRgb, formatHex, displayable } from 'npm:culori/fn';

const rgb = useMode(modeRgb);
const oklch = useMode(modeOklch);

const oklchToRgb = function (l: number, c: number, h: number) {
	const color = rgb(oklch({ l: l, c: c, h: h }));
	if (displayable(color)) return formatHex(color);
};

const hr = Array.from({ length: 360 }, (_, i) => i);
const cr = Array.from({ length: 4000 }, (_, i) => i / 10000);
const lr = Array.from({ length: 10000 }, (_, i) => 1 - i / 10000);

const invalidHue = function (l: number, c: number) {
	for (let h of hr) {
		const color = oklchToRgb(l, c, h);
		if (!color) return [l, c, h];
	}
	return [];
};

// we should be able to speed this up using bisection,
// but that would not give optimal results.
// Moreover, the calculation will be cached, anyway.
const maxChroma = function (l: number) {
	let prev = 0;
	for (let c of cr) {
		const invalid = invalidHue(l, c);
		if (invalid.length > 0) {
			return [prev, invalid];
		}
		prev = c;
	}
};

const cachedLCMap = function (path: string) {
	const mappedLC = function () {
		const map = {};
		for (let l of lr) {
			const res = maxChroma(l);
			// @ts-ignore
			const ls = Math.round(parseFloat(l) * 10000) / 10000;
			// @ts-ignore
			map[ls] = res.length > 0 ? res[0] : 0;
		}
		return map;
	};

	let map = readJsonSync(path, 'utf8');
	if (map && Object.entries(map).length > 0) return map;

	console.log('caculating boundaries..');
	map = mappedLC();
	writeJsonSync(path, map, 'utf8');
	return map;
};

const map: { [key: number]: number } = cachedLCMap('../src/routes/colors/mapping.json');
