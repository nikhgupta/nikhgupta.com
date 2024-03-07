<script>
	import { DarkMode, NavHamburger, Navbar, NavUl, NavLi, NavBrand } from 'flowbite-svelte';
	import { page } from '$app/stores';
	$: activeUrl = $page.url.pathname;
</script>

<div class="flex justify-start">
	<Navbar
		fluid={true}
		class="bg-transparent dark:bg-transparent text-slate-950 dark:text-slate-50 border-slate-100 dark:border-slate-900 divide-slate-100 dark:divide-slate-900 py-2.5 px-0 sm:px-0 pt-16"
	>
		{#if activeUrl != '/'}
			<NavBrand href="/" class="no-underline logo font-shalimar h1 justify-center flex">
				<span>Nikhil Gupta</span>
				{#if activeUrl.includes('/posts')}
					<span class="text-4xl ml-8 mt-2 hidden md:block">writes seldomly.</span>
				{:else if activeUrl.includes('/resume')}
					<span class="text-4xl ml-8 mt-2 hidden md:block">being a professional.</span>
				{:else if activeUrl.includes('/tools')}
					<span class="text-4xl ml-8 mt-2 hidden md:block">created a stupid tool.</span>
				{/if}
			</NavBrand>
		{/if}
		<NavHamburger />
		<NavUl
			{activeUrl}
			ulClass="list-none flex flex-col py-4 mt-4 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:text-sm md:font-medium justify-end"
			activeClass="text-slate-600 dark:text-slate-400"
		>
			<NavLi href="/posts">Posts</NavLi>
			<NavLi href="/colophon">Colophon</NavLi>
			<NavLi href="/about">About</NavLi>
			<NavLi href="/contact">Contact</NavLi>
		</NavUl>
	</Navbar>
	<DarkMode
		class="ml-5 mb-1 pt-16 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-lg text-xl"
	/>
</div>
