<script lang="ts">
	import ThemeToggle from './ThemeToggle.svelte';
	import Logo from './Logo.svelte';
	import Button from './form/Button.svelte';
	import {signOut, useSession} from "$lib/auth-client";
	import {page} from "$app/state";

	const session = useSession();
	const headerLinks = $derived(page.data.headerLinks || []);

	async function logout() {
		await signOut({
			fetchOptions: {
				onSuccess: () => {
					window.location.href = "/";
				}
			}
		});
	}
</script>

<nav class="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
	<div class="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
		<a href="/" class="flex items-center gap-2 text-xl font-bold tracking-tight text-primary">
			<Logo />
			PulseCheck
		</a>
		<div class="flex items-center gap-8">
			<div class="hidden md:flex md:gap-x-6">
				{#if $session.data}
					<a href="/admin" class="text-sm font-medium transition-colors hover:text-primary">Dashboard</a>
				{/if}
				{#each headerLinks as link}
					<a href={link.url} class="text-sm font-medium transition-colors hover:text-primary">{link.name}</a>
				{/each}
			</div>
		</div>

		<div class="flex items-center gap-4">
			<ThemeToggle />
			{#if $session.data}
				<Button variant="primary" size="sm" onclick={logout}>
					Log out
				</Button>
			{:else}
				<Button variant="primary" size="sm" onclick={() => (window.location.href = '/login')}>
					Sign In
				</Button>
			{/if}
		</div>
	</div>
</nav>
