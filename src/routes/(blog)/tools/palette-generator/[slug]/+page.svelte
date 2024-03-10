<script lang="ts">
	import { Input } from 'flowbite-svelte';
	import { onHexInput, setBaseColor, baseColor, showFallback } from '../lib/store';
	import { Color } from '../lib/colors';

	const setBaseColorFromRgb = (rgb: string) => {
		const color = Color.fromRgb(rgb, false);
		if (color) {
			showFallback.set(true);
			setBaseColor(color);
			rgbValue = color.toHex();
		}
	};

	export let data;
	export let rgbValue: string = data.rgbValue;
	$: setBaseColorFromRgb(data.rgbValue);
	$: rgbValue = $baseColor.originalColor().toHex();
</script>

<Input
	id="hex-input"
	size="lg"
	placeholder="paste a color in hex format"
	value={rgbValue}
	on:input={onHexInput}
/>
