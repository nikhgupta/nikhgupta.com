import { P5Sketch, P5Element } from './base';
import type { P5SketchArguments } from './base';
import type { p5 } from 'p5-svelte';

import { lchChromaMap } from '$lib/store';
import { Color } from '../routes/tools/palette-generator/lib/colors';

export default P5Element;
export class HomeSketch extends P5Sketch {
	lr: number[];
	chroma: number;
	map: Record<number, number>;

	constructor(params: P5SketchArguments) {
		super(params);

		this.chroma = 0.04;
		this.lr = Array.from({ length: 98 }, (x, i) => 0.35 + (i + 1) / 200);

		this.map = [];
		lchChromaMap.subscribe((value) => (this.map = value));
	}

	beforeSetup(p5: p5) {}

	onSetup(p5: p5) {
		p5.frameRate(1);
		this.onDraw(p5);
	}

	onDraw(p5: p5) {
		if (!this.height) this.height = p5.windowHeight;
		if (!this.width) this.width = p5.windowWidth;

		const n = Math.round(Math.pow(this.height * this.width, 0.18));
		const margin = n * 2;
		p5.noLoop();

		const color = Color.fromRandom();
		const colors = Array.from({ length: 16 }, (x, i) => {
			return color.transform({ l: p5.random(this.lr) }).toHex();
		});

		p5.background(color.transform({ l: 0.75 }).toHex());
		p5.translate(margin, margin);
		for (let i = 0; i < (this.width - 2 * margin) / n; i++) {
			for (let j = 0; j < (this.height - 2 * margin) / n; j++) {
				p5.noStroke();
				p5.fill(p5.random(colors));
				p5.circle(i * n, j * n, p5.random([n, n / 2, n / 3, (n * 2) / 3])); // p5.random([n / 2, n, n * 1.5, n / 1.5]));
			}
		}
	}
}
