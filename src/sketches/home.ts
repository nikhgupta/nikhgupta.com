import { P5Sketch, P5Element } from './base';
import type { P5SketchArguments } from './base';
import type { p5, Sketch } from 'p5-svelte';

import { CircleSketch } from './circles';
// import { MondrianSketch } from './mondrian';

export default P5Element;
export class HomeSketch extends P5Sketch {
	static run(params: P5SketchArguments) {
		// TODO: choose a random sketch based on all sketches in the src/sketches folder
		// TODO: all sketches should automatically define a color palette suitable for
		//       light/dark theme similar to how circles.ts does it
		// const what = Math.random() > 0.5 ? CircleSketch : MondrianSketch;
		const what = CircleSketch;
		const self = new what(params);
		const sketch: Sketch = (p5: p5) => {
			p5.setup = () => self.setup(p5);
			p5.draw = () => self.draw(p5);
		};

		return sketch;
	}
}
