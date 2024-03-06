<script lang="ts">
	export let showTodos: boolean = true;
</script>

<p class="mt-8 mb-4">
	I created this utility to experiment with the OKLCH colorspace and for refreshing my knowledge of
	color theory and SvelteJS. It was created over a weekend and does not use any server side code.
	Although, it has many features that are comparable to popular color generators, it is still a fun
	little tool hosted on Vercel.<br /><br />
	<strong>
		If you believe the tool can be improved in some way, please feel free to reach me via email.
	</strong> My email is provided at the bottom of the page.
</p>

{#if showTodos}
	<h2 class="mt-8">Todos</h2>
	<ul class="list-disc list-inside mt-2">
		<li>Allow exporting color palettes (and/or currently zoomed one).</li>
		<li>Double click on a color to set it as base color.</li>
	</ul>

	<h2 class="mt-8">Completed</h2>
	<ul class="list-disc list-inside mt-2">
		<li><del>Allow sharing of color-palettes by linking to a permalink.</del></li>
		<li><del>Single click on a color to copy it.</del></li>
		<li><del>Bug in input for hex color - user can not type a hex color.</del></li>
		<li>
			<del>Random color should also vary in chroma instead of being fixed at max chroma.</del>
		</li>
		<li><del>Highlight base color in all palettes.</del></li>
		<li>
			<del>
				Lightness in Color palettes (e.g. triadic, tetradic, etc) should be relative to base color.
			</del>
		</li>
	</ul>
{/if}
