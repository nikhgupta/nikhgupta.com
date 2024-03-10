<script lang="ts">
	import { sineIn } from 'svelte/easing';
	import { Drawer, CloseButton } from 'flowbite-svelte';
	import { InfoCircleSolid } from 'flowbite-svelte-icons';

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
		<li>Press <code>space</code> or <code>R</code> to generate a new image in the same sketch.</li>
		<li>Press <code>Enter</code> to switch to next Sketch.</li>
		<li>Press <code>d</code> to toggle dark mode.</li>
		<li>Press <code>m</code> to toggle color hex values.</li>
		<li>Press <code>/</code> to toggle this help.</li>
	</ul>

	<h4 class="mb-2 mt-8 text-base">Todos</h4>
	<ul class="list-disc list-inside mb-6 text-sm text-gray-500 dark:text-gray-400">
		<li>Display seed and allow regeneration of an image by specifying seed in the URL.</li>
	</ul>
</Drawer>
