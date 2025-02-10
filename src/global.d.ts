declare module '*.svx' {
	export { SvelteComponentDev as default } from 'svelte/internal';
}

declare global {
	interface Window {
		_p5Instance?: any;
	}
}

export {};
