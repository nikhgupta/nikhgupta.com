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
	<div class="flex space-x-4 items-center">
		<span>I am available on:</span>
		<a href="mailto:me+web@nikhgupta.com" target="_blank">Email</a>
		<a href="https://github.com/nikhgupta" target="_blank">Github</a>
		<a href="https://in.tradingview.com/u/NikhilGuptab4/#published-scripts" target="_blank">
			TradingView
		</a>
	</div>
</footer>
