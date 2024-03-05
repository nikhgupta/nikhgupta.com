<script lang="ts">
	import { Color, toggleDarkMode, DEFAULT_COLOR } from '$lib/colors';
	import { Range, Label, Input, Helper } from 'flowbite-svelte';
	import { displayable } from 'culori/fn';

	let numSlider = 12;
	let hueDistanceSlider = 360 / numSlider;

	let ls = DEFAULT_COLOR.l;
	let cs = DEFAULT_COLOR.c;
	let hs = DEFAULT_COLOR.h;
	$: color = new Color(ls, cs, hs);
	$: maxChroma = color.maxChroma();
	$: csClamped = Math.min(maxChroma, cs);
	$: toggleDarkMode(ls > 0.5 ? 0 : 1);
	// $: console.log(ls, cs, hs, maxChroma);

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.code === 'Space') {
			[ls, cs, hs] = Color.fromRandom().valuesAt('l', 'c', 'h');
			e.preventDefault();
		} else if (e.code === 'KeyX') {
			[ls, cs, hs] = Color.fromRgb('#fab').valuesAt('l', 'c', 'h');
			e.preventDefault();
		} else if (e.code === 'KeyD') {
			toggleDarkMode(-1);
			e.preventDefault();
		}
	};
</script>

<svelte:window on:keydown={onKeyDown} />

<h2 class="post-title">Generating Color Schemes using OKLCH colorspace</h2>

<div class="grid grid-cols-9 gap-4">
	<div class="grid grid-cols-3 gap-4 col-span-9 mb-4">
		<div>
			<Label for="color-lightness" class="block mb-2">Lightness: {ls.toFixed(4)}</Label>
			<Range id="color-lightness" min="0" max="1" bind:value={ls} step={0.0001} />
		</div>
		<div>
			<Label for="color-chroma" class="block mb-2"
				>Chroma: {csClamped.toFixed(4)}, Max: {maxChroma.toFixed(4)}</Label
			>
			<Range id="color-chroma" min="0" max={maxChroma} bind:value={cs} step={0.0001} />
		</div>
		<div>
			<Label for="color-hue" class="block mb-2">Hue: {hs.toFixed(2)}</Label>
			<Range id="color-hue" min="0" max="360" bind:value={hs} step={0.01} />
		</div>
	</div>
	<div class="mb-6 col-span-2">
		<div class="w-full h-full rounded-lg" style="background-color: {color.toHex()}"></div>
	</div>
	<div class="mb-3 col-span-2">
		<Label for="hex-input" class="block mb-2">Paste a color in hex format:</Label>
		<Input
			id="hex-input"
			size="lg"
			placeholder="paste a color in hex format"
			value={color.toHex()}
		/>
		<Helper class="text-sm mt-2">
			oklch({(color.l * 100).toFixed(2)}% {color.c.toFixed(4)}
			{color.h.toFixed(2)})
		</Helper>
	</div>
	<div class="mb-6 col-span-5">
		<Label>Palette Size: {numSlider} colors</Label>
		<Range id="num-colors" min="1" max="36" bind:value={numSlider} step={1} />
		<Label>Distance: {hueDistanceSlider} (between hues)</Label>
		<Range id="distance-hue" min="0" max="180" bind:value={hueDistanceSlider} step={1} />
	</div>
</div>

<p>
	Press <code>space</code> to randomize base color, <code>x</code> to reset base color, and
	<code>d</code> to toggle dark mode.
</p>

<h3 class="mt-4">Swatch</h3>
<div class="flex mt-2 gap-1 mb-8">
	{#each color.swatch(hueDistanceSlider, numSlider) as c}
		<div class="w-full h-16 flex items-center justify-center" style="background-color: {c}"></div>
	{/each}
</div>

<h3 class="mt-4">Shades</h3>
<div class="flex mt-2 gap-1 mb-8">
	{#each color.shades(numSlider) as c}
		<div class="w-full h-16 flex items-center justify-center" style="background-color: {c}"></div>
	{/each}
</div>

<h3 class="mt-4">Complimentary</h3>
<div class="grid grid-cols-2 gap-4 mt-2 mb-8">
	{#each color.complimentary() as c}
		<div
			class="w-full h-16 rounded-lg flex items-center justify-center"
			style="background-color: {c}; color: {color.contrastColor}"
		>
			{c}
		</div>
	{/each}
</div>

<h3 class="mt-4">Split Complimentary</h3>
<div class="flex gap-4 mt-2 mb-8">
	{#each color.splitComplimentary(hueDistanceSlider) as c}
		<div
			class="w-full h-16 rounded-lg flex items-center justify-center"
			style="background-color: {c}; color: {color.contrastColor}"
		>
			{c}
		</div>
	{/each}
</div>

<h3 class="mt-4">Analogous</h3>
<div class="grid grid-cols-3 gap-4 mt-2 mb-8">
	{#each color.analogous(hueDistanceSlider) as c}
		<div
			class="w-full h-16 rounded-lg flex items-center justify-center"
			style="background-color: {c}; color: {color.contrastColor}"
		>
			{c}
		</div>
	{/each}
</div>

<h3 class="mt-4">Triadic</h3>
<div class="grid grid-cols-3 gap-4 mt-2 mb-8">
	{#each color.triadic(hueDistanceSlider) as c}
		<div
			class="w-full h-16 rounded-lg flex items-center justify-center"
			style="background-color: {c}; color: {color.contrastColor}"
		>
			{c}
		</div>
	{/each}
</div>

<h3 class="mt-4">Tetradic</h3>
<div class="grid grid-cols-4 gap-4 mt-2 mb-8">
	{#each color.tetradic(hueDistanceSlider) as c}
		<div
			class="w-full h-16 rounded-lg flex items-center justify-center"
			style="background-color: {c}; color: {color.contrastColor}"
		>
			{c}
		</div>
	{/each}
</div>
