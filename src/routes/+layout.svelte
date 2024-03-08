<script lang="ts">
	import '../app.scss';
	import 'highlight.js/styles/nord.css';
	import { Header, Footer } from '$lib';

	import { page } from '$app/stores';
	$: activeUrl = $page.url.pathname;

	import { onMount } from 'svelte';
	import P5Element, { HomeSketch } from '../sketches/home';
	const sketch = HomeSketch.run({ darkMode: false });

	onMount(() => {
		const body = document.querySelector('body');
		if (body) {
			body.classList.add('!w-full');
		}

		return () => {
			if (body) body.classList.remove('!w-full');
		};
	});
</script>

<div class="flex">
	<div
		id="main-wrapper"
		class="mx-8 md:mx-16 xl:mx-24 flex flex-col h-screen max-w-5xl xl:min-w-5xl"
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
		<P5Element {sketch} />
	</div>
</div>
