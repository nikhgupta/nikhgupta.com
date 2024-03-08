import { P5Sketch, P5Element } from './base';
import type { P5SketchArguments } from './base';
import type { p5 } from 'p5-svelte';

import { lchChromaMap } from '$lib/store';
import { Color } from '../routes/tools/palette-generator/lib/colors';

export default P5Element;
export class CircleSketch extends P5Sketch {
	map: Record<number, number>;
	sizes: number[];

	constructor(params: P5SketchArguments) {
		super(params);

		this.map = [];
		this.sizes = [1, 1 / 2, 1 / 3, 2 / 3, 1 / 4, 3 / 4];
		lchChromaMap.subscribe((value) => (this.map = value));
	}

	onSetup(p5: p5) {
		this.onDraw(p5);
	}

	onDraw(p5: p5) {
		const { n, color, palette } = this.choosePalette(p5);

		p5.background(color.toHex());
		p5.translate(n / 2, 0);

		for (let i = 0; i < (this.width - n / 2) / n; i++) {
			for (let j = 0; j < this.height / n; j++) {
				p5.noStroke();
				p5.fill(p5.random(palette));
				p5.circle(i * n, j * n, n * p5.random(this.sizes));
			}
		}
	}

	choosePalette(p5: p5) {
		const n = Math.round(Math.pow(this.height * this.width, 0.18));
		const color: Color = Color.fromRgb(this.bgColor()) || Color.fromRandom();
		const drawColor = color.transform({ h: p5.random(360) });

		const palette = Array.from({ length: 16 }, (x, i) => {
			let l = (this.darkMode ? 0.25 : 0.75) + p5.random(98) / 400;
			const c = Color.maxChromaValueForLightness(l);
			return drawColor.transform(this.darkMode ? { l } : { l, c }).toHex();
		});

		return { n, color, palette };
	}
}
