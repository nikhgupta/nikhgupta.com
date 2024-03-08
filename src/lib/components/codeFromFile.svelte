<script lang="ts">
	export let path: string;
	import { loadFile } from '$lib/importers/mdsvex';

	let code: string;
	loadFile(path, (data) => (code = data));

	export let language: string = 'svelte';
	export let header: string = path.split('/').at(-1) || '';
	import { CodeBlock } from 'svhighlight';
</script>

<div class="mt-4 my-8 max-h-96 overflow-y-auto">
	{#if code}
		<CodeBlock {code} {language} showHeader={true} headerText={header} />
	{:else}
		<CodeBlock code="Loading code block from file.." headerText={header} />
	{/if}
</div>
