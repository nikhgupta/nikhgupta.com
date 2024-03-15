import { Vector } from 'p5';
import type { p5 } from 'p5-svelte';
import { Color } from '$lib/colors';
import { Random } from '$lib/random';

type ForceFieldOptions = {
	density?: number;
};

// sginature for force_field function
export type ForceFieldFunction = (self: ForceField, col: number, row: number) => Vector;

export class ForceField {
	width: number;
	height: number;
	seed: number;

	density: number;
	color: Color;
	p5: p5 | null;
	r: Random;

	cols: number;
	rows: number;
	resolution: number;

	_leftX: number;
	_rightX: number;
	_topY: number;
	_bottomY: number;
	_field: Vector[][];
	_bounds: [number, number];

	constructor(
		width: number,
		height: number,
		seed: number,
		{ density = 120 }: ForceFieldOptions = {}
	) {
		this.p5 = null;
		this.width = width;
		this.height = height;
		this.seed = seed;
		this.r = new Random(this.seed);

		this.density = density;
		this.color = new Color(0, 0, 0, 1);

		this._bounds = [-1, 2]; // [-0.5, 1.5]
		this._leftX = Math.floor(this.width * this._bounds[0]);
		this._rightX = Math.floor(this.width * this._bounds[1]);
		this._topY = Math.floor(this.height * this._bounds[0]);
		this._bottomY = Math.floor(this.height * this._bounds[1]);
		this.resolution = Math.floor(this.width / this.density);

		this.cols = Math.floor((this._rightX - this._leftX) / this.resolution);
		this.rows = Math.floor((this._bottomY - this._topY) / this.resolution);

		this._field = Array.from({ length: this.cols }, () =>
			Array.from({ length: this.rows }, () => new Vector(0, 0))
		);
	}

	destroy() {
		this._field = [];
	}

	setup(fn: ForceFieldFunction | null = null) {
		for (let i = 0; i < this.cols; i++) {
			for (let j = 0; j < this.rows; j++) {
				const v: Vector = fn ? fn(this, i, j) : this.forceFieldFor(this, i, j);
				this._field[i][j] = v.mult(this.resolution);
			}
		}
		return this;
	}

	forceFieldFor(
		...[self, col, row]: Parameters<ForceFieldFunction>
	): ReturnType<ForceFieldFunction> {
		return Vector.fromAngle((row / this.rows) * Math.PI, 1);
	}

	setContext(p5: p5) {
		this.p5 = p5;
	}

	setColor(color: Color) {
		this.color = color;
	}

	indexFor(x: number, y: number) {
		return [
			Math.floor(
				Math.min(Math.max(0, x - this._leftX), this._rightX - this._leftX - this.resolution) /
					this.resolution
			),
			Math.floor(
				Math.min(Math.max(0, y - this._topY), this._bottomY - this._topY - this.resolution) /
					this.resolution
			)
		];
	}

	forceFor(x: number, y: number) {
		const [colIndex, rowIndex] = this.indexFor(x, y);
		try {
			return this._field[colIndex][rowIndex];
		} catch (e) {}
	}

	forceForVector(vector: Vector) {
		return this.forceFor(vector.x, vector.y);
	}

	joinForces(...forces: ForceFieldFunction[]): ForceFieldFunction {
		return (self: ForceField, col: number, row: number) => {
			return forces.reduce((acc, force) => acc.add(force(self, col, row)), new Vector(0, 0));
		};
	}

	drawSingleLine(x: number, y: number, numSteps: number, stepLength: number) {
		const pos = new Vector(x, y);
		const maxDim = Math.max(this.width, this.height);
		const stepLengthW = Math.round(maxDim * stepLength);

		this.p5!.beginShape();
		this.p5!.vertex(pos.x, pos.y);
		for (let n = 0; n < numSteps; n++) {
			let vector = this.forceForVector(pos);

			if (vector) {
				let result = Vector.mult(vector, stepLengthW);
				pos.add(result as unknown as Vector);

				this.p5!.vertex(pos.x, pos.y);
			}
		}
		this.p5!.endShape();
	}

	drawLineGroup(
		numLines: number,
		x: number,
		y: number,
		numSteps: number,
		stepLength: number,
		{
			jitter = 2,
			stepVaryNum = 0.2,
			stepVaryLen = 0.2
		}: { jitter?: number; stepVaryNum?: number; stepVaryLen?: number } = {}
	) {
		for (let i = 0; i < numLines; i++) {
			x = x + this.r.random() * jitter * 2 - jitter;
			y = y + this.r.random() * jitter * 2 - jitter;
			const numSteps_ = numSteps * (1 - stepVaryNum / 2 + this.r.random() * stepVaryNum);
			const stepLength_ = stepLength * (1 - stepVaryLen + this.r.random() * stepVaryLen);
			this.drawSingleLine(x, y, numSteps_, stepLength_);
		}
	}

	drawLineClusters(
		numClusters: number,
		numLines: number,
		numSteps: number,
		stepLength: number,
		{
			jitter = 2,
			stepVaryNum = 0.2,
			stepVaryLen = 0.2,
			x = this._bounds,
			y = this._bounds
		}: {
			jitter?: number;
			stepVaryNum?: number;
			stepVaryLen?: number;
			x?: [number, number];
			y?: [number, number];
		} = {}
	) {
		for (let i = 0; i < numClusters; i++) {
			const xP = this.width * (x[0] + (x[1] - x[0]) * this.r.random());
			const yP = this.height * (y[0] + (y[1] - y[0]) * this.r.random());
			this.drawLineGroup(numLines, xP, yP, numSteps, stepLength, {
				jitter,
				stepVaryNum,
				stepVaryLen
			});
		}
	}

	visiblePoint(m: number, margin: number = 0) {
		return m * this.r.range(0 + margin, 1.0 - margin);
	}

	invisiblePoint(m: number, margin: number = 0) {
		const a = this.r.range(this._bounds[0] + margin, 0 - margin);
		const b = this.r.range(1.0 + margin, this._bounds[1] - margin);

		return m * (this.r.random() > 0.5 ? a : b);
	}

	visualize(hex: string = '#00000011', complete = false) {
		this.p5!.noFill();
		this.p5!.strokeWeight(1);
		this.p5!.stroke(hex);
		for (let column = 0; column < this.cols; column++) {
			for (let row = 0; row < this.rows; row++) {
				let x = this._leftX + column * this.resolution;
				let y = this._topY + row * this.resolution;
				if (complete) {
					x = this.p5!.map(x, this._leftX, this._rightX, 0, this.width);
					y = this.p5!.map(y, this._topY, this._bottomY, 0, this.height);
				}

				const vector = this._field[column][row];
				const position = new Vector(x, y);
				position.add(vector);

				this.p5!.circle(position.x, position.y, 1);
				this.p5!.line(x, y, position.x, position.y);
			}
		}
	}

	perlinNoiseField({
		scale = 0.015,
		strength = 1
	}: { scale?: number; strength?: number } = {}): ForceFieldFunction {
		return (self: ForceField, col: number, row: number) => {
			const x = col * scale;
			const y = row * scale;
			const angle = self.p5!.map(self.p5!.noise(x, y), 0, 1, 0, 2 * Math.PI);
			return Vector.fromAngle(angle, strength);
		};
	}

	repulsorFieldAt(x: number, y: number, strength: number = 3): ForceFieldFunction {
		const idx = this.indexFor(x, y);

		return (self: ForceField, i: number, j: number) => {
			const dx = i - idx[0];
			const dy = j - idx[1];
			const distance = Math.sqrt(dx * dx + dy * dy);
			const decay = strength / Math.max(distance, 1) ** (1 / 3);
			const angle = Math.atan2(dy, dx);
			return Vector.fromAngle(angle, decay);
		};
	}

	attractorFieldAt(x: number, y: number, strength: number = 1): ForceFieldFunction {
		return this.repulsorFieldAt(x, y, -strength);
	}

	radialWaveAt(
		x: number,
		y: number,
		strength: number = 1,
		frequency: number = Math.PI
	): ForceFieldFunction {
		const idx = this.indexFor(x, y);
		return (self: ForceField, i: number, j: number) => {
			const dx = i - idx[0];
			const dy = j - idx[1];
			const distance = Math.sqrt(dx * dx + dy * dy);
			const angle = Math.atan2(dy, dx);
			const wave = Math.sin(distance * frequency) * strength;
			return Vector.fromAngle(angle, wave);
		};
	}

	randomField({ strength = 1 }: { strength?: number } = {}) {
		return (self: ForceField, i: number, j: number) => {
			const angle = Math.random() * Math.PI * 2;
			return Vector.fromAngle(angle, strength);
		};
	}

	waveField({
		strength = 4,
		frequency = 0.001,
		scale = 0.005,
		phase = 0
	}: {
		strength?: number;
		frequency?: number;
		scale?: number;
		phase?: number;
	} = {}) {
		return (self: ForceField, i: number, j: number) => {
			// Base angle determined by Perlin noise, modified by randomness
			const noise = self.p5!.noise(i * scale, j * scale);
			const angle = self.p5!.map(noise, 0, 1, 0, Math.PI * 2);

			// Compute the wave's effect at this point
			const effect = i * Math.cos(angle) + j * Math.sin(angle);
			const wavePhase = (0.5 + Math.sin(effect * frequency + phase)) * strength;

			// Convert the base angle and wave phase into a vector
			return Vector.fromAngle(angle).mult(wavePhase);
		};
	}

	moirePatternField({
		strength = 1,
		frequencyX = 0.01,
		frequencyY = 0.01,
		phase = 0
	}: {
		strength?: number;
		frequencyX?: number;
		frequencyY?: number;
		phase?: number;
	} = {}) {
		return (self: ForceField, i: number, j: number) => {
			const waveX = Math.sin(i * frequencyX + phase) * strength;
			const waveY = Math.sin(j * frequencyY + phase) * strength;
			return new Vector(waveX, waveY);
		};
	}

	magneticFieldAt(
		northX: number,
		northY: number,
		southX: number,
		southY: number,
		{ strength = 1 }: { strength?: number } = {}
	) {
		const nIdx = this.indexFor(northX, northY);
		const sIdx = this.indexFor(southX, southY);

		return (self: ForceField, i: number, j: number) => {
			const dxN = i - nIdx[0];
			const dyN = j - nIdx[1];
			const dxS = i - sIdx[0];
			const dyS = j - sIdx[1];

			const dR = dxN * dxN + dyN * dyN;
			const forceFromNorth = Vector.fromAngle(Math.atan2(dyN, dxN), strength / dR);
			const forceFromSouth = Vector.fromAngle(Math.atan2(dyS, dxS), strength / dR);
			return Vector.add(forceFromNorth, forceFromSouth);
		};
	}

	gradientField({ strength = 1, angle = 0 }: { strength?: number; angle?: number } = {}) {
		const radians = (angle / 180) * Math.PI;
		return (self: ForceField, i: number, j: number) => {
			const angle = Math.atan2(j, i);
			return Vector.fromAngle(radians, strength);
		};
	}
}
