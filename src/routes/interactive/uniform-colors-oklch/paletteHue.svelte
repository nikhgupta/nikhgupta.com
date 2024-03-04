<script lang="ts">
	export let lightness: number;
	export let chroma: number = -1;
	import mappings from './mapping.json';
	const map: Record<number, number> = mappings;
	const hr = Array.from({ length: 360 }, (x, i) => i + 1);
	chroma = chroma > 0 ? chroma : map[lightness];
</script>

<div class="flex mb-8">
	{#each hr as h}
		<div class="w-12 h-12" style="background-color: oklch({lightness * 100}%, {chroma}, {h})"></div>
	{/each}
</div>
