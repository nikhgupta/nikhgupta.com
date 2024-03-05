<script lang="ts">
	import type { Color } from '$lib/colors';

	export let className = 'flex gap-4 mt-2 mb-8';
	export let showColor: boolean = true;
	export let rounded: boolean = true;
	export let colors: Color[];
	export let baseColor: Color;
</script>

<div class={className}>
	{#each colors as c}
		<div
			class="w-full h-16 {rounded ? 'md:rounded-lg' : ''} flex items-center justify-center"
			style="background-color: {c.toHex()}; color: {c.contrastColor}"
		>
			{#if showColor}
				<div class="lg:block hidden">{c.toHex()}</div>
			{/if}
		</div>
	{/each}
</div>
