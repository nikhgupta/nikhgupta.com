import fs from 'fs';
import path from 'path';
type POINT = [number, number, boolean];

const N = 1000000 * 2.4;

export function* range(start: number, stop: number | null = null, step: number = 1) {
	if (stop == null) [stop, start] = [start, 0];
	if (start > stop) return;

	for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
		yield i;
	}
}

export const primeSeive = (n: number) => {
	const pts: Map<number, POINT> = new Map(
		Array.from({ length: n }).map((x, i) => [i, [0, 0, true]])
	);

	for (const [i, v] of pts) {
		[v[0], v[1]] = [i * Math.cos(i), i * Math.sin(i)];
		if (i == 1) v[2] = false;
		if (i == 1 || i * i > n) continue;
		for (let k of range(i * i, n, i)) {
			const pt = pts.get(k);
			if (pt && pt[2]) pts.set(k, [pt[0], pt[1], false]);
		}
	}

	return pts;
};

let outputPath = path.join('src', 'lib', 'data', 'primeSeive.json');
outputPath = path.relative(process.cwd(), outputPath);

if (!fs.existsSync(outputPath)) {
	const n = Math.round(N);
	console.log(`generating prime seive upto ${n}...`);
	const primes = primeSeive(n);

	// Path where the JSON will be saved, adjust according to your project structure
	console.log(outputPath);

	// Write the prime data to a JSON file
	fs.writeFile(outputPath, JSON.stringify([...primes.entries()]), (err) => {
		if (err) throw err;
		console.log('The prime data has been generated!');
	});
}
