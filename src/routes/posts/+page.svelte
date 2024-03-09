<script lang="ts">
	import { utils } from '$lib';
	import { Badge } from 'flowbite-svelte';

	export let data;
</script>

<svelte:head>
	<title>Posts | Nikhil Gupta</title>
</svelte:head>

<div class="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-16">
	<div>
		<h1 class="">Some blog posts..</h1>
		<section>
			<ul class="posts list-none">
				{#each data.posts as post}
					<li class="post mb-4">
						<small class="mr-3">on {utils.formatDate(post.date)}</small> <br />
						<a href="/posts/{post.slug}" class="title">{post.title}</a>
						{#if !post.published}<Badge color="red" class="ml-1">Draft</Badge>{/if}
					</li>
				{/each}
			</ul>
		</section>
	</div>

	<div>
		<h1 class="">and, tools I authored..</h1>
		<ul class="posts list-none">
			<li class="post">
				<small class="mr-3">on Mar 8, 2024</small><br />
				<a href="/tools/palette-generator" class="title">OKLCH Color Palette Generator</a>
			</li>
		</ul>
	</div>
</div>
