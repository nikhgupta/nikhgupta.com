<script lang="ts">
	import type { Color } from './colors';
	import { zoomedPalette, baseColor, showColor } from './store';

	function handleZoomClick(e: MouseEvent) {
		zoomed = !zoomed;
		zoomedPalette.set(zoomed ? name : null);
	}

	export let name: string;
	export let colors: Color[];
	export let zoomed: boolean = false;
	export let className = 'flex gap-4 mt-2 mb-8';

	$: zoomed = name === $zoomedPalette;
	$: classNameZoomed = `${className} ${zoomed ? 'h-lvh' : ''}`;
</script>

{#if !$zoomedPalette || $zoomedPalette == name}
	<div class="color-palette">
		<h3 class="mt-4 flex items-center justify-between">
			{name}

			<button class="ml-2" on:click={handleZoomClick}>
				{#if zoomed}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
					</svg>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
					</svg>
				{/if}
			</button>
		</h3>
		<div class={classNameZoomed}>
			{#each colors as c}
				<div
					class="w-full {zoomed ? 'h-full' : 'h-16'} {$baseColor.toHex() === c.toHex()
						? 'rounded-xl'
						: ''} flex items-center justify-center"
					style="background-color: {c.toHex()}"
				>
					{#if $showColor}
						<svg viewBox="0 0 80 18" style="max-width: 80px; fill: {c.contrastColor}">
							<text x="5" y="15">{c.toHex()}</text>
						</svg>
					{/if}
				</div>
			{/each}
		</div>
	</div>
{/if}
