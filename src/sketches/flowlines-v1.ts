import { P5Sketch, P5Element } from './base';
import type { P5SketchArguments } from './base';
import type { p5 } from 'p5-svelte';
import type { Color } from '$lib/colors';
import { ForceField } from './lib/forceField';
import { Vector } from 'p5';

export default P5Element;
export class CurrentSketch extends P5Sketch {
	maxDim: number;
	field: ForceField;
	data: [number, number, number];
	drawingMode: number;

	constructor(params: P5SketchArguments) {
		super(params);

		this.data = [0, 0, 0];
		this.drawingMode = 1;
		this.maxDim = Math.max(...this.dim);
		this.field = new ForceField(this.dim[0], this.dim[1], this.seed, { density: 120 });
	}

	destroy() {
		super.destroy();
		this.field.destroy();
	}

	beforeDrawing(p5: p5): void {
		this.frameRate = 200;
		this.maxFrames = 18 * this.frameRate;
		this.startingColor = this.currentDrawColor(p5).transformLight(this.darkMode ? 0.4 : 0.92);
		p5.background(this.startingColor.toHex());
	}

	setupDependencies(p5: p5): void {
		this.field.setContext(p5);
		new Promise((r) => setTimeout(r, 5000)).then(() => {});

		this.field.setup(this.field.perlinNoiseField());
		this.field.visualize('#00000033', false);
	}

	onEachTick(p5: p5, progress: number): void {
		const sN = Math.floor(this.r.range(40, 160));
		const sL = this.r.range(0.001, 0.005);
		const jT = this.r.range(0, 0.5);
		this.data = [sN, sL, jT];
	}

	onEachFrame(p5: p5, progress: number) {
		const hueShift = this.r.range(60, 120);
		const color = this.startingColor
			.transform({
				h: this.startingColor.h + hueShift * progress
			})
			.transformLight(0.4 + (this.startingColor.l - 0.05 - 0.4) * (1 - progress));

		const c = this.currentTick();
		if (c < 18) {
			let x = this.r.range(-this.dim[0] * 0.25, this.dim[0] * 1.25);
			let y = this.r.range(-0.2 + c / 10, -0.1 + c / 10) * this.dim[1];

			this.__drawMultiLines(p5, color, x, y, 1, 10, 1);
		}
	}

	__drawMultiLines(
		p5: p5,
		color: Color,
		x: number,
		y: number,
		clusters: number = 1,
		groups: number = 20,
		lines: number = 1,
		{ freeform = false }: { freeform?: boolean } = {}
	) {
		const [sN, sL, jT] = this.data;

		for (let i = 0; i < clusters; i++) {
			let numSteps = sN * this.r.range(1 - jT, 1 + jT);
			let stepLength = sL * this.r.range(1 - jT, 1 + jT);
			if (freeform) [numSteps, stepLength] = [3, 0.0001];
			for (let j = 0; j < groups; j++) {
				let jitter = 10;
				let stepVaryNum = this.r.range(0, 0.2);
				let stepVaryLen = this.r.range(0, 0.2);
				for (let k = 0; k < lines; k++) {
					x = x + this.r.random() * jitter * 2 - jitter;
					y = y + this.r.random() * jitter * 2 - jitter;
					const numSteps_ = numSteps * (1 - stepVaryNum / 2 + this.r.random() * stepVaryNum);
					const stepLength_ = stepLength * (1 - stepVaryLen + this.r.random() * stepVaryLen);
					this.__drawSingleLine(p5, color, x, y, numSteps_, stepLength_);
				}
			}
		}
	}

	__drawSingleLine(
		p5: p5,
		color: Color,
		x: number,
		y: number,
		numSteps: number,
		stepLength: number
	) {
		const pos = new Vector(x, y);
		const stepLengthW = Math.max(1, Math.round(this.maxDim * stepLength));

		p5.beginShape();
		p5.stroke(color.transform({ alpha: 0 }).toHex());
		p5.vertex(pos.x, pos.y);

		for (let n = 0; n < numSteps; n++) {
			let alpha = 0.0 + (1 - Math.abs(n / numSteps - 0.5) * 2) ** this.drawingMode * 1.0;
			p5.stroke(color.transform({ alpha }).toHex());

			let vector = this.field.forceForVector(pos);

			if (vector) {
				let result = Vector.mult(vector, stepLengthW);
				pos.add(result as unknown as Vector);

				p5.vertex(pos.x, pos.y);
			}
		}
		p5.endShape();
	}
}
