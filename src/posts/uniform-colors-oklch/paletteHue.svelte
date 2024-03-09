<script context="module" lang="ts">
	import { lchChromaMap } from '$lib/store';
</script>

<script lang="ts">
	export let lightness: number;
	export let chroma: number = -1;

	const map: Record<number, number> = $lchChromaMap;
	const hr = Array.from({ length: 100 }, (x, i) => i * 3.6);
	chroma = chroma > 0 ? chroma : map[lightness];
</script>

<div class="flex mb-8">
	{#each hr as h}
		<div class="w-12 h-12" style="background-color: oklch({lightness * 100}%, {chroma}, {h})"></div>
	{/each}
</div>
