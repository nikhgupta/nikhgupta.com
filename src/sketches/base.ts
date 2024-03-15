import P5 from 'p5-svelte';
import type { p5, Sketch } from 'p5-svelte';
import { browser } from '$app/environment';

import { lchChromaMap } from '$lib/store';
import { Color } from '$lib/colors';
import { randomSeedFrom, Random } from '$lib/random';
import { Font } from 'p5';

export const P5Element = P5;
export const AVAILABLE_SKETCHES = ['scattered', 'mondrian', 'flowlines-v1', 'flowlines-v2'];

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
	colors: string[]; // fg and bg colors of the sketch (used for homepage)
	aside: string; // id of the aside element (used for homepage)
	darkMode: boolean; // whether the sketch is in dark mode
	dim: [number, number]; // dimensions of the canvas
	seed!: number; // seed for the random number generator
	startingHue: number; // starting hue of the sketch
	frameRate: number; // frame rate of the sketch

	r: Random; // random number generator (seeded)
	testing: boolean; // whether the sketch is in testing mode
	chromaMap: Record<number, number>; // chroma map for the LCH color space
	startingColor: Color; // starting color of the sketch
	sizes: number[]; // sizes for the weighted random function
	curves: ((x: number) => number)[]; // smooth curves for the sketch
	curvesIrregular: ((x: number) => number)[]; // irregular smooth curves for the sketch
	maxFrames: number; // maximum number of frames for the sketch
	frameCount: number;

	_font: Font | string | null; // font for the sketch

	constructor({
		colors = ['#f3f8ff', '#121f32'],
		aside = 'main-wrapper',
		darkMode = false,
		size = null,
		frameRate = 0,
		hue = null,
		seed = null
	}: P5SketchArguments) {
		this.testing = false;
		this.setSeed(seed);
		this.r = new Random(this.seed);

		this.dim = size ? size : [0, 0];

		this.aside = aside;
		this.darkMode = darkMode;
		this.colors = colors;
		this.frameRate = frameRate;
		this.maxFrames = frameRate > 0 ? 60 * frameRate : 0;
		this.frameCount = 0;

		this._font = null;

		this.startingHue = hue != null ? hue : this.randomStartingHueAsPerBackground();
		this.startingColor = this.pickStartingColor();

		// utility setup: commonly used values
		// different sizes for use in sketches without providing them again and again
		this.sizes = [1 / 64, 1 / 32, 1 / 16, 1 / 8, 1 / 4, 1 / 2, 1, 2, 4, 8, 16, 32, 64];
		// chroma map
		this.chromaMap = [];
		lchChromaMap.subscribe((value) => (this.chromaMap = value));
		// smoothing curves
		this.curves = Array.from({ length: 16 }, (x, i) => this.smoothCurve());
		this.curvesIrregular = Array.from({ length: 16 }, (x, i) => this.smoothCurve(null, null));
	}

	destroy() {
		this.chromaMap = [];
		this.curves = [];
		this.curvesIrregular = [];
	}

	// return function for Sketch used by p5-svelte to run it
	static run(params: P5SketchArguments) {
		const self = new this(params);
		const sketch: Sketch = (p5: p5) => {
			p5.preload = () => self.preload(p5);
			p5.setup = () => self.setup(p5);
			p5.draw = () => self.draw(p5);
		};

		return sketch;
	}

	// used in the homepage to load and run a sketch from file name
	static async loadAndRun(name: string, params: P5SketchArguments) {
		const { CurrentSketch } = await import(`../sketches/${name}.ts`);
		return CurrentSketch.run(params);
	}

	// find the next available sketch to cycle to
	static nextSketchName(name: string) {
		const index = AVAILABLE_SKETCHES.indexOf(name);
		return AVAILABLE_SKETCHES[(index + 1) % AVAILABLE_SKETCHES.length];
	}

	preload(p5: p5) {
		this.onLoad(p5);
		if (typeof this._font === 'string') this._font = p5.loadFont(this._font);
	}

	onLoad(p5: p5) {}

	setup(p5: p5) {
		p5.randomSeed(this.seed);
		p5.noiseSeed(this.seed);

		// set dimensions of the sketch based on the aside element or viewport
		this.setDimensions();
		p5.createCanvas(this.dim[0], this.dim[1], p5.WEBGL);
		p5.translate(-this.dim[0] / 2, -this.dim[1] / 2);
		p5.background(this.bgColor());
		this.drawText(p5, 'loading...');

		p5.noFill();
		p5.stroke(this.fgColor());
		p5.strokeWeight(1);
		this.beforeDrawing(p5);
		this.drawText(p5, 'setting up the sketch... may take a moment..');
	}

	draw(p5: p5) {
		this.frameCount = p5.frameCount;

		const progress = this.progress();
		p5.translate(-this.dim[0] / 2, -this.dim[1] / 2);

		if (this.frameRate == 0) {
			p5.noLoop();
			p5.frameRate(0);
		} else {
			p5.loop();
			if (this.frameRate > 0) p5.frameRate(this.frameRate);
		}

		if (p5.frameCount == 1) {
			this.setupDependencies(p5);
			p5.background(this.startingColor.toHex());
			this.onFirstFrame(p5);
		}

		if (p5.frameCount % this.frameRate == 1) {
			let fps = Math.round(p5.frameRate());
			this.onEachTick(p5, progress);
			console.log(fps);
		}

		if (this.maxFrames > 0 && p5.frameCount > this.maxFrames) {
			p5.noLoop();
			this.onFinishUp(p5);
			console.log('Finished rendering!');
			return;
		}

		p5.noFill();
		p5.stroke(this.fgColor());
		p5.strokeWeight(1);
		this.onEachFrame(p5, progress);
	}

	// override setup instructions from base class
	beforeDrawing(p5: p5) {}

	// setup dependencies for the sketch
	// this is called once before the first frame
	// and is used to setup the sketch
	// shows a message to user by default while setting up
	setupDependencies(p5: p5) {}

	// called on the first frame of the sketch
	onFirstFrame(p5: p5) {}

	// called on each frame of the sketch
	onEachFrame(p5: p5, progress: number) {}

	// called on each tick of the sketch, tick = frameCount % frameRate == 1
	onEachTick(p5: p5, progress: number) {}

	// called when the sketch is finished rendering
	onFinishUp(p5: p5) {}

	// return the progress of the sketch in the range [0, 1]
	progress() {
		return this.maxFrames > 0 ? this.frameCount / this.maxFrames : 0;
	}

	currentTick() {
		return Math.floor(this.frameCount / this.frameRate);
	}

	// set the seed for the random number generator
	setSeed(seed: number | null) {
		this.seed = seed ? seed : randomSeedFrom();
		return this;
	}

	drawText(
		p5: p5,
		text: string,
		{ pos = null, size = 24 }: { pos?: [number, number] | null; size?: number } = {}
	) {
		console.log('text:', text);

		if (this._font) {
			p5.fill(this.fgColor());
			p5.textFont(this._font!);
			p5.textSize(size);
			if (!pos) pos = [this.dim[0] * 0.3, this.dim[1] * 0.5];
			p5.text(text, ...pos);
			p5.noFill();
		}
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

		const l = this.darkMode ? 0.35 : 0.95;
		return color._transformHue(this.startingHue).transformLight(l);
	}

	currentColor(p5: p5, scale: number = 1) {
		return this.startingColor.transform({ h: this.startingColor.h + p5.frameCount / scale });
	}

	currentDrawColor(p5: p5, scale: number = 1, lightness: [number, number] = [0.75, 0.55]) {
		return this.currentColor(p5, scale).transformLight(this.darkMode ? lightness[1] : lightness[0]);
	}

	lightnessPalette(
		p5: p5,
		{
			size = 16,
			scale = 1,
			lightness = [0.75, 0.25]
		}: { size?: number; scale?: number; lightness?: [number, number] } = {}
	) {
		const minLight = this.darkMode ? lightness[1] : lightness[0];
		const color = this.currentDrawColor(p5, scale, lightness);
		return color.lightnessSwatch(size, minLight, minLight + 0.2, color.h, false, true);
	}

	huePalette(
		p5: p5,
		{
			lightness = [0.75, 0.25],
			scale = 1,
			size = 12
		}: { lightness?: [number, number]; scale?: number; size?: number } = {}
	) {
		return this.currentDrawColor(p5, scale, lightness).hueSwatch(size, 360 / size);
	}

	tetradicPalette(
		p5: p5,
		{
			lightness = [0.75, 0.25],
			scale = 1,
			size = 4
		}: { lightness?: [number, number]; scale?: number; size?: number } = {}
	) {
		return this.currentDrawColor(p5, scale, lightness).tetradicInclusive();
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
