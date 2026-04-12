<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import BackgroundGrid from "$lib/components/BackgroundGrid.svelte";
	import NotificationsContainer from "$lib/notifications/NotificationsContainer.svelte";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<script>
		if (
			localStorage.theme === 'dark' ||
			(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	</script>
</svelte:head>

<div class="flex min-h-screen flex-col">
	<BackgroundGrid />
	<Navbar />
	<NotificationsContainer />
	<main class="grow">
		{@render children()}
	</main>
	<Footer />
</div>
