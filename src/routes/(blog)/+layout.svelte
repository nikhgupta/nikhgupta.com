<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	$: activeUrl = $page.url.pathname;

	import '../../app.scss';
	import 'highlight.js/styles/nord.css';
	import { Header, Footer, utils } from '$lib';

	import { onMount } from 'svelte';
	import P5Element, { HomeSketch } from '../../sketches/home';

	let darkMode = false;
	let sketch: any = null;
	let dim: [number, number] = [0, 0];

	function onResize() {
		const html = document.documentElement;
		dim = [html.offsetWidth, html.offsetHeight];
		darkMode = html.classList.contains('dark');
		sketch = HomeSketch.run({ darkMode, frameRate: 0 });
	}

	$: $page.url.pathname && browser && onResize();

	onMount(() => {
		if (browser) {
			window.addEventListener('resize', utils.debounce(onResize, 100));
			document.body.classList.add('!w-full');
		}

		return () => {
			if (browser) {
				document.body.classList.remove('!w-full');
				window.removeEventListener('resize', onResize);
			}
		};
	});
</script>

<svelte:head>
	{#if import.meta.env.PROD}
		<script async src="https://www.googletagmanager.com/gtag/js?id=G-9F5T1QQ1GV"></script>
		<script>
			window.dataLayer = window.dataLayer || [];
			function gtag() {
				dataLayer.push(arguments);
			}
			gtag('js', new Date());

			gtag('config', 'G-9F5T1QQ1GV');
		</script>
	{/if}
</svelte:head>

<div class="flex">
	<div
		id="main-wrapper"
		class="px-8 md:px-16 xl:px-24 flex flex-col h-screen w-full lg:max-w-6xl xl:min-w-6xl"
	>
		<Header />

		<main class="flex {activeUrl == '/' ? 'justify-center' : 'pt-8 md:pt-12'} flex-col grow">
			{#if activeUrl == '/'}
				<a href="/" class="no-underline logo font-shalimar h1">Nikhil Gupta</a>
			{/if}

			<slot />
		</main>

		<Footer />
	</div>

	<div id="global-sketch" class="hidden xl:flex xl:shrink-0 justify-center items-center">
		{#key dim}{#if sketch}<P5Element {sketch} />{/if}{/key}
	</div>
</div>
