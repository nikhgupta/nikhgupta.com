<!-- a svelte based app to allow users to enter random words (26) starting with each of the a-z -->
<script lang="ts">
	import { Header } from '$lib';
	import { onMount } from 'svelte';
	import Qrcode from '$lib/components/qrcode.svelte';

	interface Config {
		loaded: boolean;
		prefix: string;
		separator: string;
		words: { letter: string; word: string }[];
	}

	const defaultConfig =
		'64:GIkhZVXhgWJvlLPgCO1zaixDRS1OWWPgZo1DbuthcVitZLqtO29DOy13O2P2b3X5gIPtGLJEQy1vQWPggIptlLwtXuTYZiTggWXvGEtqguxDRiThOy1jQ2JtZVitaitob3QtcUPhGLqAguqtGITqOy1gaUZDOy1AcV9zGO10O290ai4tbutAGO12Q3RqgBdqO3ntCitqCO15butvguPDcUP5OYh7SLuLMziK';

	const emptyConfig = '33:Hj0MHj0MHj0MHj0MHj0MHj0MHj0MHj0MHcBP';

	$: configStr = defaultConfig;

	onMount(() => {
		loadConfig(configStr);
	});

	let valid = true;
	let config: Config = { separator: '', prefix: '', loaded: false, words: [] };
	config['words'] = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i)).map(
		(letter) => {
			return { letter, word: '' };
		}
	);

	let n = 32 + Math.round(Math.random() * 32);
	$: wordMap = Object.fromEntries(config['words'].map(({ letter, word }) => [letter, word]));

	function onConfigProvided(e: Event) {
		let data = (e.target as HTMLInputElement).value;
		loadConfig(data);
	}

	function ob1(str: string, reverse: boolean = false) {
		var input = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
		var output = 'FoRsqTELAQNGveIlcjXCgiyzkxDJbOdpVuHrhSYPUtmnfMwaBWZK';

		return str
			.split('')
			.map((c) => {
				if (reverse) {
					var i = output.indexOf(c);
					return i >= 0 ? input[i] : c;
				} else {
					var i = input.indexOf(c);
					return i >= 0 ? output[i] : c;
				}
			})
			.join('');
	}

	function ob(str: string, num: number = 1, reverse: boolean = false) {
		for (let i = 0; i < num; i++) {
			str = ob1(str, reverse);
		}

		return str;
	}

	function deob(str: string, num: number = 1) {
		return ob(str, num, true);
	}

	function exportConfig() {
		let map = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i))
			.map((letter) => {
				return config['words'].find((w) => w.letter === letter)?.word || '';
			})
			.join('-');

		map = `${map}\n${config['separator'] || ''}\n${config['prefix'] || ''}`;
		configStr = `${n}:${ob(btoa(ob(map, n)), n)}`;
	}

	function loadConfig(configStr: string) {
		try {
			let [n, raw] = configStr.split(':');
			let nInt = parseInt(n);
			let data = deob(atob(deob(raw, nInt)), nInt).split('\n');
			let words = data[0].split('-');
			if (words.length !== 26) {
				valid = false;
				throw new Error('Invalid config');
			}
			let loaded: Config = {
				words: words.map((word, i) => ({ letter: String.fromCharCode(97 + i), word })),
				separator: data[1],
				prefix: data[2],
				loaded: true
			};
			valid = true;
			config = loaded;
		} catch (e: any) {
			console.error(e);
			valid = false;
			loadConfig(emptyConfig);
		}
	}

	function transform(input: string, config: Config) {
		if (!config.loaded || !input.trim()) return '';

		let prefix = config['prefix'] || '';
		let separator = config['separator'] || ' ';
		let parts = input.split('').map((c) => wordMap[c]);

		return prefix + separator + parts.join(separator);
	}

	let inputText = 'fb';
	$: outputText = transform(inputText, config);
</script>

<svelte:head>
	<title>Passwd</title>
</svelte:head>

<div class="px-8 md:px-16 xl:px-24 flex flex-col h-screen w-full lg:max-w-6xl xl:min-w-6xl">
	<Header hideNav={true} summary="is being a dumb security knowhow." />
	<h1 class="text-4xl font-bold">Passwd</h1>

	<div class="">
		<label for="input-text" class="text-lg font-bold">Input</label>
		<input
			type="text"
			id="input-text"
			class="p-2 ml-4 border border-gray-300 rounded-md w-96"
			bind:value={inputText}
		/><br />
		{#if outputText}
			<div class="flex flex-row items-center mt-8">
				<strong>Passphrase:</strong>
				<p class="output-text ml-4">
					{#if valid}
						<code class="text-white bg-gray-700 p-4 rounded-md">{outputText}</code>
					{:else}
						<code class="text-red-500 p-4 font-bold">Invalid Configuration</code>
					{/if}
				</p>
			</div>
		{/if}
	</div>

	<hr />

	<div class="flex items-start gap-4 mt-8">
		<div class="w-full flex flex-col">
			<label for="config" class="text-lg font-bold">Config</label>
			<textarea
				id="config"
				class="p-2 border rounded-md w-full {valid
					? 'border-green-500 bg-green-50'
					: 'border-red-500 bg-red-50'}"
				value={configStr}
				rows="4"
				on:input={onConfigProvided}
			/>
			<p class="text-sm">
				You should copy the configuration generated here and store it somewhere safe.<br />
				You can paste it back here to load the configuration.<br />
				You can also print the generated QR code, keep it secure and scan it later to copy the configuration.
				QR code is intentionally not a URL but only the config. You will have to enter it manually here.<br
				/>
			</p>
		</div>

		<div class="mt-6">
			<Qrcode url={`${configStr}`} />
		</div>
	</div>

	<hr />

	<p>
		Enter a random word starting with each letter of the alphabet to customize.<br />
		<strong class="text-sm"
			>You can randomize words based on your language, people you know, things you love, places you
			like, etc. These are some good examples as they are often not found online, and are easier to
			remember.<br />
			My own dictionary consists of words that are in my native language, another language I know of,
			some verbs, and nouns in these languages.
		</strong>
	</p>
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
		{#each config['words'] as { letter, word }, i}
			<div class="flex flex-row justify-around items-center">
				<div class="space-x-4">
					<label for={letter} class="text-lg font-bold">{letter.toUpperCase()}</label>
					<input
						type="text"
						id={letter}
						bind:value={word}
						on:input={exportConfig}
						class="p-2 border border-gray-300 rounded-md"
					/>
				</div>
			</div>
		{/each}
	</div>
	<hr class="my-8" />
	<div class="">
		<label for="separator" class="mr-4">Separator</label>
		<input
			type="text"
			id="separator"
			bind:value={config['separator']}
			on:input={exportConfig}
			class="p-2 border border-gray-300 rounded-md"
		/>
		<p class="text-sm">The separator to use between the words. Default is a space (leave blank).</p>
	</div>
	<div class="mt-8">
		<label for="prefix" class="mr-4">Prefix</label>
		<input
			type="text"
			id="prefix"
			bind:value={config['prefix']}
			on:input={exportConfig}
			class="p-2 border border-gray-300 rounded-md"
		/>
		<p class="text-sm">
			The prefix to use before the words. Default is randomly generated. Use a mix of uppercase,
			symbols and numbers here. Recommended: <code>[CAP][SYM][NUM][NUM][SYM]</code>, e.g.
			<code>P&21+</code>
		</p>
	</div>
</div>
