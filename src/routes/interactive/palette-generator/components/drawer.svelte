<script lang="ts">
	import { sineIn } from 'svelte/easing';
	import { Drawer, CloseButton } from 'flowbite-svelte';
	import { InfoCircleSolid } from 'flowbite-svelte-icons';

	import Notes from './notes.svelte';

	export let hideHelp: boolean = true;
	let transitionParamsRight = { x: 320, duration: 200, easing: sineIn };
</script>

<Drawer
	placement="right"
	transitionType="fly"
	transitionParams={transitionParamsRight}
	bind:hidden={hideHelp}
	backdrop={true}
	class="max-w-128 w-full"
>
	<div class="flex items-center">
		<h5
			id="drawer-label"
			class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400"
		>
			<InfoCircleSolid class="w-4 h-4 me-2.5" />Help / Usage
		</h5>
		<CloseButton on:click={() => (hideHelp = true)} class="mb-4 dark:text-white" />
	</div>

	<h4 class="mb-2 mt-8 text-base">Keyboard Shortcuts</h4>
	<ul class="list-disc list-inside mb-6 text-sm text-gray-500 dark:text-gray-400">
		<li>Press <code>-</code> to decrease palette size.</li>
		<li>Press <code>=</code> to increase palette size.</li>
		<li>Press <code>m</code> to toggle color hex values.</li>
		<li>Press <code>d</code> to toggle dark mode.</li>
		<li>Press <code>space</code> to randomize base color.</li>
		<li>Press <code>x</code> to reset UI.</li>
	</ul>

	<h4 class="mb-2 mt-8 text-base">Helpful Tips</h4>
	<ul class="list-disc list-inside mb-6 text-sm text-gray-500 dark:text-gray-400">
		<li>Base color is marked with rounded edges where available.</li>
		<li>You can expand a palette to only focus on that palette when generating colors.</li>
	</ul>

	<hr />

	<h4 class="mb-0 mt-8 text-base">Why use a fallback color instead of the color I provided?</h4>
	<p class="text-sm mt-2">
		Color was out of gamut (not all hues were available for selected lightness/chroma in OKLCH
		colorspace), so it was replaced with a fallback color. OKLCH colorspace does remove colors that
		are of high/low intensity to ensure a perceptually uniform color space. Read more about how this
		works in the <a href="/interactive/uniform-colors-oklch">exploring OKLCH color space</a> page.
	</p>

	<hr />

	<Notes showTodos={false} />
</Drawer>
