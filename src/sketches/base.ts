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
}

export class P5Sketch {
	size: [number, number] | null;
	width: number | null;
	height: number | null;
	bgColor: string;
	fgColor: string;
	target: string;

	constructor({
		colors = ['#f3f8ff', '#121f32'],
		target = 'main-wrapper',
		darkMode = false,
		size = null
	}: P5SketchArguments) {
		this.size = size;
		[this.width, this.height] = size ? size : [null, null];
		console.log(size);

		this.target = target;
		this.bgColor = darkMode ? colors[1] : colors[0];
		this.fgColor = darkMode ? colors[0] : colors[1];
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
			const el = document.getElementById(this.target);
			if (el) {
				const br = el.getBoundingClientRect();
				if (!this.width) {
					this.width = window.innerWidth - br.width - 2 * br.x;
				} else if (this.width <= 1) {
					this.width = br.width * this.width;
				}

				if (!this.height) {
					this.height = window.innerHeight;
				} else if (this.height <= 1) {
					this.height = br.height * this.height;
				}
			}
		}

		if (!this.width || !this.height) {
			[this.width, this.height] = [window.innerWidth, window.innerHeight];
		}

		p5.createCanvas(this.width, this.height);
		this.onSetup(p5);
	}

	draw(p5: p5) {
		this.onDraw(p5);
	}

	beforeSetup(p5: p5) {}

	onSetup(p5: p5) {
		p5.background(this.bgColor);
	}

	onDraw(p5: p5) {
		p5.translate(p5.width / 2, p5.height / 2);

		let v = p5.createVector(p5.random(-100, 100), p5.random(-100, 100));
		v.mult(p5.random(50, 100));

		p5.strokeWeight(1);
		p5.line(0, 0, v.x, v.y);
	}
}
