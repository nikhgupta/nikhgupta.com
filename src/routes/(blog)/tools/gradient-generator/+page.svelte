<script lang="ts">
	import { Range, Label, Helper } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import type ApexCharts from 'apexcharts';

	import { modeOklch, useMode, formatHex, clampChroma } from 'culori/fn';
	const lch = useMode(modeOklch);

	import { utils } from '$lib';
	import { Color } from '$lib/colors';

	type WAVEFORM = [number, number, number, number];

	let lightness: WAVEFORM = [0.35, 0.6, -0.25, 0.0]; // range from 0.95 to 0.35
	let chroma: WAVEFORM = [0.2, -0.15, 0.25, 0];
	let hue: WAVEFORM = [0.25, -0.6, 0.25, -0.25];

	const n = 200;
	const clamp = [-3, 3, -3, 3];
	let chart: ApexCharts;
	let chartContainer: HTMLDivElement;

	const stepMap = (fn: (idx: number, x: number) => number) => {
		return Array.from({ length: n }, (_, i) => fn(i, i / n));
	};

	onMount(async () => {
		const ApexCharts = (await import('apexcharts')).default;
		chart = new ApexCharts(chartContainer, options);
		chart.render();
	});

	const sinewave = (
		x: number,
		clamp: boolean,
		dc: number,
		amp: number,
		freq: number,
		phase: number
	) => {
		[freq, phase] = [freq, phase].map((v) => v * Math.PI * 2);
		const v = amp * Math.cos(freq * x + phase) + dc;
		return clamp ? Math.max(0, Math.min(1, v)) : v % 1 < 0 ? 1 + (v % 1) : v % 1;
	};

	const hueWave = (x: number) => sinewave(x, false, ...hue);
	const lightnessWave = (x: number) => sinewave(x, true, ...lightness);
	const chromaWave = (x: number, l: number) => {
		const c = sinewave(x, true, ...chroma);
		// const maxC = Color.maxChromaValueForLightness(l);
		// return Math.min(c, maxC);
		return c;
	};

	const updateMap = (key: string, idx: number, e: Event) => {
		utils.debounce(() => {
			const value = (e.target as HTMLInputElement)?.value;
			if (key === 'l') {
				lightness = lightness.map((v, i) => (i === idx ? parseFloat(value) : v)) as WAVEFORM;
			} else if (key === 'c') {
				chroma = chroma.map((v, i) => (i === idx ? parseFloat(value) : v)) as WAVEFORM;
			} else if (key === 'h') {
				hue = hue.map((v, i) => (i === idx ? parseFloat(value) : v)) as WAVEFORM;
			}
		}, 40)();
	};

	$: lMap = lightness && stepMap((_, x) => lightnessWave(x));
	$: cMap = chroma && stepMap((i, x) => chromaWave(x, lMap[i]));
	$: hMap = hue && stepMap((_, x) => hueWave(x));
	$: options = {
		chart: {
			id: 'gradient-chart',
			type: 'line',
			height: 400,
			animate: { enabled: false }
		},
		series: [
			{ name: 'lightness', data: lMap, color: '#00000088' },
			{ name: 'chroma', data: cMap, color: '#ff000088' },
			{ name: 'hue', data: hMap, color: '#0000ff88' }
		],
		yaxis: {
			min: 0,
			max: 1,
			labels: {
				formatter: function (v: number) {
					return Math.round(v * 100) / 100;
				}
			}
		},
		xaxis: {
			categories: stepMap((_, x) => x),
			labels: {
				formatter: function (v: number) {
					return '';
				}
			}
		}
	};
	$: chart?.updateSeries(
		[
			{ name: 'lightness', data: lMap },
			{ name: 'chroma', data: cMap },
			{ name: 'hue', data: hMap }
		],
		true
	);
	$: colors = Array.from({ length: n }, (_, i) => {
		// const color = lch({ l: lMap[i], c: cMap[i], h: hMap[i] * 360 });
		const color = new Color(lMap[i], cMap[i], hMap[i] * 360);
		return color;
	});

	const onKeyDown = () => {};
</script>

<svelte:head>
	<title>Generating Gradients using OKLCH colorspace | Nikhil Gupta</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content="Generating Gradients using OKLCH colorspace" />
	<meta
		property="description"
		content="A tool to generate uniform gradients using OKLCH colorspace"
	/>
</svelte:head>

<h2 class="post-title">Generating Gradients using OKLCH colorspace</h2>

<div class="grid grid-cols-3 md:grid-cols-9 gap-4">
	<div class="mb-6 col-span-3">
		<h3>Hue</h3>
		<div id="hue-sliders">
			<div id="hue-dc-offset">
				<Label>DC offset: {hue[0].toFixed(2)}</Label>
				<input
					type="range"
					value={hue[0]}
					min={clamp[0]}
					max={clamp[1]}
					step={0.01}
					on:change={(e) => updateMap('h', 0, e)}
					style="width: 100%"
				/>
			</div>
			<div id="hue-amp">
				<Label>Amp: {hue[1].toFixed(2)}</Label>
				<input
					type="range"
					value={hue[1]}
					min={clamp[0]}
					max={clamp[1]}
					step={0.01}
					on:change={(e) => updateMap('h', 1, e)}
					style="width: 100%"
				/>
			</div>
			<div id="hue-freq">
				<Label>Freq: {hue[2].toFixed(2)}</Label>
				<input
					type="range"
					value={hue[2]}
					min={clamp[2]}
					max={clamp[3]}
					step={0.01}
					on:change={(e) => updateMap('h', 2, e)}
					style="width: 100%"
				/>
			</div>
			<div id="hue-phase">
				<Label>Phase: {hue[3].toFixed(2)}</Label>
				<input
					type="range"
					value={hue[3]}
					min={clamp[2]}
					max={clamp[3]}
					step={0.01}
					on:change={(e) => updateMap('h', 3, e)}
					style="width: 100%"
				/>
			</div>
		</div>
	</div>
	<div class="mb-6 col-span-3">
		<h3>Lightness</h3>
		<div id="lightness-sliders">
			<div id="lightness-dc-offset">
				<Label>DC offset: {lightness[0].toFixed(2)}</Label>
				<input
					type="range"
					value={lightness[0]}
					min={clamp[0]}
					max={clamp[1]}
					step={0.01}
					on:change={(e) => updateMap('l', 0, e)}
					style="width: 100%"
				/>
			</div>
			<div id="lightness-amp">
				<Label>Amp: {lightness[1].toFixed(2)}</Label>
				<input
					type="range"
					value={lightness[1]}
					min={clamp[0]}
					max={clamp[1]}
					step={0.01}
					on:change={(e) => updateMap('l', 1, e)}
					style="width: 100%"
				/>
			</div>
			<div id="lightness-freq">
				<Label>Freq: {lightness[2].toFixed(2)}</Label>
				<input
					type="range"
					value={lightness[2]}
					min={clamp[2]}
					max={clamp[3]}
					step={0.01}
					on:change={(e) => updateMap('l', 2, e)}
					style="width: 100%"
				/>
			</div>
			<div id="lightness-phase">
				<Label>Phase: {lightness[3].toFixed(2)}</Label>
				<input
					type="range"
					value={lightness[3]}
					min={clamp[2]}
					max={clamp[3]}
					step={0.01}
					on:change={(e) => updateMap('l', 3, e)}
					style="width: 100%"
				/>
			</div>
		</div>
	</div>

	<div class="mb-6 col-span-3">
		<h3>Chroma</h3>
		<div id="chroma-sliders">
			<div id="chroma-dc-offset">
				<Label>DC offset: {chroma[0].toFixed(2)}</Label>
				<input
					type="range"
					value={chroma[0]}
					min={clamp[0]}
					max={clamp[1]}
					step={0.01}
					on:change={(e) => updateMap('c', 0, e)}
					style="width: 100%"
				/>
			</div>
			<div id="chroma-amp">
				<Label>Amp: {chroma[1].toFixed(2)}</Label>
				<input
					type="range"
					value={chroma[1]}
					min={clamp[0]}
					max={clamp[1]}
					step={0.01}
					on:change={(e) => updateMap('c', 1, e)}
					style="width: 100%"
				/>
			</div>
			<div id="chroma-freq">
				<Label>Freq: {chroma[2].toFixed(2)}</Label>
				<input
					type="range"
					value={chroma[2]}
					min={clamp[2]}
					max={clamp[3]}
					step={0.01}
					on:change={(e) => updateMap('c', 2, e)}
					style="width: 100%"
				/>
			</div>
			<div id="chroma-phase">
				<Label>Phase: {chroma[3].toFixed(2)}</Label>
				<input
					type="range"
					value={chroma[3]}
					min={clamp[2]}
					max={clamp[3]}
					step={0.01}
					on:change={(e) => updateMap('c', 3, e)}
					style="width: 100%"
				/>
			</div>
		</div>
	</div>
</div>

<div class="flex mt-2 mb-8">
	{#each colors as c}
		<button
			class="w-full h-16 flex items-center justify-center"
			style="background-color: {c instanceof Color ? c.toHex() : formatHex(c)}"
		/>
	{/each}
</div>
<div bind:this={chartContainer} class="flex justify-center items-center min-h-96">
	loading graph...
</div>

<svelte:window on:keydown={onKeyDown} />
