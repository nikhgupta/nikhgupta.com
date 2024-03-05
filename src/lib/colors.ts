import { browser } from '$app/environment';
import { useMode, modeOklch, modeRgb, formatHex, displayable } from 'culori/fn';

import mappings from './oklch-color-mapping.json';
const map: Record<number, number> = mappings;

const rgb = useMode(modeRgb);
const lch = useMode(modeOklch);

export const toggleDarkMode = (mode: number = -1) => {
	if (browser) {
		const html = document.getElementsByTagName('html')[0];
		if (mode == -1) mode = html.classList.contains('dark') ? 0 : 1;
		const body = document.getElementsByTagName('body')[0];
		if (mode === 1) {
			html.classList.add('dark');
			body.style.backgroundColor = 'black';
		} else {
			html.classList.remove('dark');
			body.style.backgroundColor = 'white';
		}
	}
};

export const DEFAULT_COLOR = { l: 0.8252, c: 0.10179611632754734, h: 6.452301295903021, a: 1 };

export class Color {
	data: any;
	l: number;
	c: number;
	h: number;
	a: number;
	contrastColor: string;

	constructor(l: number, c: number, h: number, a: number = 1) {
		this.l = l;
		this.c = c;
		this.h = h;
		this.a = a;
		this.data = { mode: 'oklch', l, c, h, alpha: a };
		this.contrastColor = this.l > 0.5 ? '#000' : '#fff';
	}

	static fromRgb(color: string) {
		const lchValue = { mode: 'oklch', h: 0, l: 0, c: 0.01, alpha: 1, ...lch(rgb(color)) };
		return new Color(lchValue.l, lchValue.c, lchValue.h, lchValue.alpha);
	}

	static fromRandom() {
		const choices = Object.entries(map);

		let randomArray: any[] = [];
		choices.forEach((item, index) => {
			const l = parseFloat(item[0]);
			var clone = Array(Math.round(Math.min(l, 1 - l) * 100)).fill(item);
			randomArray.push(...clone);
		});

		const [l, c] = randomArray[~~(Math.random() * randomArray.length)];
		return new Color(parseFloat(l), c, Math.random() * 360);
	}

	valuesAt(...keys: string[]) {
		return keys.map((key) => this.data[key]);
	}

	toRgb() {
		return rgb(this.data);
	}

	toHex(data: any = {}) {
		const rgb = formatHex({ ...this.data, ...data });
		return rgb ? rgb : '#000';
	}

	changeBackground() {
		toggleDarkMode(this.l > 0.5 ? 0 : 1);
	}

	maxChroma() {
		const c = map[Math.round(this.l * 10000) / 10000];
		return c ? c : 0;
	}

	swatch(distance: number = 30, num: number = 11) {
		const h0 = this.h;
		const colors = [];
		for (let i = 0; i < num; i++) {
			const h = (h0 + i * distance) % 360;
			const color = this.toHex({ h });
			colors.push(color);
		}
		return colors;
	}

	shades(num: number = 11, minLight: number = 0.125, maxLight: number = 0.98) {
		const l0 = minLight;
		const d = (maxLight - minLight) / (num - 1);
		const maxChroma = this.c;

		const colors = [];
		for (let i = 0; i < num; i++) {
			const l = Math.round((l0 + i * d) * 10000) / 10000;
			let chroma = map[l] < maxChroma ? map[l] : maxChroma;
			const color = this.toHex({ l, c: chroma });
			colors.push(color);
		}
		return colors;
	}

	complimentary() {
		const colors = [];
		colors.push(this.toHex({ l: this.l * 0.9 }));
		colors.push(this.toHex());
		colors.push(this.toHex({ l: this.l * 1.1 }));
		colors.push(this.toHex({ h: (this.h + 180) % 360, l: this.l * 0.7 }));
		colors.push(this.toHex({ h: (this.h + 180) % 360, l: this.l * 0.8 }));
		colors.push(this.toHex({ h: (this.h + 180) % 360, l: this.l * 0.9 }));
		colors.push(this.toHex({ h: (this.h + 180) % 360 }));
		colors.push(this.toHex({ h: (this.h + 180) % 360, l: this.l * 1.1 }));
		colors.push(this.toHex({ h: (this.h + 180) % 360, l: this.l * 1.2 }));
		colors.push(this.toHex({ h: (this.h + 180) % 360, l: this.l * 1.3 }));

		return colors;
	}

	analogous(distance: number = 30) {
		const h0 = this.h;
		const h1 = h0 % 360;
		const h2 = (h0 + distance) % 360;
		const h3 = (h0 - distance) % 360;
		return [h2, h3, h1].map((h) => this.toHex({ h }));
	}

	splitComplimentary(distance: number = 30) {
		const h0 = this.h;
		const h1 = (h0 + 180) % 360;
		const h2 = (h0 + distance) % 360;
		const h3 = (h0 - distance) % 360;
		return [h2, h3, h1].map((h) => this.toHex({ h }));
	}

	tetradic(distance: number = 30) {
		const h0 = this.h;
		const h1 = (h0 + 2 * distance) % 360;
		const h2 = (h0 - 2 * distance) % 360;
		const h3 = (h0 + 180 + 2 * distance) % 360;
		const h4 = (h0 + 180 - 2 * distance) % 360;
		return [h1, h2, h3, h4].map((h) => this.toHex({ h }));
	}

	triadic(distance: number = 30) {
		const h0 = this.h;
		const h1 = (h0 + 2 * distance) % 360;
		const h2 = (h0 - 2 * distance) % 360;
		const h3 = (h0 + 180) % 360;
		return [h1, h2, h3].map((h) => this.toHex({ h }));
	}
}
