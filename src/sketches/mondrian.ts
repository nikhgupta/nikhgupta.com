import { P5Sketch, P5Element } from './base';
import type { P5SketchArguments } from './base';
import type { p5 } from 'p5-svelte';
import type { Color } from 'p5';

export default P5Element;
export class MondrianSketch extends P5Sketch {
	sizes: number[];
	drawColors: Color[];

	constructor(params: P5SketchArguments) {
		super(params);
		this.drawColors = [];
		this.sizes = [50, 100, 150, 200];
	}

	beforeSetup(p5: p5) {
		this.drawColors = [
			p5.color(this.bgColor()),
			p5.color(255, 0, 0),
			p5.color(255, 255, 0),
			p5.color(0, 0, 255)
		];
	}

	onSetup(p5: p5) {
		p5.frameRate(0.25);
		p5.background(this.fgColor());
		this.onDraw(p5);
	}

	onDraw(p5: p5) {
		if (!this.height) this.height = p5.windowHeight;
		if (!this.width) this.width = p5.windowWidth;

		p5.strokeWeight(10); // make lines really thick

		var y = 0;
		var x = 0;

		var currHeight = p5.random(this.sizes);
		var currWidth = p5.random(this.sizes);

		while (y < this.height) {
			x = 0;
			while (x < this.width) {
				p5.fill(p5.random(this.drawColors));
				p5.rect(x, y, currWidth, currHeight);
				x = x + currWidth;
				currWidth = p5.random(this.sizes);
			}
			y = y + currHeight;
			currHeight = p5.random(this.sizes);
		}
	}
}
