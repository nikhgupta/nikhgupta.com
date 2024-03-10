import { P5Sketch, P5Element } from './base';
import type { P5SketchArguments } from './base';
import type { p5 } from 'p5-svelte';

import { lchChromaMap } from '$lib/store';
import { Color } from '../routes/tools/palette-generator/lib/colors';

export default P5Element;
export class CurrentSketch extends P5Sketch {
	map: Record<number, number>;
	sizes: number[];
	currentHue: number;

	constructor(params: P5SketchArguments) {
		super(params);

		this.map = [];
		this.sizes = [
			1,
			1 / 2,
			1 / 3,
			2 / 3,
			1 / 4,
			3 / 4,
			3 / 2,
			4 / 3,
			7 / 4,
			5 / 4,
			2,
			8,
			16,
			32,
			64
		];
		lchChromaMap.subscribe((value) => (this.map = value));

		this.currentHue = Math.round(Math.random() * 360);
	}

	onDraw(p5: p5) {
		const { n, color, palette } = this.choosePalette(p5);

		p5.background(color.toHex());
		p5.translate(n / 2, 0);

		for (let i = 0; i < (this.width + n) / n; i++) {
			for (let j = 0; j < this.height / n; j++) {
				p5.noStroke();
				p5.fill(p5.random(palette));
				const size = p5.random(this.sizes);
				const choice = (1 - 1 / (16 * size * size)) * 0.9995;
				if (p5.random() > choice) p5.rect(i * n, j * n, n * size);
			}
		}
	}

	choosePalette(p5: p5) {
		const m = this.sineWave(p5, { steps: 4 });
		const n = Math.round(Math.pow(this.height * this.width, 0.15 + m * 0.05));
		const color: Color = Color.fromRgb(this.bgColor()) || Color.fromRandom();
		const drawColor = color.transform({ h: this.currentHue + p5.frameCount });

		const palette = Array.from({ length: 16 }, (x, i) => {
			let l = (this.darkMode ? 0.25 : 0.75) + p5.random(98) / 400;
			const c = Color.maxChromaValueForLightness(l);
			const alpha = p5.random(0, 1);
			return drawColor.transform(this.darkMode ? { l, alpha } : { l, c, alpha }).toHex();
		});

		return { n, color, palette };
	}
}
