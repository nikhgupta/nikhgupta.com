<script lang="ts">
	import type { Color } from '$lib/colors';

	export let className = 'flex gap-4 mt-2 mb-8';
	export let showColor: boolean = true;
	export let rounded: boolean = false;
	export let colors: Color[];
</script>

<div class={className}>
	{#each colors as c}
		<div
			class="w-full h-16 {rounded ? 'md:rounded-lg' : ''} flex items-center justify-center"
			style="background-color: {c.toHex()}"
		>
			{#if showColor}
				<svg viewBox="0 0 80 18" style="max-width: 80px; fill: {c.contrastColor}">
					<text x="5" y="15">{c.toHex()}</text>
				</svg>
			{/if}
		</div>
	{/each}
</div>
