<script lang="ts">
	import { utils } from '$lib';

	export let data;
</script>

<svelte:head>
	<title>Posts | Nikhil Gupta</title>
</svelte:head>

<h1>Published Posts</h1>

<!-- Posts -->
<section>
	<ul class="posts list-none">
		{#each data.posts as post}
			<li class="post">
				<a href="/posts/{post.slug}" class="title">{post.title}</a>
				<p class="date">{utils.formatDate(post.date)}</p>
				<p class="description">{post.description}</p>
			</li>
		{/each}
	</ul>
</section>
