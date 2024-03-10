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
		<h1 class="">#{data.slug}</h1>
		<section>
			<ul class="posts list-none">
				{#each data.posts as post}
					<li class="post mb-4">
						<small class="mr-3">on {utils.formatDate(post.date)}</small><br />
						<a href="/posts/{post.slug}" class="title">{post.title}</a>
						{#if !post.published}<Badge color="red" class="ml-1">Draft</Badge>{/if}
					</li>
				{/each}
			</ul>
		</section>
	</div>
</div>
