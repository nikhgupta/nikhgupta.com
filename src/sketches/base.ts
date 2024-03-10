import P5 from 'p5-svelte';
import type { p5, Sketch } from 'p5-svelte';
import { browser } from '$app/environment';

import { lchChromaMap } from '$lib/store';
import { Color } from '../routes/tools/palette-generator/lib/colors';

export const P5Element = P5;

const hashFunction = (s: string) => {
	var hash = 0;

	let i: number;
	for (i = 0; i < s.length; i++) {
		hash = (hash << 5) - hash + s.charCodeAt(i);
		hash = hash & hash; // prevent overflow from happening
	}
	return hash & 0xffff; // returns lower 16-bit of hash value
};

export interface P5SketchArguments {
	colors?: string[];
	aside?: string;
	darkMode?: boolean;
	size?: [number, number] | null;
	frameRate?: number;
	seed?: string;
	hue?: number | null;
}

export class P5Sketch {
	dim: [number, number];
	aside: string;
	darkMode: boolean;
	frameRate: number;
	seed: number;
	startingHue: number;
	chromaMap: Record<number, number>;
	colors: string[];
	startingColor: Color;
	sizes: number[];

	constructor({
		colors = ['#f3f8ff', '#121f32'],
		aside = 'main-wrapper',
		darkMode = false,
		size = null,
		frameRate = 0,
		seed = '',
		hue = null
	}: P5SketchArguments) {
		this.dim = size ? size : [0, 0];

		this.aside = aside;
		this.darkMode = darkMode;
		this.colors = colors;
		this.frameRate = frameRate;
		this.seed = this.setSeed(seed);
		this.sizes = [1 / 64, 1 / 32, 1 / 16, 1 / 8, 1 / 4, 1 / 2, 1, 2, 4, 8, 16, 32, 64];

		this.chromaMap = [];
		lchChromaMap.subscribe((value) => (this.chromaMap = value));

		this.startingHue = hue != null ? hue : this.randomStartingHueAsPerBackground();
		this.startingColor = this.pickStartingColor({ from: this.bgColor() });
	}

	static run(params: P5SketchArguments) {
		const self = new this(params);
		const sketch: Sketch = (p5: p5) => {
			p5.setup = () => self.setup(p5);
			p5.draw = () => self.draw(p5);
		};

		return sketch;
	}

	setup(p5: p5) {
		p5.randomSeed(this.seed);

		this.setDimensions();
		this.beforeSetup(p5);

		if (this.frameRate > 0) p5.frameRate(this.frameRate);
		p5.createCanvas(this.dim[0], this.dim[1]);
		this.onSetup(p5);
	}

	draw(p5: p5) {
		if (this.frameRate == 0) p5.noLoop();

		this.onDraw(p5);
	}

	beforeSetup(p5: p5) {}

	onSetup(p5: p5) {
		p5.background(this.bgColor());
	}

	onDraw(p5: p5) {
		p5.translate(p5.width / 2, p5.height / 2);

		let v = p5.createVector(p5.random(-100, 100), p5.random(-100, 100));
		v.mult(p5.random(50, 100));

		p5.strokeWeight(1);
		p5.line(0, 0, v.x, v.y);
	}

	setSeed(seed: string) {
		this.seed = seed.length > 0 ? hashFunction(seed) : Math.round(Math.random() * 1000000);
		return this.seed;
	}

	bgColor() {
		return this.darkMode ? this.colors[1] : this.colors[0];
	}

	fgColor() {
		return this.darkMode ? this.colors[0] : this.colors[1];
	}

	sineWave(p5: p5, { steps = 4 }: { steps: number }) {
		return (1 + Math.sin(p5.frameCount / steps)) / 2;
	}

	randomStartingHueAsPerBackground() {
		if (this.darkMode) return Math.random() * 60 + 220;

		let r = Math.random() * 360;
		while ((r > 90 && r < 150) || r > 300) r = Math.random() * 360;
		return r;
	}

	setDimensions() {
		if (!browser) return;

		const html = document.documentElement;
		const el = document.getElementById(this.aside);
		if (el) {
			const br = el.getBoundingClientRect();
			if (this.dim[0] == 0) {
				this.dim[0] = html.scrollWidth - br.width - 2 * br.x;
			} else if (this.dim[0] <= 1) {
				this.dim[0] = br.width * this.dim[0];
			}

			if (this.dim[1] == 0) {
				this.dim[1] = html.scrollHeight;
			} else if (this.dim[1] <= 1) {
				this.dim[1] = br.height * this.dim[1];
			}
		}

		if (this.dim[0] == 0 || this.dim[1] == 0) {
			[this.dim[0], this.dim[1]] = [html.scrollWidth, html.scrollHeight];
		}
	}

	pickStartingColor({ from = null }: { from?: string | Color | null } = {}) {
		let color: Color = Color.fromRandom();

		if (from && typeof from === 'string') {
			color = Color.fromRgb(from) || color;
		} else if (from && from instanceof Color) {
			color = from;
		}

		return color.transform({ h: this.startingHue });
	}

	currentColor(p5: p5) {
		return this.startingColor.transform({ h: this.startingColor.h + p5.frameCount });
	}

	lightnessPalette(
		p5: p5,
		{ size = 16, lightness = [0.75, 0.25] }: { size?: number; lightness?: [number, number] } = {}
	) {
		const minLight = this.darkMode ? lightness[1] : lightness[0];
		const color = this.currentColor(p5);
		return color.lightnessSwatch(size, minLight, minLight + 0.2, color.h, false, true);
	}

	huePalette(p5: p5, { size = 12 }: { size?: number } = {}) {
		return this.currentColor(p5).hueSwatch(size, 360 / size);
	}

	chance(
		value: number,
		{ sizes = this.sizes, power = 0 }: { sizes?: number[]; power?: number } = {}
	) {
		if (sizes.length < 1) return 0;

		const d = sizes[1] / sizes[0];
		const [min, max] = [Math.min(...sizes) / d, Math.max(...sizes) * d];
		const distance = Math.log(value / min) / Math.log(max / min); // geometric
		return 1 - Math.pow(power < 0 ? 1 - distance : distance, Math.abs(power));
	}

	chooseWeighted({ sizes = this.sizes, power = 1 }: { sizes?: number[]; power?: number } = {}) {
		const [min, max] = [Math.min(...sizes), Math.max(...sizes)];
		let map: [number, number][] = sizes.map((size) => [size, size]);
		map = map.filter((v) => v[1] >= min && v[1] <= max);
		return this._randomWeighted(map, (x) => x ** power);
	}

	_randomWeighted<T>(map: [T, number][], func?: (map: number) => number) {
		const funcMap: [T, number][] = func ? map.map(([key, value]) => [key, func(value)]) : map;

		const totalWeight = funcMap.reduce((a, b) => a + b[1], 0);
		const normalizedMap: [T, number][] = funcMap.map(([key, value]) => [key, value / totalWeight]);

		let sum = 0,
			r = Math.random();

		for (let [i, v] of Object.entries(normalizedMap)) {
			sum += v[1];
			if (r <= sum) return v[0];
		}

		return normalizedMap[normalizedMap.length - 1][0];
	}
}
