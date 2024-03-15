import { P5Sketch, P5Element } from './base';
import type { P5SketchArguments } from './base';
import type { p5 } from 'p5-svelte';
import { ForceField } from './lib/forceField';
import { CirclePacker } from './lib/circles';
import type { ForceFieldFunction } from './lib/forceField';
import { Vector } from 'p5';
import { Color } from '$lib/colors';

export default P5Element;
export class CurrentSketch extends P5Sketch {
	maxDim: number;
	field: ForceField;
	packer: CirclePacker | null;
	data: any[];
	repulsors: [number, number][];
	attractors: [number, number][];
	forces: ForceFieldFunction[];
	drawingMode: number;
	drawingLineArgs: [number, number, number];

	constructor(params: P5SketchArguments) {
		super(params);

		this.frameRate = 240;
		this.maxFrames = 36 * this.frameRate;

		this.data = [0, 0, 0];
		this.repulsors = [];
		this.attractors = [];
		this.forces = [];
		this.packer = null;

		this.maxDim = Math.max(...this.dim);
		this.field = new ForceField(this.dim[0], this.dim[1], this.seed, { density: 180 });

		this.drawingMode = this.r.choose([1, 2, 3, 0.5, 1 / 3]);
		this.drawingLineArgs = this.r.shuffle([this.r.range(10, 30), 1, 1]) as [number, number, number];
	}

	destroy() {
		super.destroy();
		this.field.destroy();
	}

	beforeDrawing(p5: p5) {
		this.testing = true;
		this.frameRate = this.testing ? 40 : 400;

		this.startingColor = this.currentDrawColor(p5).transformLight(this.darkMode ? 0.4 : 0.92);
		p5.background(this.startingColor.toHex());
	}

	_setupForceField(p5: p5) {
		// this.__addRepulsor({ strength: 8, inside: false });
		this.__addAttractor({ strength: 8, inside: false });
		this.__addAttractor({ strength: 4, inside: false });
		this.__addAttractor({ strength: 4, inside: false });
		// this.__addAttractor(p5, { strength: 1, mark: false });
		// this.__addAttractor(p5, { x: -0.4, strength: 16, mark: false });
		// this.__addAttractor(p5, { x: 1.4, strength: 8, mark: false });
		// this.__addAttractor(p5, { strength: 1, mark: false });
		// this.forces.push(this.field.perlinNoiseField({ strength: 1, scale: 0.05 }));
		// this.forces.push(this.field.gradientField({ angle: 260, strength: 1 }));
		this.forces.push(this.field.randomField({ strength: 0.0625 }));
		this.forces.push(this.field.waveField({ strength: 4, scale: 0.02 }));
		return this.field.joinForces(...this.forces);
	}

	setupDependencies(p5: p5) {
		p5.background(this.startingColor.toHex());
		this.field.setContext(p5);
		this.packer = new CirclePacker(this.seed, this.dim[0], this.dim[1], this.field._bounds, {
			count: this.testing ? 1600 : 20000,
			attempts: this.testing ? 8000 : 140000
		});

		this.field.setup(this._setupForceField(p5));
		this.packer!.setup().growCirclesIndefinitely();
	}

	onFirstFrame(p5: p5): void {
		this.packer!.showMovement(p5, '#00000011');
		this.packer!.show(p5, '#00000011');
		this.field.visualize('#00000011', false);
	}

	onEachFrame(p5: p5, progress: number) {
		const hueShift = this.r.range(120, 240);
		const color = this.startingColor
			.transform({ h: this.startingColor.h + hueShift * progress })
			.transformLight(0.4 + (this.startingColor.l - 0.05 - 0.4) * (1 - progress));

		const m = Math.floor(1 + progress * 6) ** 0.5;
		this.data[0] = Math.floor(this.r.range(4, 10));
		this.data[1] = this.r.range(0.001, 0.002) / m;
		this.data[2] = this.r.range(0, 0.1);

		this.__drawMultiLines(p5, color, ...this.drawingLineArgs, {});
		if (this.r.random() > 0.99) this.__drawMultiLines(p5, color, 5, 1, 1, { freeform: true });

		if (this.testing) {
			p5.stroke('#00000011');
			p5.strokeWeight(1);
			const window = this.packer!.currentWindow(progress);
			p5.rect(window[0][0], window[1][0], window[0][1] - window[0][0], window[1][1] - window[1][0]);
		}
	}

	__drawMultiLines(
		p5: p5,
		color: Color,
		clusters: number = 1,
		groups: number = 20,
		lines: number = 1,
		{ freeform = false }: { freeform?: boolean } = {}
	) {
		const [sN, sL, jT] = this.data;
		const progress = this.progress();

		for (let i = 0; i < clusters; i++) {
			let [x, y] = this.packer!.randomPointInMovingWindow(progress);
			if (freeform) {
				[x, y] = this.packer!.randomPointFreeForm(progress);
			}

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

	__addRepulsor({
		strength = 60,
		x = null,
		y = null,
		inside = false
	}: { strength?: number; x?: number | null; y?: number | null; inside?: boolean } = {}) {
		const isAttr = strength < 0;

		// const method = isAttr ? 'visiblePoint' : 'invisiblePoint';
		const method = inside ? 'visiblePoint' : 'invisiblePoint';
		if (!x) x = this.field[method](1, 0.2);
		if (!y) y = this.field[method](1, 0.2);

		this[isAttr ? 'attractors' : 'repulsors'].push([x, y]);
		this.forces.push(this.field.repulsorFieldAt(x * this.dim[0], y * this.dim[1], strength));

		return this;
	}

	__addAttractor({
		strength = 30,
		x = null,
		y = null,
		inside = false
	}: { strength?: number; x?: number | null; y?: number | null; inside?: boolean } = {}) {
		return this.__addRepulsor({ strength: -strength, x, y, inside });
	}
}
