<script lang="ts">
	export let hue: number;
	export let chroma: number = 0.04;
	import mappings from './oklch-color-mapping.json';
	const map: Record<number, number> = mappings;
	const lr = Array.from({ length: 198 }, (x, i) => (i + 1) / 200);
</script>

<div class="flex mt-4 mb-8">
	{#each lr as l}
		<div
			class="w-12 h-12"
			style="background-color: oklch({l * 100}%, {map[l] > chroma ? chroma : map[l]}, {hue})"
		></div>
	{/each}
</div>
