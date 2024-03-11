import P5 from 'p5-svelte';
import type { p5, Sketch } from 'p5-svelte';
import { browser } from '$app/environment';

import { lchChromaMap } from '$lib/store';
import { Color } from '$lib/colors';
import { randomSeedFrom, Random } from '$lib/random';

export const P5Element = P5;
export const AVAILABLE_SKETCHES = ['circles', 'squares', 'mondrian', 'flowlines'];

export interface P5SketchArguments {
	colors?: string[];
	aside?: string;
	darkMode?: boolean;
	size?: [number, number] | null;
	frameRate?: number;
	seed?: number | null;
	hue?: number | null;
}

export class P5Sketch {
	r: Random;
	dim: [number, number];
	aside: string;
	darkMode: boolean;
	frameRate: number;
	seed!: number;
	startingHue: number;
	chromaMap: Record<number, number>;
	colors: string[];
	startingColor: Color;
	sizes: number[];
	curves: ((x: number) => number)[];
	curvesIrregular: ((x: number) => number)[];

	constructor({
		colors = ['#f3f8ff', '#121f32'],
		aside = 'main-wrapper',
		darkMode = false,
		size = null,
		frameRate = 0,
		hue = null,
		seed = null
	}: P5SketchArguments) {
		this.setSeed(seed);
		this.r = new Random(this.seed);

		this.dim = size ? size : [0, 0];

		this.aside = aside;
		this.darkMode = darkMode;
		this.colors = colors;
		this.frameRate = frameRate;
		this.sizes = [1 / 64, 1 / 32, 1 / 16, 1 / 8, 1 / 4, 1 / 2, 1, 2, 4, 8, 16, 32, 64];

		this.chromaMap = [];
		lchChromaMap.subscribe((value) => (this.chromaMap = value));

		this.startingHue = hue != null ? hue : this.randomStartingHueAsPerBackground();
		this.startingColor = this.pickStartingColor({ from: this.bgColor() });

		this.curves = Array.from({ length: 16 }, (x, i) => this.smoothCurve());
		this.curvesIrregular = Array.from({ length: 16 }, (x, i) => this.smoothCurve(null, null));
	}

	static run(params: P5SketchArguments) {
		const self = new this(params);
		const sketch: Sketch = (p5: p5) => {
			p5.setup = () => self.setup(p5);
			p5.draw = () => self.draw(p5);
		};

		return sketch;
	}

	static async loadAndRun(name: string, params: P5SketchArguments) {
		const { CurrentSketch } = await import(`../sketches/${name}.ts`);
		return CurrentSketch.run(params);
	}

	static nextSketchName(name: string) {
		const index = AVAILABLE_SKETCHES.indexOf(name);
		return AVAILABLE_SKETCHES[(index + 1) % AVAILABLE_SKETCHES.length];
	}

	setup(p5: p5) {
		p5.randomSeed(this.seed);

		this.setDimensions();
		this.beforeSetup(p5);

		p5.createCanvas(this.dim[0], this.dim[1]);
		this.onSetup(p5);
	}

	draw(p5: p5) {
		if (this.frameRate == 0) {
			p5.noLoop();
			p5.frameRate(0);
		} else {
			p5.loop();
			if (this.frameRate > 0) p5.frameRate(this.frameRate);
		}

		this.onDraw(p5);

		let fps = p5.frameRate();
		if (this.frameRate != 0) p5.text(fps, 50, 50);
	}

	beforeSetup(p5: p5) {}

	onSetup(p5: p5) {
		p5.background(this.bgColor());
	}

	onDraw(p5: p5) {}

	setSeed(seed: number | null) {
		this.seed = seed ? seed : randomSeedFrom();
		return this;
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

	// generate a smooth curve in the range [0, 1]
	smoothCurve(n: number | null = null, m: number | null = 0.5) {
		const c = m != null ? m : this.r.random();
		const d = n != null ? n : this.r.random();
		return (x: number) => 0.5 + 0.5 * Math.cos(2 * Math.PI * (c * x + d));
	}

	randomStartingHueAsPerBackground() {
		if (this.darkMode) return this.r.random() * 60 + 220;

		let r = this.r.random() * 360;
		while ((r > 90 && r < 150) || r > 300) r = this.r.random() * 360;
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
		let color: Color = Color.fromRandom(this.seed);

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
			r = this.r.random();

		for (let [i, v] of Object.entries(normalizedMap)) {
			sum += v[1];
			if (r <= sum) return v[0];
		}

		return normalizedMap[normalizedMap.length - 1][0];
	}
}
