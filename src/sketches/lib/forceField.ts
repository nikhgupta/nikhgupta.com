import { Vector } from 'p5';
import type { p5 } from 'p5-svelte';
import { Color } from '$lib/colors';
import { Random } from '$lib/random';
import { makeNoise3D } from 'fast-simplex-noise';

type ForceFieldOptions = {
	density?: number;
};

// sginature for force_field function
export type ForceFieldFunction = (self: ForceField, col: number, row: number, t: number) => Vector;

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
	_field_cached: boolean;
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

		this._bounds = [-0.25, 1.25]; // [-0.5, 1.5]
		this._leftX = Math.floor(this.width * this._bounds[0]);
		this._rightX = Math.floor(this.width * this._bounds[1]);
		this._topY = Math.floor(this.height * this._bounds[0]);
		this._bottomY = Math.floor(this.height * this._bounds[1]);
		this.resolution = Math.floor(this.width / this.density);

		this.cols = Math.floor((this._rightX - this._leftX) / this.resolution);
		this.rows = Math.floor((this._bottomY - this._topY) / this.resolution);

		this._field_cached = false;
		this._field = Array.from({ length: this.cols }, () =>
			Array.from({ length: this.rows }, () => new Vector(0, 0))
		);
	}

	destroy() {
		this._field_cached = false;
		this._field = Array.from({ length: this.cols }, () =>
			Array.from({ length: this.rows }, () => new Vector(0, 0))
		);
	}

	setup(fn: ForceFieldFunction | null = null, t: number = 0) {
		if (t == 0 && this._field_cached) return this;

		for (let i = 0; i < this.cols; i++) {
			for (let j = 0; j < this.rows; j++) {
				const v: Vector = fn ? fn(this, i, j, t) : this.forceFieldFor(this, i, j, t);
				this._field[i][j] = v.mult(this.resolution);
			}
		}

		this._field_cached = t == 0;
		return this;
	}

	forceFieldFor(
		...[self, col, row, t]: Parameters<ForceFieldFunction>
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
		return (self: ForceField, col: number, row: number, t: number = 0) => {
			const vectors = forces.map((fn) => fn(self, col, row, t));
			const sum = vectors.reduce((acc, v) => acc.add(v), new Vector(0, 0));

			// Ensure minimum vector magnitude to prevent stagnation
			const minStrength = 0.005 * this.resolution;
			if (sum.mag() < minStrength) {
				// Fallback to averaged direction with minimum strength
				const avgAngle = vectors.reduce((acc, v) => acc + v.heading(), 0) / vectors.length;
				return Vector.fromAngle(avgAngle, minStrength);
			}
			return sum;
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
		strength = 1,
		timeSpeed = 0.1
	}: { scale?: number; strength?: number; timeSpeed?: number } = {}): ForceFieldFunction {
		return (self: ForceField, col: number, row: number, t: number = 0) => {
			const x = col * scale;
			const y = row * scale;
			const angle = self.p5!.map(self.p5!.noise(x, y, t * timeSpeed), 0, 1, 0, 2 * Math.PI);
			return Vector.fromAngle(angle, strength);
		};
	}

	radialPerlinNoiseField({
		strength = 1,
		scale = 0.015,
		timeSpeed = 0.1
	}: { strength?: number; scale?: number; timeSpeed?: number } = {}): ForceFieldFunction {
		return (self: ForceField, col: number, row: number, t: number = 0) => {
			const x = col - self.cols / 2;
			const y = row - self.rows / 2;
			const angle = self.p5!.noise(x * scale, y * scale, t * timeSpeed) * Math.PI * 2;
			return Vector.fromAngle(angle, strength);
		};
	}

	simplexNoiseField({
		scale = 0.001,
		strength = 1,
		timeSpeed = 0.1
	}: { scale?: number; strength?: number; timeSpeed?: number } = {}): ForceFieldFunction {
		const random = Random.seeded(this.r.random() * 1000000000000000);
		const noise = makeNoise3D(random);
		const [m, n] = [this.r.range(0, this.cols), this.r.range(0, this.rows)];
		return (self: ForceField, col: number, row: number, t: number = 0) => {
			const x = (col - m) * scale;
			const y = (row - n) * scale;
			const angle = noise(x, y, t * timeSpeed) * Math.PI * 2;
			return Vector.fromAngle(angle, strength);
		};
	}

	fractalSimplexNoiseField({
		scale = 0.015,
		strength = 1,
		octaves = 4,
		multiplier = 2,
		timeSpeed = 0.1
	}: {
		scale?: number;
		strength?: number;
		octaves?: number;
		multiplier?: number;
		timeSpeed?: number;
	} = {}): ForceFieldFunction {
		const random = Random.seeded(this.r.random() * 1000000000000000);
		const noise = makeNoise3D(random);
		const [m, n] = [this.r.range(0, this.cols), this.r.range(0, this.rows)];
		return (self: ForceField, col: number, row: number, t: number = 0) => {
			const x = (col - m) * scale;
			const y = (row - n) * scale;
			const angle = this._fractalNoiseAngles(noise, x, y, t * timeSpeed, octaves, multiplier);
			return Vector.fromAngle(angle, strength);
		};
	}

	fractalPerlinNoiseField({
		scale = 0.015,
		strength = 1,
		octaves = 4,
		multiplier = 2,
		timeSpeed = 0.1
	}: {
		scale?: number;
		strength?: number;
		octaves?: number;
		multiplier?: number;
		timeSpeed?: number;
	} = {}): ForceFieldFunction {
		const noise = this.p5!.noise;
		const [m, n] = [this.r.range(0, this.cols), this.r.range(0, this.rows)];
		return (self: ForceField, col: number, row: number, t: number = 0) => {
			const x = (col - m) * scale;
			const y = (row - n) * scale;
			const angle = this._fractalNoiseAngles(noise, x, y, t * timeSpeed, octaves, multiplier);
			return Vector.fromAngle(angle, strength);
		};
	}

	_fractalNoiseAngles(
		noise_fn: any,
		col: number,
		row: number,
		t: number = 0,
		octaves: number = 4,
		multiplier: number = 2
	) {
		let value = 0;
		let amplitude = 1;
		let frequency = 1;
		let wt = 0;
		for (let i = 0; i < octaves; i++) {
			value += noise_fn(col * frequency, row * frequency, t * frequency) * amplitude;
			wt += amplitude;
			amplitude *= multiplier;
			frequency /= multiplier;
		}
		return (value / wt) * Math.PI * 2;
	}

	repulsorFieldAt(
		x: number,
		y: number,
		strength: number = 3,
		timeSpeed: number = 0.1
	): ForceFieldFunction {
		const idx = this.indexFor(x, y);

		return (self: ForceField, i: number, j: number, t: number = 0) => {
			const dx = i - idx[0];
			const dy = j - idx[1];
			const distance = Math.sqrt(dx * dx + dy * dy);
			const decay = strength / Math.max(distance, 1) ** (1 / 3);
			const angle = Math.atan2(dy, dx);
			return Vector.fromAngle(angle, decay + t * timeSpeed);
		};
	}

	attractorFieldAt(
		x: number,
		y: number,
		strength: number = 1,
		timeSpeed: number = 0.1
	): ForceFieldFunction {
		return this.repulsorFieldAt(x, y, -strength, timeSpeed);
	}

	radialWaveAt(
		x: number,
		y: number,
		strength: number = 1,
		frequency: number = Math.PI,
		timeSpeed: number = 0.1
	): ForceFieldFunction {
		const idx = this.indexFor(x, y);
		return (self: ForceField, i: number, j: number, t: number = 0) => {
			const dx = i - idx[0];
			const dy = j - idx[1];
			const distance = Math.sqrt(dx * dx + dy * dy);
			const angle = Math.atan2(dy, dx);
			const wave = Math.sin(distance * frequency + t * timeSpeed) * strength;
			return Vector.fromAngle(angle, wave);
		};
	}

	randomField({ strength = 1, timeSpeed = 0.1 }: { strength?: number; timeSpeed?: number } = {}) {
		return (self: ForceField, i: number, j: number, t: number = 0) => {
			const angle = Math.random() * Math.PI * 2;
			return Vector.fromAngle(angle, strength + t * timeSpeed);
		};
	}

	waveField({
		strength = 4,
		frequency = 0.001,
		scale = 0.005,
		phase = 0,
		timeSpeed = 0.1
	}: {
		strength?: number;
		frequency?: number;
		scale?: number;
		phase?: number;
		timeSpeed?: number;
	} = {}) {
		return (self: ForceField, i: number, j: number, t: number = 0) => {
			// Base angle determined by Perlin noise, modified by randomness
			const noise = self.p5!.noise(i * scale, j * scale);
			const angle = self.p5!.map(noise, 0, 1, 0, Math.PI * 2);

			// Compute the wave's effect at this point
			const effect = i * Math.cos(angle) + j * Math.sin(angle);
			phase = effect * frequency + phase + t * timeSpeed;
			const wavePhase = (0.5 + Math.sin(phase)) * strength;

			// Convert the base angle and wave phase into a vector
			return Vector.fromAngle(angle).mult(wavePhase);
		};
	}

	moirePatternField({
		strength = 1,
		frequencyX = 0.01,
		frequencyY = 0.01,
		phase = 0,
		timeSpeed = 0.1
	}: {
		strength?: number;
		frequencyX?: number;
		frequencyY?: number;
		phase?: number;
		timeSpeed?: number;
	} = {}) {
		return (self: ForceField, i: number, j: number, t: number = 0) => {
			const waveX = Math.sin(i * frequencyX + phase + t * timeSpeed) * strength;
			const waveY = Math.sin(j * frequencyY + phase + t * timeSpeed) * strength;
			return new Vector(waveX, waveY);
		};
	}

	magneticFieldAt(
		northX: number,
		northY: number,
		southX: number,
		southY: number,
		{ strength = 1, timeSpeed = 0.1 }: { strength?: number; timeSpeed?: number } = {}
	) {
		const nIdx = this.indexFor(northX, northY);
		const sIdx = this.indexFor(southX, southY);

		return (self: ForceField, i: number, j: number, t: number = 0) => {
			const dxN = i - nIdx[0];
			const dyN = j - nIdx[1];
			const dxS = i - sIdx[0];
			const dyS = j - sIdx[1];

			const dR = dxN * dxN + dyN * dyN;
			strength = strength + t * timeSpeed;
			const forceFromNorth = Vector.fromAngle(Math.atan2(dyN, dxN), strength / dR);
			const forceFromSouth = Vector.fromAngle(Math.atan2(dyS, dxS), strength / dR);
			return Vector.add(forceFromNorth, forceFromSouth);
		};
	}

	gradientField({
		strength = 1,
		angle = 0,
		timeSpeed = 0.1
	}: { strength?: number; angle?: number; timeSpeed?: number } = {}) {
		const radians = (angle / 180) * Math.PI;
		return (self: ForceField, i: number, j: number, t: number = 0) => {
			return Vector.fromAngle(radians, strength + t * timeSpeed);
		};
	}
}
