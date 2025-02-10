<script lang="ts">
	import { page } from '$app/stores';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { utils } from '$lib';
	import { P5Element, P5Sketch } from '../../../../../sketches/base';
	import { Header } from '$lib';
	import { goto } from '$app/navigation';
	import Drawer from './drawer.svelte';
	import { randomSeedFrom } from '$lib/random';
	import type { Sketch } from 'p5-svelte';

	export let data;
	let seed = data.seed;
	let frameRate = 0;
	let darkMode = false;
	let sketch: Sketch | null = null;
	let dim: [number, number] = [0, 0];
	let hideHelp = true;
	let verbose = true;

	async function onResize() {
		destroyCurrent();

		const html = document.documentElement;
		dim = [html.offsetWidth, html.offsetHeight];
		darkMode = html.classList.contains('dark');
		sketch = await P5Sketch.loadAndRun(data.slug, {
			darkMode,
			frameRate,
			size: dim,
			seed
		});
	}

	// $: data.sketch && goto(`/sketches/${data.sketch}`);
	$: $page.url.pathname && browser && onResize();

	let p5ref: any = undefined;

	onMount(() => {
		if (browser) {
			window.addEventListener(
				'resize',
				utils.debounce(async () => await onResize(), 100)
			);
			document.body.classList.add('!w-full');
		}

		return () => {};
	});

	const destroyCurrent = () => {
		if (p5ref) {
			p5ref.remove();
			p5ref = undefined;
		}

		if (browser) {
			// @ts-ignore
			window._p5Instance = undefined;
			document.body.classList.remove('!w-full');
			window.removeEventListener('resize', onResize);
		}

		sketch = null;
	};

	onDestroy(destroyCurrent);

	const saveAndDownload = () => {
		const p5Instance = window._p5Instance;
		if (!p5Instance) return;

		const canvas = p5Instance.canvas as HTMLCanvasElement;
		const dataUrl = canvas.toDataURL('image/png');
		const link = document.createElement('a');
		link.download = `sketch-${data.slug}-${seed}.png`;
		link.href = dataUrl;
		link.click();
		URL.revokeObjectURL(dataUrl);
	};

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.altKey || e.shiftKey || e.ctrlKey || e.metaKey) return;

		const recognized = [
			'Space',
			'Slash',
			'Enter',
			'KeyR',
			'KeyM',
			'KeyD',
			'KeyS',
			'Equal',
			'Minus'
		];
		if (!recognized.includes(e.code)) return;

		e.preventDefault();
		if (e.code === 'Space') {
			destroyCurrent();
			seed = randomSeedFrom();
			if (browser) {
				window.location.href = `/sketches/${data.slug}/${seed}`;
			}
		} else if (e.code === 'KeyM') {
			verbose = !verbose;
		} else if (e.code === 'KeyD') {
			utils.toggleDarkMode(-1);
			onResize();
		} else if (e.code === 'KeyR') {
			frameRate = 0;
			onResize();
		} else if (e.code === 'KeyS') {
			saveAndDownload();
		} else if (e.code === 'Equal') {
			frameRate += 1;
			onResize();
		} else if (e.code === 'Minus') {
			frameRate = Math.max(-1, frameRate - 1);
			onResize();
		} else if (e.code === 'Enter') {
			const nextSketch = P5Sketch.nextSketchName(data.slug);
			sketch = null;
			goto(`/sketches/${nextSketch}/${seed}`).then(onResize);
		} else if (e.code === 'Slash') {
			hideHelp = !hideHelp;
		}
	};
</script>

<svelte:head>
	<title>{data.slug} - P5.js Sketch Viewer | Nikhil Gupta</title>
	<meta name="description" content="A collection of P5.js sketches by Nikhil Gupta." />
</svelte:head>

<div class="px-8 md:px-16 xl:px-24 flex flex-col h-screen w-full lg:max-w-6xl xl:min-w-6xl">
	<Header hideNav={true} summary={data.slug.length > 0 ? `is showcasing ${data.slug}` : ''} />
	<span>
		{#if !sketch}
			Loading Sketch...
		{:else if verbose}
			Press Slash to view keyboard shortcuts. Press M to hide this message.
			{#if frameRate != 0}Current FR: {frameRate}{/if}
		{/if}
	</span>
</div>

<div id="main-wrapper"></div>

{#key dim}
	{#if sketch}
		<div class="absolute top-0 left-0 w-full h-full z-[-1]"><P5Element {sketch} /></div>
	{/if}
{/key}

<Drawer {hideHelp} />
<svelte:window on:keydown={onKeyDown} />
