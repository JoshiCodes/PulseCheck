<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Link from '$lib/components/Link.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Card from '$lib/components/Card.svelte';
	import {signIn} from "$lib/auth-client";
	import {notifyStore} from "$lib/notifications/notificationStore";
	import { enhance } from '$app/forms';

	let { data } = $props();

	let isLoading = $state(false);

	let email = $state('');
	let password = $state('');
	let rememberMe = $state(false);

	const loginWithProvider = async (providerId: string) => {
		console.log("Login with provider:", providerId);
		await signIn.social({
			provider: providerId as any,
			callbackURL: "/admin"
		});
	};
</script>

<div class="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
	<Card class="w-full max-w-md border-none bg-light dark:bg-dark p-8 shadow-lg ring-1 ring-border">
		{#snippet header()}
			<div class="mb-8 text-center">
				<h2 class="text-3xl font-bold tracking-tight text-foreground">Welcome Back</h2>
				<p class="mt-2 text-sm text-muted-foreground">Please log in to continue.</p>
			</div>
		{/snippet}

		<form class="space-y-5" method="POST" use:enhance={() => {
            isLoading = true;
            return async ({result, update}) => {
                if(result.type === "failure") {
                    let msg;
                    if(result.data && result.data.error) {
                        msg = result.data.error;
                    } else {
                        msg = "Unknown error."
                    }
                    notifyStore.add("Failed to log in: " + msg, {type: "error"})
                }

                await update();
                isLoading = false;
            }
        }}>
			<Input id="email" name="email" type="email" label="E-Mail" bind:value={email} required />
			<Input id="password" name="password" type="password" label="Passwort" bind:value={password} required />

			<div class="flex items-center justify-between">
				<Checkbox id="remember-me" label="Stay logged in" bind:checked={rememberMe} />
				<Link href="/forgot-password" variant="muted" class="text-xs">Forgot Password?</Link>
			</div>

			<Button disabled={isLoading} type="submit" class="w-full bg-primary text-primary-foreground hover:opacity-90" size="lg">
				Log in
			</Button>
		</form>

		{#if data.providers.length > 0}
			<div class="relative my-8">
				<div class="absolute inset-0 flex items-center"><span class="w-full border-t border-border"></span></div>
				<div class="relative flex justify-center text-xs uppercase">
					<span class="bg-light dark:bg-dark px-2 text-muted-foreground">Or continue with</span>
				</div>
			</div>

			<div class="grid grid-cols-1 gap-3">
				{#each data.providers as provider}
					<Button
							variant="outline"
							class="w-full border-border hover:bg-zinc-100 dark:hover:bg-zinc-800"
							onclick={() => loginWithProvider(provider.id)}
					>
						<span>Login with {provider.name}</span>
					</Button>
				{/each}
			</div>
		{/if}
	</Card>
</div>