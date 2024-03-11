import { P5Sketch, P5Element } from './base';
import type { P5SketchArguments } from './base';
import type { p5 } from 'p5-svelte';
import { Vector } from 'p5';
import { FlowFieldParticle } from './lib/flowfieldParticle';

export default P5Element;

export class CurrentSketch extends P5Sketch {
	particles: FlowFieldParticle[];
	vectorField: Vector[][];
	noiseScale: number;

	constructor(params: P5SketchArguments) {
		super(params);
		this.particles = [];
		this.vectorField = [];
		this.noiseScale = 0.6; // Adjust for more or less detailed noise
	}

	draw(p5: p5) {
		p5.frameRate(30);
		this.onDraw(p5);
	}

	onSetup(p5: p5) {
		super.onSetup(p5);
		this.initVectorField(p5);
		this.initParticles(p5, 1000); // Adjust number of particles for density
	}

	onDraw(p5: p5) {
		p5.background(this.bgColor()); // Slight alpha for motion blur effect
		this.updateVectorField(p5);
		this.particles.forEach((particle) => {
			particle.follow(p5, this.vectorField);
			particle.update();
			particle.edges(p5);
			particle.show(p5, this.fgColor());
		});
	}

	initVectorField(p5: p5) {
		for (let x = 0; x < this.dim[0]; x += 20) {
			// Adjust step size for more or less density
			let column = [];
			for (let y = 0; y < this.dim[1]; y += 20) {
				const angle = p5.noise(x * this.noiseScale, y * this.noiseScale) * p5.TWO_PI * 2;
				const vector = p5.createVector(p5.cos(angle), p5.sin(angle));
				column.push(vector);
			}
			this.vectorField.push(column);
		}
	}

	updateVectorField(p5: p5) {
		for (let x = 0; x < this.vectorField.length; x++) {
			for (let y = 0; y < this.vectorField[x].length; y++) {
				const angle =
					p5.noise(x * this.noiseScale, y * this.noiseScale, p5.frameCount * 0.01) * p5.TWO_PI * 2;
				this.vectorField[x][y].set(p5.cos(angle), p5.sin(angle));
			}
		}
	}

	initParticles(p5: p5, count: number) {
		for (let i = 0; i < count; i++) {
			this.particles.push(new FlowFieldParticle(p5));
		}
	}
}
