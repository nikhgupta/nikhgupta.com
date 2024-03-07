<script lang="ts">
	import { utils } from '$lib';

	export let data;
</script>

<svelte:head>
	<title>Posts | Nikhil Gupta</title>
</svelte:head>

<h1>Published Posts</h1>
<section>
	<ul class="posts list-none">
		{#each data.posts as post}
			<li class="post mb-8">
				<small>on {utils.formatDate(post.date)}</small><br />
				<a href="/posts/{post.slug}" class="title">{post.title}</a><br />
				<span class="description">
					{post.description}
				</span>
			</li>
		{/each}
	</ul>
</section>

<h1>Published Tools</h1>
<ul class="posts list-none">
	<li class="post">
		<a href="/tools/palette-generator" class="title">OKLCH Color Palette Generator</a>
	</li>
</ul>
