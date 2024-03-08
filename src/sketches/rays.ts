import { P5Sketch, P5Element } from './base';
import type { p5 } from 'p5-svelte';

export default P5Element;
export class HomeSketch extends P5Sketch {
	onSetup(p5: p5) {
		p5.background(this.fgColor());
	}

	onDraw(p5: p5) {
		p5.stroke(this.bgColor());
		p5.translate(p5.width / 2, p5.height / 2);

		let v = p5.createVector(p5.random(-100, 100), p5.random(-100, 100));
		v.mult(p5.random(50, 100));

		p5.strokeWeight(4);
		p5.line(0, 0, v.x, v.y);
	}
}
