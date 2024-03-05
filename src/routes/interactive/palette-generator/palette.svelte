<script lang="ts">
	import type { Color } from '$lib/colors';

	export let className = 'flex gap-4 mt-2 mb-8';
	export let showColor: boolean = true;
	export let rounded: boolean = true;
	export let colors: string[];
	export let baseColor: Color;
</script>

<div class={className}>
	{#each colors as c}
		<div
			class="w-full h-16 {rounded ? 'rounded-lg' : ''} flex items-center justify-center"
			style="background-color: {c}; color: {baseColor.contrastColor}"
		>
			{#if showColor}
				<div class="lg:block hidden">{c}</div>
			{/if}
		</div>
	{/each}
</div>
