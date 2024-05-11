/**
 * copied almost directly from Mersenne Twister implementation found in https://gist.github.com/banksean/300494
 * all rights reserved to him.
 */

export const str2hashnum = (s: string | null) => {
	if (!s) return 0;
	var hash = 0;

	let i: number;
	for (i = 0; i < s.length; i++) {
		hash = (hash << 5) - hash + s.charCodeAt(i);
		hash = hash & hash; // prevent overflow from happening
	}
	return hash & 0xffff; // returns lower 16-bit of hash value
};

export const randomSeedFrom = (s: string | null = null) => {
	return s && s.length > 0 ? str2hashnum(s) : Math.round(Math.random() * 1000000000000000);
};

export class Random {
	seed: number;
	_r: () => number;

	constructor(seed: number | null = null) {
		if (seed == null) {
			seed = new Date().getTime();
		}

		this.seed = seed;
		this._r = Random.seeded(seed);
	}

	static seeded(s: number) {
		var mask = 0xffffffff;
		var m_w = (123456789 + s) & mask;
		var m_z = (987654321 - s) & mask;

		return function () {
			m_z = (36969 * (m_z & 65535) + (m_z >>> 16)) & mask;
			m_w = (18000 * (m_w & 65535) + (m_w >>> 16)) & mask;

			var result = ((m_z << 16) + (m_w & 65535)) >>> 0;
			result /= 4294967296;
			return result;
		};
	}

	random(): number {
		return this._r();
	}

	range(from: number, to: number): number {
		return from + (to - from) * this.random();
	}

	choose(arr: any[]): any {
		return arr[Math.floor(this.random() * arr.length)];
	}

	shuffle<T>(arr: T[]): T[] {
		let result = arr.slice();
		for (let i = result.length - 1; i > 0; i--) {
			const j = Math.floor(this.random() * (i + 1));
			[result[i], result[j]] = [result[j], result[i]];
		}
		return result;
	}

	binomial(): number {
		let u = 0,
			v = 0;
		while (u === 0) u = this._r(); //Converting [0,1) to (0,1)
		while (v === 0) v = this._r();
		let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
		num = num / 10.0 + 0.5; // Translate to 0 -> 1
		if (num > 1 || num < 0) return this.binomial(); // resample between 0 and 1
		return num;
	}
}
