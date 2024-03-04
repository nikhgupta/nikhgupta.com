<script>
	import '../app.scss';
	import 'highlight.js/styles/nord.css';

	import { DarkMode } from 'flowbite-svelte';
</script>

<div class="">
	<DarkMode
		class="text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-xl p-2"
	/>
</div>
<h1 class="logo font-shalimar"><a href="/" class="no-underline">Nikhil Gupta</a></h1>
<div class="mb-28">
	<slot />
</div>

<footer>
	<div class="flex space-x-4 items-center leading-8">
		<a href="https://github.com/nikhgupta" target="_blank" class="flex justify-center items-center">
			<img src="/icons/github.svg" alt="Github" class="w-6 h-6 mr-1" />
			Github
		</a>
		<a
			href="https://in.tradingview.com/u/NikhilGuptab4/#published-scripts"
			target="_blank"
			class="flex justify-center items-center"
		>
			<img src="/icons/tradingview.svg" alt="TradingView" class="w-8 h-8 mr-1" />
			TradingView
		</a>
	</div>
</footer>
