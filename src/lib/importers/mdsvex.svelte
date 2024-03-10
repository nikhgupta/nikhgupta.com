<script lang="ts">
	import { utils } from '$lib';
	import type { types } from '$lib';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	export let data: types.PageData;

	let keywords = data.metadata.keywords;
	if (!keywords && data.metadata.categories) keywords = data.metadata.categories.join(', ');

	import P5Element, { CurrentSketch } from '../../sketches/mondrian';

	let darkMode = false;
	let sketch: any = null;

	function onResize() {
		const html = document.documentElement;
		darkMode = html.classList.contains('dark');
		sketch = CurrentSketch.run({
			darkMode,
			frameRate: 0,
			size: [960, 384]
		});
	}

	onMount(() => {
		if (browser) onResize();
	});
</script>

<!-- SEO -->
<svelte:head>
	<title>{data.metadata.title} | Nikhil Gupta</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.metadata.title} />
	{#if keywords}<meta property="keywords" content={keywords} />{/if}
	{#if data.metadata.description}
		<meta property="description" content={data.metadata.description} />
		<meta property="og:description" content={data.metadata.description} />
	{/if}
</svelte:head>

<article>
	<!-- Title -->
	<hgroup>
		<h1>{data.metadata.title}</h1>
		{#if data.metadata.date}
			<p class="text-hint">Published on {utils.formatDate(data.metadata.date)}</p>
		{/if}
	</hgroup>

	<!-- Tags -->
	{#if data.metadata.categories && data.metadata.categories.length > 0}
		<div class="tags">
			{#each data.metadata.categories as category}
				<span class="mr-3">
					<a href="/categories/{category}">&num;{category}</a>
				</span>
			{/each}
		</div>
	{/if}

	<!-- Post -->
	<div class="prose">
		<svelte:component this={data.content} snippets={data.snippets} />
	</div>
</article>

<hr />

{#if sketch}
	<div class="my-8 min-w-[960px] min-h-[384px]"><P5Element {sketch} /></div>
{/if}
