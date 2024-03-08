<svelte:head>
	<style>
		html body {
			background: white;
			max-width: 100%;
		}

		html.dark body {
			background: black;
		}

		#global-sketch {
			display: none;
		}

		#main-wrapper {
			max-width: 100%;
			width: 100%;
		}
	</style>
</svelte:head>

<slot />
