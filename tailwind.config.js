/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
		'./node_modules/**/*.svelte'
	],
	plugins: [require('flowbite/plugin')],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				slate: {
					50: 'oklch(97.78% 0.0100 257)',
					100: 'oklch(93.56% 0.0321 257)',
					200: 'oklch(88.11% 0.0401 257)',
					300: 'oklch(82.67% 0.0401 257)',
					400: 'oklch(74.22% 0.0401 257)',
					500: 'oklch(64.78% 0.0401 257)',
					600: 'oklch(57.33% 0.0401 257)',
					700: 'oklch(46.89% 0.0401 257)',
					800: 'oklch(39.44% 0.0401 257)',
					900: 'oklch(32.00% 0.0401 257)',
					950: 'oklch(23.78% 0.0401 257)'
				},
				red: {
					50: 'oklch(97.78% 0.0100 27.33)',
					100: 'oklch(93.56% 0.0321 27.33)',
					200: 'oklch(88.11% 0.0609 27.33)',
					300: 'oklch(82.67% 0.0908 27.33)',
					400: 'oklch(74.22% 0.1398 27.33)',
					500: 'oklch(64.78% 0.1472 27.33)',
					600: 'oklch(57.33% 0.1299 27.33)',
					700: 'oklch(46.89% 0.1067 27.33)',
					800: 'oklch(39.44% 0.0898 27.33)',
					900: 'oklch(32.00% 0.0726 27.33)',
					950: 'oklch(23.78% 0.0540 27.33)'
				},
				amber: {
					50: 'oklch(97.78% 0.0100 58.32)',
					100: 'oklch(93.56% 0.0321 58.32)',
					200: 'oklch(88.11% 0.0609 58.32)',
					300: 'oklch(82.67% 0.0908 58.32)',
					400: 'oklch(74.22% 0.1398 58.32)',
					500: 'oklch(64.78% 0.1472 58.32)',
					600: 'oklch(57.33% 0.1299 58.32)',
					700: 'oklch(46.89% 0.1067 58.32)',
					800: 'oklch(39.44% 0.0898 58.32)',
					900: 'oklch(32.00% 0.0726 58.32)',
					950: 'oklch(23.78% 0.0540 58.32)'
				},
				yellow: {
					50: 'oklch(97.78% 0.0100 86.65)',
					100: 'oklch(93.56% 0.0321 86.65)',
					200: 'oklch(88.11% 0.0609 86.65)',
					300: 'oklch(82.67% 0.0908 86.65)',
					400: 'oklch(74.22% 0.1398 86.65)',
					500: 'oklch(64.78% 0.1472 86.65)',
					600: 'oklch(57.33% 0.1299 86.65)',
					700: 'oklch(46.89% 0.1067 86.65)',
					800: 'oklch(39.44% 0.0898 86.65)',
					900: 'oklch(32.00% 0.0726 86.65)',
					950: 'oklch(23.78% 0.0540 86.65)'
				},
				emerald: {
					50: 'oklch(97.78% 0.0100 163.23)',
					100: 'oklch(93.56% 0.0321 163.23)',
					200: 'oklch(88.11% 0.0609 163.23)',
					300: 'oklch(82.67% 0.0908 163.23)',
					400: 'oklch(74.22% 0.1398 163.23)',
					500: 'oklch(64.78% 0.1472 163.23)',
					600: 'oklch(57.33% 0.1299 163.23)',
					700: 'oklch(46.89% 0.1067 163.23)',
					800: 'oklch(39.44% 0.0898 163.23)',
					900: 'oklch(32.00% 0.0726 163.23)',
					950: 'oklch(23.78% 0.0540 163.23)'
				},
				cyan: {
					50: 'oklch(97.78% 0.0100 221.72)',
					100: 'oklch(93.56% 0.0321 221.72)',
					200: 'oklch(88.11% 0.0609 221.72)',
					300: 'oklch(82.67% 0.0908 221.72)',
					400: 'oklch(74.22% 0.1398 221.72)',
					500: 'oklch(64.78% 0.1472 221.72)',
					600: 'oklch(57.33% 0.1299 221.72)',
					700: 'oklch(46.89% 0.1067 221.72)',
					800: 'oklch(39.44% 0.0898 221.72)',
					900: 'oklch(32.00% 0.0726 221.72)',
					950: 'oklch(23.78% 0.0540 221.72)'
				},
				blue: {
					50: 'oklch(97.78% 0.0100 262.88)',
					100: 'oklch(93.56% 0.0321 262.88)',
					200: 'oklch(88.11% 0.0609 262.88)',
					300: 'oklch(82.67% 0.0908 262.88)',
					400: 'oklch(74.22% 0.1398 262.88)',
					500: 'oklch(64.78% 0.1472 262.88)',
					600: 'oklch(57.33% 0.1299 262.88)',
					700: 'oklch(46.89% 0.1067 262.88)',
					800: 'oklch(39.44% 0.0898 262.88)',
					900: 'oklch(32.00% 0.0726 262.88)',
					950: 'oklch(23.78% 0.0540 262.88)'
				}
			}
		}
	}
};