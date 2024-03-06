<script lang="ts">
	import { copyText } from 'svelte-copy';
	import { Toast } from 'flowbite-svelte';
	import { FileCopyOutline } from 'flowbite-svelte-icons';

	import type { Color } from './colors';
	import { zoomedPalette, baseColor, showColor } from './store';

	let copiedColor: string | null = null;

	function handleZoomClick(e: MouseEvent) {
		zoomed = !zoomed;
		zoomedPalette.set(zoomed ? name : null);
	}

	function copyColor(color: Color) {
		copiedColor = color.toHex();
		copyText(copiedColor);
		setTimeout(() => {
			copiedColor = null;
		}, 3000);
	}

	export let name: string;
	export let colors: Color[];
	export let zoomed: boolean = false;
	export let className = 'flex gap-4 mt-2 mb-8';

	$: zoomed = name === $zoomedPalette;
	$: classNameZoomed = `${className} ${zoomed ? 'h-128' : ''}`;
</script>

{#if !$zoomedPalette || $zoomedPalette == name}
	<div class="color-palette h-">
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
				<button
					class="w-full {zoomed ? 'h-full' : 'h-16'} {$baseColor.toHex() === c.toHex()
						? 'rounded-xl'
						: ''} flex items-center justify-center"
					style="background-color: {c.toHex()}"
					on:click={(e) => copyColor(c)}
				>
					{#if $showColor}
						<svg viewBox="0 0 80 18" style="max-width: 80px; fill: {c.contrastColor}">
							<text x="5" y="15">{c.toHex()}</text>
						</svg>
					{/if}
				</button>
			{/each}
		</div>
	</div>
{/if}

{#key copiedColor}
	{#if copiedColor}
		<Toast
			color="green"
			class="fixed bottom-4 right-4 w-full max-w-xs p-4 text-gray-50 dark:text-gray-950 bg-gray-800 dark:bg-gray-50 gap-3 shadow-lg"
		>
			<svelte:fragment slot="icon">
				<FileCopyOutline class="w-5 h-5" />
				<span class="sr-only">Check icon</span>
			</svelte:fragment>

			<span style="color: {copiedColor}">
				&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;
			</span><br />
			<span>Copied {copiedColor} to clipboard.</span>
		</Toast>
	{/if}
{/key}
