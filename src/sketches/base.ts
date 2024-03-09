import P5 from 'p5-svelte';
import type { p5, Sketch } from 'p5-svelte';
import { browser } from '$app/environment';

export const P5Element = P5;

export interface P5SketchArguments {
	colors?: string[];
	target?: string;
	invert?: boolean;
	darkMode?: boolean;
	size?: [number, number] | null;
	frameRate?: number;
}

export class P5Sketch {
	size: [number, number] | null;
	width: number;
	height: number;
	colors: string[];
	target: string;
	darkMode: boolean;
	frameRate: number;

	constructor({
		colors = ['#f3f8ff', '#121f32'],
		target = 'main-wrapper',
		darkMode = false,
		size = null,
		frameRate = 0
	}: P5SketchArguments) {
		this.size = size;
		[this.width, this.height] = size ? size : [0, 0];

		this.target = target;
		this.darkMode = darkMode;
		this.colors = colors;
		this.frameRate = frameRate;
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
		this.beforeSetup(p5);
		if (browser) {
			const html = document.documentElement;
			const el = document.getElementById(this.target);
			if (el) {
				const br = el.getBoundingClientRect();
				if (this.width == 0) {
					this.width = html.scrollWidth - br.width - 2 * br.x;
				} else if (this.width <= 1) {
					this.width = br.width * this.width;
				}

				if (this.height == 0) {
					this.height = html.scrollHeight;
				} else if (this.height <= 1) {
					this.height = br.height * this.height;
				}
			}

			if (this.width == 0 || this.height == 0) {
				[this.width, this.height] = [html.scrollWidth, html.scrollHeight];
			}
		}

		if (this.frameRate > 0) p5.frameRate(this.frameRate);
		p5.createCanvas(this.width, this.height);
		this.onSetup(p5);
	}

	draw(p5: p5) {
		if (this.frameRate == 0) p5.noLoop();

		this.onDraw(p5);
	}

	beforeSetup(p5: p5) {}

	onSetup(p5: p5) {
		p5.background(this.darkMode ? this.colors[1] : this.colors[0]);
	}

	onDraw(p5: p5) {
		p5.translate(p5.width / 2, p5.height / 2);

		let v = p5.createVector(p5.random(-100, 100), p5.random(-100, 100));
		v.mult(p5.random(50, 100));

		p5.strokeWeight(1);
		p5.line(0, 0, v.x, v.y);
	}

	bgColor() {
		return this.darkMode ? this.colors[1] : this.colors[0];
	}

	fgColor() {
		return this.darkMode ? this.colors[0] : this.colors[1];
	}

	sineWave(p5: p5, { steps = 4 } = {}) {
		return (1 + Math.sin(p5.frameCount / steps)) / 2;
	}
}
