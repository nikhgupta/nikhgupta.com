<script lang="ts">
	import { Input } from 'flowbite-svelte';
	import { onHexInput, baseColor } from './lib/store';

	export let rgbValue: string = $baseColor.originalColor().toHex();
	$: rgbValue = $baseColor.originalColor().toHex();
</script>

<Input
	id="hex-input"
	size="lg"
	placeholder="paste a color in hex format"
	value={rgbValue}
	on:input={onHexInput}
/>
