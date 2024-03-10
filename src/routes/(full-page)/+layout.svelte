<script lang="ts">
	import '../../app.scss';
</script>

<svelte:head>
	{#if import.meta.env.PROD}
		<script async src="https://www.googletagmanager.com/gtag/js?id=G-9F5T1QQ1GV"></script>
		<script>
			window.dataLayer = window.dataLayer || [];
			function gtag() {
				dataLayer.push(arguments);
			}
			gtag('js', new Date());

			gtag('config', 'G-9F5T1QQ1GV');
		</script>
	{/if}
</svelte:head>

<slot />
