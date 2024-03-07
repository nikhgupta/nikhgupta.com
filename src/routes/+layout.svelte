<script>
	import '../app.scss';
	import 'highlight.js/styles/nord.css';
	import { Header, Footer } from '$lib';

	import { page } from '$app/stores';
	$: activeUrl = $page.url.pathname;
</script>

<div class="mx-8 md:mx-16 xl:mx-24 flex flex-col h-screen">
	<Header />

	<main class="flex {activeUrl == '/' ? 'justify-center' : 'pt-8 md:pt-12'} flex-col grow">
		{#if activeUrl == '/'}
			<a href="/" class="no-underline logo font-shalimar h1">Nikhil Gupta</a>
		{/if}

		<slot />
	</main>

	<Footer />
</div>
