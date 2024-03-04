<script lang="ts">
	export let code: string;
	export let language: string = 'svelte';
	export let header: string | undefined = undefined;
	import { CodeBlock } from 'svhighlight';

	const trimmedCode = code.trim();
</script>

<div class="mt-4 my-8 max-h-96 overflow-y-auto">
	<CodeBlock code={trimmedCode} {language} showHeader={true} headerText={header} />
</div>
