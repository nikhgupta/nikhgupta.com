<script lang="ts">
	import Notes from './components/notes.svelte';
	import Palette from './components/palette.svelte';
	import { onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	import { baseColor, showColor, zoomedPalette } from './lib/store';
	import { Color, toggleDarkMode, CONTRAST_THRESHOLD } from './lib/colors';

	import { Range, Label, Input, Helper, TableBody } from 'flowbite-svelte';
	import Drawer from './components/drawer.svelte';

	let numSlider = 12;
	let hideHelp = true;
	let color = Color.default();
	$: hueDistanceSlider = Math.min(30, 360 / numSlider);

	let ls = color.l;
	let cs = color.c;
	let hs = color.h;
	let showFallback = true;
	$: color = new Color(ls, cs, hs);
	$: originalColor = color.originalColor();
	$: fallback = color != originalColor && showFallback;
	$: baseColor.set(color);
	$: csClamped = Math.min(color.maxChroma, cs);
	$: toggleDarkMode(ls > CONTRAST_THRESHOLD ? 0 : 1);

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.altKey || e.shiftKey || e.ctrlKey || e.metaKey) return;

		const recognized = ['Space', 'KeyX', 'KeyD', 'KeyM', 'Equal', 'Minus', 'Slash'];
		if (!recognized.includes(e.code)) return;

		e.preventDefault();
		if (e.code === 'Space') {
			[ls, cs, hs] = Color.fromRandom().valuesAt('l', 'c', 'h');
		} else if (e.code === 'KeyX') {
			[ls, cs, hs] = Color.default().valuesAt('l', 'c', 'h');
			numSlider = 12;
			showColor.set(false);
			zoomedPalette.set(null);
		} else if (e.code === 'KeyD') {
			toggleDarkMode(-1);
		} else if (e.code === 'KeyM') {
			showColor.set(!$showColor);
		} else if (e.code === 'Equal') {
			numSlider = Math.min(36, numSlider + 1);
		} else if (e.code === 'Minus') {
			numSlider = Math.max(2, numSlider - 1);
		} else if (e.code === 'Slash') {
			hideHelp = !hideHelp;
		}
	};

	const colorSliderChanged = (e: Event) => {
		showFallback = false;
	};

	const hexInputChanged = (e: Event) => {
		showFallback = true;
		const c = Color.fromRgb((e.target as HTMLInputElement).value || color.toHex(), false);
		if (c) [ls, cs, hs] = c.valuesAt('l', 'c', 'h');
	};

	onDestroy(() => {
		if (browser) {
			const html = document.documentElement;
			html.classList.remove('app-ui');
		}
	});
</script>

<h2 class="post-title">Generating Color Schemes using OKLCH colorspace</h2>

<div class="grid grid-cols-3 md:grid-cols-9 gap-4">
	<div class="mb-6 col-span-3 flex">
		{#if fallback}
			<div
				class="w-1/2 h-16 md:h-full rounded-lg flex items-center justify-center"
				style="background-color: {originalColor.toHex()}; color: {originalColor.contrastColor}"
			>
				original: {originalColor.toHex()}
			</div>
		{/if}
		<div
			class="w-{fallback
				? '1/2'
				: 'full'} h-16 md:h-full rounded-lg items-center justify-center flex"
			style="background-color: {color.toHex()}; color: {color.contrastColor}"
		>
			{color.toHex()}
		</div>
	</div>
	<div class="mb-3 col-span-3">
		<Label for="hex-input" class="block mb-2">Paste a color in hex format:</Label>
		<Input
			id="hex-input"
			size="lg"
			placeholder="paste a color in hex format"
			value={originalColor.toHex()}
			on:input={hexInputChanged}
		/>
		<Helper class="text-sm mt-2">
			oklch({(color.l * 100).toFixed(2)}% {color.c.toFixed(4)}
			{color.h.toFixed(2)})
			{#if fallback}, fallback to: {color.toHex()}{/if}
		</Helper>
	</div>
	<div class="mb-6 col-span-3">
		<Label>Palette Size: {numSlider} colors</Label>
		<Range id="num-colors" min="2" max="36" bind:value={numSlider} step={1} />
		<Label>Distance: {hueDistanceSlider.toFixed(2)} (between hues)</Label>
		<Range id="distance-hue" min="0" max="90" bind:value={hueDistanceSlider} step={1} />
	</div>
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4 col-span-3 md:col-span-9 mb-4">
		<div>
			<Label for="color-lightness" class="block mb-2">Lightness: {ls.toFixed(4)}</Label>
			<Range
				id="color-lightness"
				min="0"
				max="1"
				bind:value={ls}
				step={0.0001}
				on:change={colorSliderChanged}
			/>
		</div>
		<div>
			<Label for="color-chroma" class="block mb-2"
				>Chroma: {csClamped.toFixed(4)}, Max: {color.maxChroma.toFixed(4)}</Label
			>
			<Range
				id="color-chroma"
				min="0"
				max={color.maxChroma}
				bind:value={cs}
				step={0.0001}
				on:change={colorSliderChanged}
			/>
		</div>
		<div>
			<Label for="color-hue" class="block mb-2">Hue: {hs.toFixed(2)}</Label>
			<Range
				id="color-hue"
				min="0"
				max="360"
				bind:value={hs}
				step={0.01}
				on:change={colorSliderChanged}
			/>
		</div>
	</div>
</div>

<p>
	Press <code>/</code> (slash) to view helpful tips and keyboard shortcuts.
</p>

<Palette
	name="Swatch (hue)"
	className="flex mt-2 md:gap-1 mb-8"
	colors={color.hueSwatch(numSlider, hueDistanceSlider)}
/>

<Palette
	name="Swatch (lightness)"
	className="flex mt-2 md:gap-1 mb-8"
	colors={color.lightnessSwatch(numSlider)}
/>

<Palette name="Shades" colors={color.shades(numSlider)} className="flex mt-2 md:gap-1 mb-8" />
<Palette name="Tones" colors={color.tones(numSlider)} className="flex mt-2 md:gap-1 mb-8" />
<Palette name="Tints" colors={color.tints(numSlider)} className="flex mt-2 md:gap-1 mb-8" />

<Palette
	name="Complimentary"
	className="flex mt-2 md:gap-1 mb-8"
	colors={color.complimentary(numSlider)}
/>

{#if numSlider > 2}
	<Palette
		name="Analogous"
		className="flex mt-2 md:gap-1 mb-8"
		colors={color.analogous(numSlider, hueDistanceSlider)}
	/>

	<Palette
		name="Split Complimentary"
		className="flex mt-2 md:gap-1 mb-8"
		colors={color.splitComplimentary(numSlider, hueDistanceSlider)}
	/>

	<Palette
		name="Triadic"
		className="flex mt-2 md:gap-1 mb-8"
		colors={color.triadic(numSlider, hueDistanceSlider)}
	/>

	<Palette
		name="Triadic (inclusive)"
		className="flex mt-2 md:gap-1 mb-8"
		colors={color.triadicInclusive(numSlider, hueDistanceSlider)}
	/>
{/if}

{#if numSlider > 3}
	<Palette
		name="Tetradic"
		className="flex mt-2 md:gap-1 mb-8"
		colors={color.tetradic(numSlider, hueDistanceSlider)}
	/>

	<Palette
		name="Tetradic (inclusive)"
		className="flex mt-2 md:gap-1 mb-8"
		colors={color.tetradicInclusive(numSlider, hueDistanceSlider)}
	/>
{/if}

<hr />

<Notes />
<Drawer {hideHelp} />
<svelte:window on:keydown={onKeyDown} />
