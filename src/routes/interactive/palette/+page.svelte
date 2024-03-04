<script lang="ts">
	import mappings from './mapping.json';
	const map: Record<number, number> = mappings;
	const hr = Array.from({ length: 360 }, (x, i) => i + 1);
	console.log(hr, Object.entries(map).length);

	const x = 0;
	const lightnessStr = '0.9778,0.9356,0.8811,0.8267,0.7422,0.6478,0.5733,0.4689,0.3944,0.32,0.2378';
	const lightness = lightnessStr.split(',').map((l) => parseFloat(l));
	const chroma = lightness.map((l) => map[l]);
	console.log(chroma);
	let d = [lightness[0], chroma[0], x, 0];
</script>

<div class="flex">
	<div class="w-12 h-12 bg-slate-50"></div>
	<div class="w-12 h-12 bg-slate-100"></div>
	<div class="w-12 h-12 bg-slate-200"></div>
	<div class="w-12 h-12 bg-slate-300"></div>
	<div class="w-12 h-12 bg-slate-400"></div>
	<div class="w-12 h-12 bg-slate-500"></div>
	<div class="w-12 h-12 bg-slate-600"></div>
	<div class="w-12 h-12 bg-slate-700"></div>
	<div class="w-12 h-12 bg-slate-800"></div>
	<div class="w-12 h-12 bg-slate-900"></div>
	<div class="w-12 h-12 bg-slate-950"></div>
	<div class="w-12 h-12 bg-myslate-50"></div>
	<div class="w-12 h-12 bg-myslate-100"></div>
	<div class="w-12 h-12 bg-myslate-200"></div>
	<div class="w-12 h-12 bg-myslate-300"></div>
	<div class="w-12 h-12 bg-myslate-400"></div>
	<div class="w-12 h-12 bg-myslate-500"></div>
	<div class="w-12 h-12 bg-myslate-600"></div>
	<div class="w-12 h-12 bg-myslate-700"></div>
	<div class="w-12 h-12 bg-myslate-800"></div>
	<div class="w-12 h-12 bg-myslate-900"></div>
	<div class="w-12 h-12 bg-myslate-950"></div>
	<h2>slate</h2>
</div>

<div class="flex">
	<div class="w-12 h-12 bg-red-50"></div>
	<div class="w-12 h-12 bg-red-100"></div>
	<div class="w-12 h-12 bg-red-200"></div>
	<div class="w-12 h-12 bg-red-300"></div>
	<div class="w-12 h-12 bg-red-400"></div>
	<div class="w-12 h-12 bg-red-500"></div>
	<div class="w-12 h-12 bg-red-600"></div>
	<div class="w-12 h-12 bg-red-700"></div>
	<div class="w-12 h-12 bg-red-800"></div>
	<div class="w-12 h-12 bg-red-900"></div>
	<div class="w-12 h-12 bg-red-950"></div>
	<div class="w-12 h-12 bg-myred-50"></div>
	<div class="w-12 h-12 bg-myred-100"></div>
	<div class="w-12 h-12 bg-myred-200"></div>
	<div class="w-12 h-12 bg-myred-300"></div>
	<div class="w-12 h-12 bg-myred-400"></div>
	<div class="w-12 h-12 bg-myred-500"></div>
	<div class="w-12 h-12 bg-myred-600"></div>
	<div class="w-12 h-12 bg-myred-700"></div>
	<div class="w-12 h-12 bg-myred-800"></div>
	<div class="w-12 h-12 bg-myred-900"></div>
	<div class="w-12 h-12 bg-myred-950"></div>
	<h2>red</h2>
</div>

<div class="flex">
	<div class="w-12 h-12 bg-amber-50"></div>
	<div class="w-12 h-12 bg-amber-100"></div>
	<div class="w-12 h-12 bg-amber-200"></div>
	<div class="w-12 h-12 bg-amber-300"></div>
	<div class="w-12 h-12 bg-amber-400"></div>
	<div class="w-12 h-12 bg-amber-500"></div>
	<div class="w-12 h-12 bg-amber-600"></div>
	<div class="w-12 h-12 bg-amber-700"></div>
	<div class="w-12 h-12 bg-amber-800"></div>
	<div class="w-12 h-12 bg-amber-900"></div>
	<div class="w-12 h-12 bg-amber-950"></div>
	<div class="w-12 h-12 bg-myamber-50"></div>
	<div class="w-12 h-12 bg-myamber-100"></div>
	<div class="w-12 h-12 bg-myamber-200"></div>
	<div class="w-12 h-12 bg-myamber-300"></div>
	<div class="w-12 h-12 bg-myamber-400"></div>
	<div class="w-12 h-12 bg-myamber-500"></div>
	<div class="w-12 h-12 bg-myamber-600"></div>
	<div class="w-12 h-12 bg-myamber-700"></div>
	<div class="w-12 h-12 bg-myamber-800"></div>
	<div class="w-12 h-12 bg-myamber-900"></div>
	<div class="w-12 h-12 bg-myamber-950"></div>
	<h2>amber</h2>
</div>

<div class="flex">
	<div class="w-12 h-12 bg-yellow-50"></div>
	<div class="w-12 h-12 bg-yellow-100"></div>
	<div class="w-12 h-12 bg-yellow-200"></div>
	<div class="w-12 h-12 bg-yellow-300"></div>
	<div class="w-12 h-12 bg-yellow-400"></div>
	<div class="w-12 h-12 bg-yellow-500"></div>
	<div class="w-12 h-12 bg-yellow-600"></div>
	<div class="w-12 h-12 bg-yellow-700"></div>
	<div class="w-12 h-12 bg-yellow-800"></div>
	<div class="w-12 h-12 bg-yellow-900"></div>
	<div class="w-12 h-12 bg-yellow-950"></div>
	<div class="w-12 h-12 bg-myyellow-50"></div>
	<div class="w-12 h-12 bg-myyellow-100"></div>
	<div class="w-12 h-12 bg-myyellow-200"></div>
	<div class="w-12 h-12 bg-myyellow-300"></div>
	<div class="w-12 h-12 bg-myyellow-400"></div>
	<div class="w-12 h-12 bg-myyellow-500"></div>
	<div class="w-12 h-12 bg-myyellow-600"></div>
	<div class="w-12 h-12 bg-myyellow-700"></div>
	<div class="w-12 h-12 bg-myyellow-800"></div>
	<div class="w-12 h-12 bg-myyellow-900"></div>
	<div class="w-12 h-12 bg-myyellow-950"></div>
	<h2>yellow</h2>
</div>

<div class="flex">
	<div class="w-12 h-12 bg-emerald-50"></div>
	<div class="w-12 h-12 bg-emerald-100"></div>
	<div class="w-12 h-12 bg-emerald-200"></div>
	<div class="w-12 h-12 bg-emerald-300"></div>
	<div class="w-12 h-12 bg-emerald-400"></div>
	<div class="w-12 h-12 bg-emerald-500"></div>
	<div class="w-12 h-12 bg-emerald-600"></div>
	<div class="w-12 h-12 bg-emerald-700"></div>
	<div class="w-12 h-12 bg-emerald-800"></div>
	<div class="w-12 h-12 bg-emerald-900"></div>
	<div class="w-12 h-12 bg-emerald-950"></div>
	<div class="w-12 h-12 bg-myemerald-50"></div>
	<div class="w-12 h-12 bg-myemerald-100"></div>
	<div class="w-12 h-12 bg-myemerald-200"></div>
	<div class="w-12 h-12 bg-myemerald-300"></div>
	<div class="w-12 h-12 bg-myemerald-400"></div>
	<div class="w-12 h-12 bg-myemerald-500"></div>
	<div class="w-12 h-12 bg-myemerald-600"></div>
	<div class="w-12 h-12 bg-myemerald-700"></div>
	<div class="w-12 h-12 bg-myemerald-800"></div>
	<div class="w-12 h-12 bg-myemerald-900"></div>
	<div class="w-12 h-12 bg-myemerald-950"></div>
	<h2>emer</h2>
</div>

<div class="flex">
	<div class="w-12 h-12 bg-cyan-50"></div>
	<div class="w-12 h-12 bg-cyan-100"></div>
	<div class="w-12 h-12 bg-cyan-200"></div>
	<div class="w-12 h-12 bg-cyan-300"></div>
	<div class="w-12 h-12 bg-cyan-400"></div>
	<div class="w-12 h-12 bg-cyan-500"></div>
	<div class="w-12 h-12 bg-cyan-600"></div>
	<div class="w-12 h-12 bg-cyan-700"></div>
	<div class="w-12 h-12 bg-cyan-800"></div>
	<div class="w-12 h-12 bg-cyan-900"></div>
	<div class="w-12 h-12 bg-cyan-950"></div>
	<div class="w-12 h-12 bg-mycyan-50"></div>
	<div class="w-12 h-12 bg-mycyan-100"></div>
	<div class="w-12 h-12 bg-mycyan-200"></div>
	<div class="w-12 h-12 bg-mycyan-300"></div>
	<div class="w-12 h-12 bg-mycyan-400"></div>
	<div class="w-12 h-12 bg-mycyan-500"></div>
	<div class="w-12 h-12 bg-mycyan-600"></div>
	<div class="w-12 h-12 bg-mycyan-700"></div>
	<div class="w-12 h-12 bg-mycyan-800"></div>
	<div class="w-12 h-12 bg-mycyan-900"></div>
	<div class="w-12 h-12 bg-mycyan-950"></div>
	<h2>cyan</h2>
</div>

<div class="flex">
	<div class="w-12 h-12 bg-blue-50"></div>
	<div class="w-12 h-12 bg-blue-100"></div>
	<div class="w-12 h-12 bg-blue-200"></div>
	<div class="w-12 h-12 bg-blue-300"></div>
	<div class="w-12 h-12 bg-blue-400"></div>
	<div class="w-12 h-12 bg-blue-500"></div>
	<div class="w-12 h-12 bg-blue-600"></div>
	<div class="w-12 h-12 bg-blue-700"></div>
	<div class="w-12 h-12 bg-blue-800"></div>
	<div class="w-12 h-12 bg-blue-900"></div>
	<div class="w-12 h-12 bg-blue-950"></div>
	<div class="w-12 h-12 bg-myblue-50"></div>
	<div class="w-12 h-12 bg-myblue-100"></div>
	<div class="w-12 h-12 bg-myblue-200"></div>
	<div class="w-12 h-12 bg-myblue-300"></div>
	<div class="w-12 h-12 bg-myblue-400"></div>
	<div class="w-12 h-12 bg-myblue-500"></div>
	<div class="w-12 h-12 bg-myblue-600"></div>
	<div class="w-12 h-12 bg-myblue-700"></div>
	<div class="w-12 h-12 bg-myblue-800"></div>
	<div class="w-12 h-12 bg-myblue-900"></div>
	<div class="w-12 h-12 bg-myblue-950"></div>
	<h2>blue</h2>
</div>

{#each lightness as l, i}
	<div class="flex">
		{#each hr as add}
			<div
				class="w-12 h-12"
				style="background-color: oklch({l * 100}%, {chroma[i]}, {x + add})"
				on:click={() => {
					d = [l, chroma[i], x, add];
					console.log('oklch(', l * 100, '%,', chroma[i], ',', x + add, ')');
				}}
			></div>
		{/each}
	</div>
{/each}
The foundation of a good color palette in OKLCH lies in selecting appropriate lightness and chroma values.
For my project, I aimed to create a versatile palette for Tailwind CSS, which necessitated a broad spectrum
of lightness and chroma to cater to various design needs.

{#each lightness as l, i}
	<div class="flex">
		{#each hr as add}
			<div
				class="w-12 h-12"
				style="background-color: oklch({l * 100}%, {chroma[i]}, {x + add})"
				on:click={() => {
					d = [l, chroma[i], x, add];
					console.log('oklch(', l * 100, '%,', chroma[i], ',', x + add, ')');
				}}
			></div>
		{/each}
	</div>
{/each}

<div class="flex m-4">
	<div class="flex flex-col">
		<div class="flex">
			{#each lightness as l, i}
				<div
					class="w-16 h-16"
					style="background-color: oklch({l * 100}%, {chroma[i]}, {d[2] + d[3]})"
				></div>
			{/each}
			<pre><code>
name: &#123
	50:  'oklch(97.78% 0.0100 {d[2] + d[3]})',
	100: 'oklch(93.56% 0.0321 {d[2] + d[3]})',
	200: 'oklch(88.11% 0.0609 {d[2] + d[3]})',
	300: 'oklch(82.67% 0.0908 {d[2] + d[3]})',
	400: 'oklch(74.22% 0.1398 {d[2] + d[3]})',
	500: 'oklch(64.78% 0.1472 {d[2] + d[3]})',
	600: 'oklch(57.33% 0.1299 {d[2] + d[3]})',
	700: 'oklch(46.89% 0.1067 {d[2] + d[3]})',
	800: 'oklch(39.44% 0.0898 {d[2] + d[3]})',
	900: 'oklch(32.00% 0.0726 {d[2] + d[3]})',
	950: 'oklch(23.78% 0.0540 {d[2] + d[3]})'
&#125
			</code></pre>
		</div>
		<div class="flex">
			{#each lightness as l, i}
				<div
					class="w-16 h-16"
					style="background-color: oklch({l * 100}%, {chroma[i] < 0.0401
						? chroma[i]
						: 0.0401}, {d[2] + d[3]})"
				></div>
			{/each}
			<pre><code>
name: &#123
	50:  'oklch(97.78% 0.0100 {d[2] + d[3]})',
	100: 'oklch(93.56% 0.0321 {d[2] + d[3]})',
	200: 'oklch(88.11% 0.0401 {d[2] + d[3]})',
	300: 'oklch(82.67% 0.0401 {d[2] + d[3]})',
	400: 'oklch(74.22% 0.0401 {d[2] + d[3]})',
	500: 'oklch(64.78% 0.0401 {d[2] + d[3]})',
	600: 'oklch(57.33% 0.0401 {d[2] + d[3]})',
	700: 'oklch(46.89% 0.0401 {d[2] + d[3]})',
	800: 'oklch(39.44% 0.0401 {d[2] + d[3]})',
	900: 'oklch(32.00% 0.0401 {d[2] + d[3]})',
	950: 'oklch(23.78% 0.0401 {d[2] + d[3]})'
&#125
			</code></pre>
		</div>
	</div>
</div>
