import { P5Sketch } from './base';
import type { p5 } from 'p5-svelte';

export class CurrentSketch extends P5Sketch {
	// Constructor, setup, and other parts of P5Sketch remain unchanged unless you want to customize them specifically for this sketch.

	onDraw(p5: p5) {
		p5.background(this.bgColor()); // Use bgColor for consistency with dark mode if applicable
		const centerX = this.dim[0] / 2;
		const centerY = this.dim[1] / 2;

		// Parameters for spiral
		let startRadius = 10;
		let endRadius = Math.min(this.dim[0], this.dim[1]) / 2; // Adapt to canvas size
		let angleStep = 0.85; // Adjust for tighter or looser spirals
		let radiusStep = 0.04; // Adjust for spacing between loops

		p5.noFill();
		p5.stroke(this.fgColor()); // Use fgColor for consistency with dark mode if applicable

		for (let i = 0; i < 108000; i++) {
			let angle = p5.radians(i) * angleStep;
			let radius = startRadius + i * radiusStep;
			let x = centerX + p5.cos(angle) * radius;
			let y = centerY + p5.sin(angle) * radius;

			// Adjust circle size and other properties as needed
			p5.ellipse(x, y, radius * 0.1, radius * 0.1);
		}
	}
}
