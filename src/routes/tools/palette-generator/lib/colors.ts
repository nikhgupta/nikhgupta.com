import { useMode, modeOklch, modeRgb, formatHex, displayable } from 'culori/fn';

import { lchChromaMap } from '$lib/store';
let map: Record<number, number> = {};
lchChromaMap.subscribe((value) => (map = value));

function randomBinomial() {
	let u = 0,
		v = 0;
	while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
	while (v === 0) v = Math.random();
	let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
	num = num / 10.0 + 0.5; // Translate to 0 -> 1
	if (num > 1 || num < 0) return randomBinomial(); // resample between 0 and 1
	return num;
}

const BLACK = '#000';
const WHITE = '#fff';
const MIN_CHROMA = 0.01;
const MIN_LIGHT = 0.125;
const MAX_LIGHT = 0.98;
const MIN_LIGHT_VARY = 0.44;
const MAX_LIGHT_VARY = 0.94;
export const DEFAULT_COLOR = '#e9b082';
export const CONTRAST_THRESHOLD = 0.6;
const DEFAULT_SIZE = 11;
const DEFAULT_DISTANCE = 30;

const rgb = useMode(modeRgb);
const lch = useMode(modeOklch);

export class Color {
	data: any;
	l: number;
	c: number;
	h: number;
	a: number;
	maxChroma: number;
	contrastColor: string;
	originalChroma: number;

	constructor(l: number, c: number, h: number, a: number = 1, clamp: boolean = true) {
		this.l = l;
		this.h = h;
		this.a = a;

		this.maxChroma = this.maxChromaFor(l);
		this.c = this.maxChroma < c && clamp ? this.maxChroma : c;
		this.originalChroma = c;

		this.contrastColor = this.l > CONTRAST_THRESHOLD ? BLACK : WHITE;
		this.data = { mode: 'oklch', l, c: this.c, h, alpha: a };
	}

	originalColor() {
		if (this.originalChroma == this.c) return this;
		return new Color(this.l, this.originalChroma, this.h, this.a, false);
	}

	static default() {
		const color = Color.fromRgb(DEFAULT_COLOR);
		return color ? color : new Color(0.5, 0.5, 0.05);
	}

	static maxChromaValueForLightness(l: number) {
		const c = map[Math.round(l * 10000) / 10000];
		return c ? c : 0;
	}

	static fromRgb(color: string, clamp: boolean = true) {
		if (!displayable(color) || color.length < 6) return;
		const lchValue = { mode: 'oklch', h: 0, l: 0, c: MIN_CHROMA, alpha: 1, ...lch(rgb(color)) };
		return new Color(lchValue.l, lchValue.c, lchValue.h, lchValue.alpha, clamp);
	}

	static fromRandom() {
		const l = randomBinomial() / 4 + Math.random() / 2 + 0.25;
		let c = Color.maxChromaValueForLightness(l);
		c = (randomBinomial() * c) / 4 + (Math.random() * c) / 2 + c / 4;
		return new Color(l, c, Math.random() * 360);
	}

	valuesAt(...keys: string[]) {
		return keys.map((key) => this.data[key]);
	}

	toRgb() {
		return rgb(this.data);
	}

	toHex(data: any = {}) {
		const rgb = formatHex({ ...this.data, ...data });
		return rgb ? rgb : BLACK;
	}

	accentColor() {
		return this.transform({ l: this.l * (this.l > 0.5 ? 0.9 : 1.1) });
	}

	transform(data: any = {}) {
		const newData = { ...this.data, ...data };
		return new Color(newData.l, newData.c, newData.h, newData.alpha);
	}

	maxChromaFor(l: number = this.l) {
		return Color.maxChromaValueForLightness(l);
	}

	_transformHue(h: number) {
		return this.transform({ h: h % 360 });
	}

	_transformLightness(l: number, h: number | null = null) {
		return this.transform({ l, c: this.c, h: h ? h : this.h });
	}

	hueSwatch(num: number = DEFAULT_SIZE, distance: number = DEFAULT_DISTANCE) {
		const h0 = this.h;
		const colors: Color[] = [];
		for (let i = 0; i < num; i++) {
			colors.push(this._transformHue(h0 + i * distance));
		}
		return colors;
	}

	lightnessSwatch(
		num: number = DEFAULT_SIZE,
		minLight: number = MIN_LIGHT,
		maxLight: number = MAX_LIGHT,
		h: number = this.h,
		reversed: boolean = true
	) {
		const colors = [];
		if (num == 1) return [this._transformHue(h)];
		const d = (maxLight - minLight) / (num - 1);
		for (let i = 0; i < num; i++) {
			colors.push(this._transformLightness(reversed ? maxLight - i * d : minLight + i * d, h));
		}
		return colors;
	}

	_lightnessVary(num: number, h: number = this.h, reversed: boolean = true) {
		if (num == 1) return [this._transformHue(h)];

		const minLight = MIN_LIGHT_VARY - num / 100;
		const maxLight = MAX_LIGHT_VARY;

		let colors = [this._transformHue(h)];
		let n = minLight > this.l ? 0 : Math.floor((num - 1) / 2);
		let stepLower = (this.l - minLight) / n;
		let stepUpper = (maxLight - this.l) / (num - n - 1);

		// ensure that we always have colors that vary in lightness
		// and are not too close to each other.
		if (minLight > this.l) {
			n = 0;
			stepLower = 0;
			stepUpper = (maxLight - this.l) / (num - 1);
		} else if (maxLight < this.l) {
			n = num - 1;
			stepLower = (this.l - minLight) / n;
			stepUpper = 0;
		} else {
			let counter = 1;
			while (n > 0 && (stepLower < 0.05 || stepUpper < 0.05)) {
				n = stepLower < 0.05 ? n - 1 : n + 1;
				stepLower = (this.l - minLight) / n;
				stepUpper = (maxLight - this.l) / (num - n - 1);
				counter += 1;
				if (counter > 10) break;
			}
		}

		for (let i = 0; i < n; i++) {
			colors.unshift(this._transformLightness(this.l - (i + 1) * stepLower, h));
		}

		for (let i = 0; i < num - n - 1; i++) {
			colors.push(this._transformLightness(this.l + (i + 1) * stepUpper, h));
		}

		colors = reversed ? colors.reverse() : colors;
		return colors;
	}

	shades(num: number = DEFAULT_SIZE, minLight: number = MIN_LIGHT) {
		return this.lightnessSwatch(num, minLight, this.l, this.h);
	}

	tints(num: number = DEFAULT_SIZE, maxLight: number = MAX_LIGHT) {
		return this.lightnessSwatch(num, this.l, maxLight, this.h, false);
	}

	tones(num: number = DEFAULT_SIZE, minChroma: number = MIN_CHROMA) {
		const c0 = minChroma;
		const maxChroma = this.maxChroma;
		const d = (maxChroma - minChroma) / (num - 1);

		const colors = [];
		for (let i = 0; i < num; i++) {
			colors.push(this.transform({ c: c0 + (num - i - 1) * d }));
		}
		return colors;
	}

	complimentary(num: number = DEFAULT_SIZE) {
		const colors = [];
		const n = Math.floor(num / 2);

		colors.push(...this._lightnessVary(n));
		colors.push(...this._lightnessVary(num - n, this.h + 180, false));
		return colors;
	}

	splitComplimentary(num: number = DEFAULT_SIZE, distance: number = DEFAULT_DISTANCE) {
		const colors = [];
		const n = num % 3 == 2 ? Math.ceil(num / 3) : Math.floor(num / 3);

		colors.push(...this._lightnessVary(num - 2 * n, this.h + 180, true));
		colors.push(...this._lightnessVary(n, this.h - distance, false));
		colors.push(...this._lightnessVary(n, this.h + distance, true));
		return colors;
	}

	analogous(num: number = DEFAULT_SIZE, distance: number = DEFAULT_DISTANCE) {
		const colors = [];
		const n = num % 3 == 2 ? Math.ceil(num / 3) : Math.floor(num / 3);

		colors.push(...this._lightnessVary(num - 2 * n, this.h, true));
		colors.push(...this._lightnessVary(n, this.h - distance, false));
		colors.push(...this._lightnessVary(n, this.h + distance, true));
		return colors;
	}

	triadic(num: number = DEFAULT_SIZE, distance: number = DEFAULT_DISTANCE) {
		const colors = [];
		const n = num % 3 == 2 ? Math.ceil(num / 3) : Math.floor(num / 3);

		colors.push(...this._lightnessVary(num - 2 * n, this.h + 180, true));
		colors.push(...this._lightnessVary(n, this.h - 2 * distance, false));
		colors.push(...this._lightnessVary(n, this.h + 2 * distance, true));
		return colors;
	}

	triadicInclusive(num: number = DEFAULT_SIZE, distance: number = DEFAULT_DISTANCE) {
		const colors = [];
		const n = num % 3 == 2 ? Math.ceil(num / 3) : Math.floor(num / 3);

		colors.push(...this._lightnessVary(num - 2 * n, this.h, true));
		colors.push(...this._lightnessVary(n, this.h - 2 * distance, false));
		colors.push(...this._lightnessVary(n, this.h + 2 * distance, true));
		return colors;
	}

	tetradic(num: number = DEFAULT_SIZE, distance: number = DEFAULT_DISTANCE) {
		const colors = [];
		const n0 = Math.floor(num / 4);

		colors.push(...this._lightnessVary(n0, this.h - 2 * distance, true));
		colors.push(...this._lightnessVary(n0, this.h + 2 * distance, false));

		const n1 = Math.floor((num - 2 * n0) / 2);
		colors.push(...this._lightnessVary(n1, this.h + 180 - 2 * distance, true));
		colors.push(...this._lightnessVary(num - 2 * n0 - n1, this.h + 180 + 2 * distance, false));

		return colors;
	}

	tetradicInclusive(num: number = DEFAULT_SIZE, distance: number = DEFAULT_DISTANCE) {
		const colors = [];
		const n0 = Math.floor(num / 4);

		colors.push(...this._lightnessVary(n0, this.h - 2 * distance, true));
		colors.push(...this._lightnessVary(n0, this.h, false));

		const n1 = Math.floor((num - 2 * n0) / 2);
		colors.push(...this._lightnessVary(n1, this.h + 180 - 2 * distance, true));
		colors.push(...this._lightnessVary(num - 2 * n0 - n1, this.h + 180, false));

		return colors;
	}
}
