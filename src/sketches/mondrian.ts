import { P5Sketch, P5Element } from './base';
import type { P5SketchArguments } from './base';
import type { p5 } from 'p5-svelte';
import { Color } from '$lib/colors';

export default P5Element;
export class CurrentSketch extends P5Sketch {
	sizes: number[];
	drawColors: Color[];

	constructor(params: P5SketchArguments) {
		super(params);
		this.drawColors = [];
		this.sizes = [50, 100, 150, 200];
		this.startingColor = this.pickStartingColor().transform({ l: this.darkMode ? 0.35 : 0.75 });
	}

	beforeSetup(p5: p5) {}

	onDraw(p5: p5) {
		console.log(this.startingHue, this.startingColor);
		p5.strokeWeight(5); // make lines really thick
		this.drawColors = this.huePalette(p5, { size: 4 });

		var y = 0;
		var x = 0;

		var currHeight = p5.random(this.sizes);
		var currWidth = p5.random(this.sizes);

		while (y < this.dim[1]) {
			x = 0;
			while (x < this.dim[0]) {
				p5.fill(p5.random(this.drawColors).toHex());
				p5.rect(x, y, Math.min(currWidth, this.dim[0] - x), Math.min(currHeight, this.dim[1] - y));
				x = x + currWidth;
				currWidth = p5.random(this.sizes);
			}
			y = y + currHeight;
			currHeight = p5.random(this.sizes);
		}
	}
}
