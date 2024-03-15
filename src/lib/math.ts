import { range } from './utils';
type POINT = [number, number, boolean];

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
