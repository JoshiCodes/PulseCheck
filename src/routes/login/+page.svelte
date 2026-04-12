<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Link from '$lib/components/Link.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Card from '$lib/components/Card.svelte';

	let email = $state('');
	let password = $state('');
	let rememberMe = $state(false);

</script>

<div class="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
	<Card class="w-full max-w-1/3 border-none bg-card p-8 shadow-lg ring-1 ring-border">
		{#snippet header()}
			<div class="mb-8 text-center">
				<h2 class="text-3xl font-bold tracking-tight text-foreground">Welcome Back</h2>
				<p class="mt-2 text-sm text-muted-foreground">Please log in to continue.</p>
			</div>
		{/snippet}

		<form class="space-y-5" method="POST">
			<Input
					id="email"
					name="email"
					type="email"
					label="E-Mail"
					placeholder="name@mail.com"
					required
					bind:value={email}
			/>

			<Input
					id="password"
					name="password"
					type="password"
					label="Passwort"
					placeholder="••••••••"
					required
					bind:value={password}
			/>

			<div class="flex items-center justify-between">
				<Checkbox id="remember-me" label="Stay logged in" bind:checked={rememberMe} />
				<Link href="/forgot-password" variant="muted" class="text-xs">Forgot Password?</Link>
			</div>

			<Button type="submit" class="w-full bg-primary text-primary-foreground hover:opacity-90" size="lg">
				Log in
			</Button>
		</form>
	</Card>
</div>