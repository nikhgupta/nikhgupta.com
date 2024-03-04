<script lang="ts">
	export let hue: number;
	export let chroma: number = 0.04;
	import mappings from './mapping.json';
	const map: Record<number, number> = mappings;
	const lr = Array.from({ length: 10000 }, (x, i) => i / 10000);
</script>

<div class="flex mt-4 mb-8">
	{#each lr as l}
		<div
			class="w-12 h-12"
			style="background-color: oklch({l * 100}%, {map[l] > chroma ? chroma : map[l]}, {hue})"
		></div>
	{/each}
</div>
