import p5 from 'p5';

export class FlowFieldParticle {
	position: p5.Vector;
	velocity: p5.Vector;
	acceleration: p5.Vector;
	maxSpeed: number;

	constructor(p5: p5) {
		this.position = p5.createVector(p5.random(p5.width), p5.random(p5.height));
		this.velocity = p5.createVector(0, 0);
		this.acceleration = p5.createVector(0, 0);
		this.maxSpeed = 4; // Adjust for faster or slower particles
	}

	update() {
		this.velocity.add(this.acceleration);
		this.velocity.limit(this.maxSpeed);
		this.position.add(this.velocity);
		this.acceleration.mult(0);
	}

	follow(p5: p5, vectors: p5.Vector[][]) {
		let x = Math.floor(this.position.x / 20); // Match the scale used in vector field
		let y = Math.floor(this.position.y / 20);
		let index = x + y * Math.floor(p5.width / 20); // Adjust if using a different scale
		let force = vectors[x][y];
		this.applyForce(force);
	}

	applyForce(force: p5.Vector) {
		this.acceleration.add(force);
	}

	show(p5: p5, fgColor: string) {
		p5.stroke(fgColor);
		p5.strokeWeight(4); // Adjust for thicker or thinner lines
		p5.point(this.position.x, this.position.y);
	}

	edges(p5: p5) {
		if (this.position.x > p5.width) this.position.x = 0;
		if (this.position.x < 0) this.position.x = p5.width;
		if (this.position.y > p5.height) this.position.y = 0;
		if (this.position.y < 0) this.position.y = p5.height;
	}
}
