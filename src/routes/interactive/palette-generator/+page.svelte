<script lang="ts">
	import { Color, toggleDarkMode, DEFAULT_COLOR } from '$lib/colors';
	import { Range, Label, Input, Helper } from 'flowbite-svelte';
	import Palette from './palette.svelte';

	let numSlider = 3;
	$: hueDistanceSlider = 360 / numSlider;

	let showColor = false;
	let ls = DEFAULT_COLOR.l;
	let cs = DEFAULT_COLOR.c;
	let hs = DEFAULT_COLOR.h;
	$: color = new Color(ls, cs, hs);
	$: csClamped = Math.min(color.maxChroma, cs);
	$: toggleDarkMode(ls > 0.5 ? 0 : 1);

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
		} else if (e.code === 'KeyC') {
			showColor = !showColor;
			e.preventDefault();
		}
	};

	const hexInputChanged = (e: Event) => {
		const c = Color.fromRgb((e.target as HTMLInputElement).value || color.toHex());
		[ls, cs, hs] = c.valuesAt('l', 'c', 'h');
	};
</script>

<svelte:window on:keydown={onKeyDown} />

<h2 class="post-title">Generating Color Schemes using OKLCH colorspace</h2>

<div class="grid grid-cols-3 md:grid-cols-9 gap-4">
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4 col-span-3 md:col-span-9 mb-4">
		<div>
			<Label for="color-lightness" class="block mb-2">Lightness: {ls.toFixed(4)}</Label>
			<Range id="color-lightness" min="0" max="1" bind:value={ls} step={0.0001} />
		</div>
		<div>
			<Label for="color-chroma" class="block mb-2"
				>Chroma: {csClamped.toFixed(4)}, Max: {color.maxChroma.toFixed(4)}</Label
			>
			<Range id="color-chroma" min="0" max={color.maxChroma} bind:value={cs} step={0.0001} />
		</div>
		<div>
			<Label for="color-hue" class="block mb-2">Hue: {hs.toFixed(2)}</Label>
			<Range id="color-hue" min="0" max="360" bind:value={hs} step={0.01} />
		</div>
	</div>
	<div class="mb-6 col-span-3">
		<div class="w-full h-16 md:h-full rounded-lg" style="background-color: {color.toHex()}"></div>
	</div>
	<div class="mb-3 col-span-3">
		<Label for="hex-input" class="block mb-2">Paste a color in hex format:</Label>
		<Input
			id="hex-input"
			size="lg"
			placeholder="paste a color in hex format"
			value={color.toHex()}
			on:input={hexInputChanged}
		/>
		<Helper class="text-sm mt-2">
			oklch({(color.l * 100).toFixed(2)}% {color.c.toFixed(4)}
			{color.h.toFixed(2)})
		</Helper>
	</div>
	<div class="mb-6 col-span-3">
		<Label>Palette Size: {numSlider} colors</Label>
		<Range id="num-colors" min="1" max="36" bind:value={numSlider} step={1} />
		<Label>Distance: {hueDistanceSlider.toFixed(2)} (between hues)</Label>
		<Range id="distance-hue" min="0" max="180" bind:value={hueDistanceSlider} step={1} />
	</div>
</div>

<p>
	You can press <code>space</code> to randomize base color, <code>x</code> to reset base color,
	<code>c</code> to toggle color hex values, and <code>d</code> to toggle dark mode.
</p>

<h3 class="mt-4">Swatch (hue)</h3>
<Palette
	baseColor={color}
	colors={color.hueSwatch(numSlider, hueDistanceSlider)}
	rounded={false}
	showColor={showColor && numSlider < 13}
	className="flex mt-2 md:gap-1 mb-8"
/>

<h3 class="mt-4">Swatch (lightness)</h3>
<Palette
	baseColor={color}
	colors={color.lightnessSwatch(numSlider)}
	rounded={false}
	showColor={showColor && numSlider < 13}
	className="flex mt-2 md:gap-1 mb-8"
/>

<h3 class="mt-4">Shades</h3>
<Palette
	baseColor={color}
	colors={color.shades(numSlider)}
	rounded={false}
	showColor={showColor && numSlider < 13}
	className="flex mt-2 md:gap-1 mb-8"
/>

<h3 class="mt-4">Tones</h3>
<Palette
	baseColor={color}
	colors={color.tones(numSlider)}
	rounded={false}
	showColor={showColor && numSlider < 13}
	className="flex mt-2 md:gap-1 mb-8"
/>

<h3 class="mt-4">Tints</h3>
<Palette
	baseColor={color}
	colors={color.tints(numSlider)}
	rounded={false}
	showColor={showColor && numSlider < 13}
	className="flex mt-2 md:gap-1 mb-8"
/>

<h3 class="mt-4">Complimentary</h3>
<Palette
	baseColor={color}
	colors={color.complimentary(numSlider)}
	rounded={false}
	showColor={showColor && numSlider < 13}
	className="flex mt-2 md:gap-1 mb-8"
/>

<h3 class="mt-4">Split Complimentary</h3>
<Palette
	baseColor={color}
	colors={color.splitComplimentary(numSlider, hueDistanceSlider)}
	rounded={false}
	showColor={showColor && numSlider < 13}
	className="flex mt-2 md:gap-1 mb-8"
/>

<h3 class="mt-4">Analogous</h3>
<Palette
	baseColor={color}
	colors={color.analogous(hueDistanceSlider)}
	showColor={showColor && numSlider < 13}
	className="flex mt-2 md:gap-1 mb-8"
/>

<h3 class="mt-4">Triadic</h3>
<Palette
	baseColor={color}
	colors={color.triadic(hueDistanceSlider)}
	showColor={showColor && numSlider < 13}
	className="flex mt-2 md:gap-1 mb-8"
/>

<h3 class="mt-4">Tetradic</h3>
<Palette
	baseColor={color}
	colors={color.tetradic(hueDistanceSlider)}
	showColor={showColor && numSlider < 13}
	className="flex mt-2 md:gap-1 mb-8"
/>
