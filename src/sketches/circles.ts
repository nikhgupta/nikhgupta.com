import { P5Sketch, P5Element } from './base';
import type { P5SketchArguments } from './base';
import type { p5 } from 'p5-svelte';

export default P5Element;
export class CurrentSketch extends P5Sketch {
	constructor(params: P5SketchArguments) {
		super(params);
	}

	onDraw(p5: p5) {
		const m = this.sineWave(p5, { steps: 4 });
		const n = Math.round(Math.pow(this.dim[0] * this.dim[1], 0.15 + m * 0.05));
		const palette = this.lightnessPalette(p5);

		p5.background(this.bgColor());
		p5.translate(n / 2, 0);

		this.sizes = this.sizes.filter((s) => 1 / 4 <= s && s <= 32);
		for (let i = 0; i < (this.dim[0] + n) / n; i++) {
			for (let j = 0; j < this.dim[1] / n; j++) {
				p5.noStroke();
				p5.fill(p5.random(palette).toHex());
				// the larger the size is, the less likely it is to be drawn
				const size = this.chooseWeighted({ power: -0.05 });
				const choice = this.chance(size, { power: -4.95 });
				if (p5.random() > choice) p5.circle(i * n, j * n, n * size);
			}
		}
	}
}
