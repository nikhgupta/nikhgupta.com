<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { utils } from '$lib';
	import { P5Element, P5Sketch } from '../../../../sketches/base';
	import { Header } from '$lib';
	import { goto } from '$app/navigation';
	import Drawer from './drawer.svelte';

	export let data;
	let frameRate = 0;
	let darkMode = false;
	let sketch: any = null;
	let dim: [number, number] = [0, 0];
	let hideHelp = true;
	let verbose = true;

	async function onResize() {
		sketch = null;
		const html = document.documentElement;
		dim = [html.offsetWidth, html.offsetHeight];
		darkMode = html.classList.contains('dark');
		sketch = await P5Sketch.loadAndRun(data.slug, { darkMode, frameRate, size: dim });
	}

	// $: data.sketch && goto(`/sketches/${data.sketch}`);
	$: $page.url.pathname && browser && onResize();

	onMount(() => {
		if (browser) {
			window.addEventListener(
				'resize',
				utils.debounce(async () => await onResize(), 100)
			);
			document.body.classList.add('!w-full');
		}

		return () => {
			if (browser) {
				document.body.classList.remove('!w-full');
				window.removeEventListener('resize', onResize);
			}
		};
	});

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.altKey || e.shiftKey || e.ctrlKey || e.metaKey) return;

		const recognized = ['Space', 'Slash', 'Enter', 'KeyR', 'KeyM', 'KeyD', 'Equal', 'Minus'];
		if (!recognized.includes(e.code)) return;

		e.preventDefault();
		if (e.code === 'Space') {
			onResize();
		} else if (e.code === 'KeyM') {
			verbose = !verbose;
		} else if (e.code === 'KeyD') {
			utils.toggleDarkMode(-1);
		} else if (e.code === 'KeyR') {
			frameRate = 0;
			onResize();
		} else if (e.code === 'Equal') {
			frameRate += 1;
			onResize();
		} else if (e.code === 'Minus') {
			frameRate -= 1;
			onResize();
		} else if (e.code === 'Enter') {
			const nextSketch = P5Sketch.nextSketchName(data.slug);
			sketch = null;
			goto(`/sketches/${nextSketch}`).then(onResize);
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
