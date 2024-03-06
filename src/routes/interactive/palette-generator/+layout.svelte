<script lang="ts">
	import './style.scss';
	import { SvelteToast } from '@zerodevx/svelte-toast';

	const options = {
		duration: 3000
	};
</script>

<slot />
<div class="toast-wrap">
	<SvelteToast {options} />
</div>
