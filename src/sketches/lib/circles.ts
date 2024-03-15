import { Random } from '$lib/random';
import type { p5 } from 'p5-svelte';

export class Circle {
	x: number;
	y: number;
	r: number;
	growing: boolean;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
		this.r = 1; // Start with a small radius
		this.growing = true;
	}

	grow() {
		if (this.r >= 32) this.growing = false;
		if (this.growing) {
			this.r += 1; // Increase the radius
		}
	}

	edges(w: number, h: number, b: [number, number]) {
		return (
			this.x + this.r > w * b[1] ||
			this.x - this.r < w * b[0] ||
			this.y + this.r > h * b[1] ||
			this.y - this.r < w * b[0]
		);
	}

	outsideViewport(w: number, h: number) {
		return this.edges(w, h, [0, 1]);
	}

	randomPoint(rand: any): [number, number] {
		const angle = rand.range(0, 2 * Math.PI);
		const x_point = this.x + Math.cos(angle) * this.r;
		const y_point = this.y + Math.sin(angle) * this.r;
		return [x_point, y_point];
	}
}

export class CirclePacker {
	seed: number;
	w: number;
	h: number;
	bounds: [number, number];

	r: Random;
	count: number;
	attempts: number;
	circles: Circle[];
	movement: [[number, number], [number, number], boolean];

	constructor(
		seed: number,
		w: number,
		h: number,
		bounds: [number, number],
		{ count = 1000, attempts = 5000 }: { count: number; attempts: number }
	) {
		this.seed = seed;
		this.w = w;
		this.h = h;
		this.bounds = bounds;

		this.count = count;
		this.attempts = attempts;
		this.circles = [];

		this.r = new Random(this.seed);

		const vertical = this.r.random() > 0.5;
		this.movement = [
			vertical ? [this.r.range(0, w), 0] : [0, this.r.range(0, h)],
			vertical ? [this.r.range(0, w), h] : [w, this.r.range(0, h)],
			this.r.random() > 0.5
		];
	}

	add() {
		let valid = true;
		let x = this.r.range(this.bounds[0] * this.w, this.bounds[1] * this.w);
		let y = this.r.range(this.bounds[0] * this.h, this.bounds[1] * this.h);

		for (let i = 0; i < this.circles.length; i++) {
			let other = this.circles[i];
			let d = ((other.y - y) ** 2 + (other.x - x) ** 2) ** 0.5;
			if (d <= other.r) {
				valid = false;
				break;
			}
		}

		return valid ? new Circle(x, y) : null;
	}

	setup() {
		let attempts = 0;
		while (this.circles.length < this.count && attempts < this.attempts) {
			let newCircle = this.add();
			if (newCircle !== null) {
				this.circles.push(newCircle);
			}
			attempts++;
		}

		return this;
	}

	show(p5: p5, color: any) {
		p5.stroke(color);
		p5.noFill();
		for (let c of this.circles) {
			p5.ellipse(c.x, c.y, 2 * c.r);
		}
	}

	overlapping(c: Circle) {
		for (let other of this.circles) {
			if (other === c) continue;
			let d = ((other.y - c.y) ** 2 + (other.x - c.x) ** 2) ** 0.5;
			if (d - 2 <= c.r + other.r) {
				return true;
			}
		}
		return false;
	}

	growCircles() {
		for (let c of this.circles) {
			if (c.growing) {
				if (c.edges(this.w, this.h, this.bounds) || this.overlapping(c)) {
					c.growing = false;
				}
			}
			c.grow();
		}

		return this.circles.some((c) => c.growing);
	}

	growCirclesIndefinitely() {
		while (this.growCircles()) {}
		return this;
	}

	randomPoint(): [number, number] {
		return this.r.choose(this.circles).randomPoint(this.r);
	}

	randomPoints(n: number): [number, number][] {
		return this.randomPointsInBounds(n, { x: [0, 1], y: [0, 1] });
	}

	randomPointInBounds({
		x = null,
		y = null,
		invert = false,
		visible = false
	}: {
		x?: [number, number] | null;
		y?: [number, number] | null;
		invert?: boolean;
		visible?: boolean;
	} = {}): [number, number] {
		return this.randomPointsInBounds(1, { x, y, invert, visible })[0];
	}

	randomPointsInBounds(
		n: number,
		{
			x = null,
			y = null,
			invert = false,
			visible = false
		}: {
			x?: [number, number] | null;
			y?: [number, number] | null;
			invert?: boolean;
			visible?: boolean;
		} = {}
	): [number, number][] {
		return Array.from({ length: n }, () => {
			let filteredCircles = this.circles.filter((c) => {
				if (visible && c.outsideViewport(this.w, this.h)) return false;

				let inX = x == null ? true : c.x + c.r >= x[0] && c.x - c.r <= x[1];
				let inY = y == null ? true : c.y + c.r >= y[0] && c.y - c.r <= y[1];
				let valid = inX && inY;
				return invert ? !valid : valid;
			});

			let c = this.r.choose(filteredCircles.length === 0 ? this.circles : filteredCircles);
			return c.randomPoint(this.r);
		});
	}

	randomPointInMovingWindow(progress: number): [number, number] {
		return this.randomPointsInMovingWindow(progress, 1)[0];
	}

	randomPointsInMovingWindow(progress: number, n: number = 1): [number, number][] {
		const window = this.currentWindow(progress);
		return this.randomPointsInBounds(n, { x: window[0], y: window[1] });
	}

	currentWindow(progress: number): [[number, number], [number, number]] {
		const [[startX, startY], [endX, endY], isForward] = this.movement;

		let lineX = progress * (endX - startX) * (isForward ? 1 : -1);
		let lineY = progress * (endY - startY) * (isForward ? 1 : -1);

		return [
			[-this.w * 0.25 + lineX, this.w * 1.25 + lineX],
			[-this.h * 0.25 + lineY, this.h * 1.25 + lineY]
		];
	}

	randomPointFreeForm(progress: number): [number, number] {
		let window = this.currentWindow(progress);
		return this.randomPointInBounds({ x: window[0], y: window[1], invert: true, visible: true });
	}

	showMovement(p5: p5, color: any) {
		p5.stroke(color);
		p5.strokeWeight(2);
		p5.line(this.movement[0][0], this.movement[0][1], this.movement[1][0], this.movement[1][1]);
	}
}
