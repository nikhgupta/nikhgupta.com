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
	alphaBase: number;
	drawingMode: number;
	drawingLineArgs: [number, number, number];
	forceFieldFn: ForceFieldFunction | null;

	_lamp: number;
	_hamp: number;
	_color: Color;

	constructor(params: P5SketchArguments) {
		super(params);

		this.frameRate = 240;
		this.maxFrames = 36 * this.frameRate;

		this.data = [0, 0, 0];
		this.repulsors = [];
		this.attractors = [];
		this.forces = [];
		this.packer = null;
		this.forceFieldFn = null;

		this.maxDim = Math.max(...this.dim);
		this.field = new ForceField(this.dim[0], this.dim[1], this.seed, {
			density: Math.floor(this.r.range(60, 180))
		});

		this.drawingMode = this.r.choose([1, 2, 3, 0.5, 1 / 3]);
		this.alphaBase = this.r.range(0.0, 1.0);
		this.drawingLineArgs = this.r.shuffle([
			this.r.range(1, 9),
			this.r.range(1, 7),
			this.r.range(1, 5)
		]) as [number, number, number];

		this._lamp = this.r.range(0.2, 0.5);
		this._hamp = this.r.range(-0.6, 0.6);
		this._color = this.startingColor;
		console.log(this._lamp, this._hamp);
	}

	destroy() {
		super.destroy();
		this.field.destroy();
	}

	beforeDrawing(p5: p5) {
		this.testing = false;
		this.frameRate = this.testing ? 40 : this.r.range(80, 320);
		this.maxFrames = 36 * this.frameRate;

		this.startingColor = this.currentDrawColor(p5).transformLight(this.darkMode ? 0.54 : 0.84);
		p5.background(this.startingColor.toHex());
	}

	_setupForceField(p5: p5) {
		// const d = Math.floor(this.r.range(1, 4.99));
		// const n = Math.floor(this.r.range(1, 8.99));
		// console.log(d, n);
		// for (let i = 0; i < n; i++) {
		// 	this.forces.push(this.field.fractalSimplexNoiseField({ strength: 1, t: i * d }));
		// }
		this.forces.push(this.field.fractalSimplexNoiseField({ strength: 0.5 }));
		this.forces.push(this.field.fractalSimplexNoiseField({ strength: 0.25 }));
		this.forces.push(this.field.fractalSimplexNoiseField({ strength: 0.125 }));
		// this.__addRepulsor({ strength: 8, inside: false });
		// const [x, y] = this.__addAttractor({ strength: 8, inside: false });
		// console.log(x, y);
		// this.__addAttractor({ strength: 4, inside: false });
		// this.__addAttractor({ strength: 4, inside: false });
		// this.__addAttractor({ strength: 2, inside: false });
		// this.__addAttractor(p5, { strength: 1, mark: false });
		// this.__addAttractor(p5, { x: -0.4, strength: 16, mark: false });
		// this.__addAttractor(p5, { x: 1.4, strength: 8, mark: false });
		// this.__addAttractor(p5, { strength: 1, mark: false });

		let angle = this.r.range(0, 360);
		let strength = this.r.range(-0.125, 0.125);
		if (this.r.random() > 0.9) {
			this.forces.push(this.field.gradientField({ angle, strength }));
		}
		strength = this.r.range(-0.125, 0.125);
		if (this.r.random() > 0.9) {
			this.forces.push(this.field.randomField({ strength }));
		}
		strength = this.r.range(-0.125, 0.125);
		if (this.r.random() > 0.9) {
			this.forces.push(this.field.waveField({ strength, scale: 0.02 }));
		}
		return this.field.joinForces(...this.forces);
	}

	setupDependencies(p5: p5) {
		p5.background(this.startingColor.toHex());
		this.field.setContext(p5);
		this.packer = new CirclePacker(this.seed, this.dim[0], this.dim[1], this.field._bounds, {
			count: this.testing ? 1600 : 4000,
			attempts: this.testing ? 8000 : 12000
		});

		this.forceFieldFn = this._setupForceField(p5);
		this.packer!.setup().growCirclesIndefinitely();
	}

	onFirstFrame(p5: p5): void {
		this.field.setup(this.forceFieldFn, 0);
		if (this.testing) {
			this.packer!.showMovement(p5, '#00000011');
			this.packer!.show(p5, '#00000011');
			this.field.visualize('#00000011', false);
		}
	}

	onEachTick(p5: p5, progress: number): void {
		// if (this.currentTick() % 6 != 0) return;
		// changeColor(progress)

		const window = this.packer!.currentWindow(progress);
		console.log(window);
	}

	changeColor(progress: number) {
		const p = Math.PI * 0.5;
		const l =
			this.startingColor.l +
			(this.darkMode ? 0.04 : -0.04) +
			this._lamp * Math.sin(progress * (this.darkMode ? p / 2 : -p));
		const h =
			this.startingColor.h + this.r.range(3, 8) + 360 * this._hamp * Math.sin(progress * p + 2 * p);
		this._color = this.startingColor.transform({ h }).transformLight(l);
	}

	onEachFrame(p5: p5, progress: number) {
		this.field.setup(this.forceFieldFn, 0);
		// this.packer!.showMovement(p5, '#00000011');
		// this.packer!.show(p5, '#00000011');
		// this.field.visualize('#00000011', false);

		this.changeColor(progress);
		const m = Math.floor(1 + progress * 6) ** 0.5;
		this.data[0] = Math.floor(this.r.range(4, 10));
		this.data[1] = this.r.range(0.001, 0.002) / m;
		this.data[2] = this.r.range(0, 0.1);

		this.__drawMultiLines(p5, this._color, ...this.drawingLineArgs, {});
		if (this.r.random() > 0.995)
			this.__drawMultiLines(p5, this._color, 5, 1, 1, { freeform: true });
		// if (this.testing) {
		// 	p5.stroke('#00000011');
		// 	p5.strokeWeight(1);
		// 	const window = this.packer!.currentWindow(progress);
		// 	p5.rect(window[0][0], window[1][0], window[0][1] - window[0][0], window[1][1] - window[1][0]);
		// }
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
			let [x, y] = this.packer!.randomPointInMovingWindow(progress, 0.1);
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
		const stepLengthW = Math.max(0.5, this.maxDim * stepLength);

		p5.beginShape();
		p5.stroke(color.transform({ alpha: 0 }).toHex());
		p5.vertex(pos.x, pos.y);

		for (let n = 0; n < numSteps; n++) {
			let alpha = this.alphaBase + (1 - Math.abs(n / numSteps - 0.5) * 2) ** this.drawingMode;
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

		return [x, y];
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
