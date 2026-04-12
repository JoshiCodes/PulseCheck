<script lang="ts">
    import Button from '$lib/components/Button.svelte';
    import Input from '$lib/components/Input.svelte';
    import Card from '$lib/components/Card.svelte';
    import { enhance } from "$app/forms";
    import {notifyStore} from "$lib/notifications/notificationStore";
    import {signIn, signUp} from "$lib/auth-client.ts";

    let { data } = $props();

    let isLoading = $state(false);

    const signUpWithProvider = async (providerId: string) => {
        console.log("Creating Account with provider:", providerId);
        try {
            await signIn.social({
                provider: providerId as any,
                callbackURL: "/admin"
            });
        } catch (err: any) {
            console.error("Error during sign up:", err);
        }
    };

</script>

<div class="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
    <Card class="w-full max-w-1/3 border-none bg-card p-8 shadow-lg ring-1 ring-border">
        {#snippet header()}
            <div class="mb-8 text-center">
                <h2 class="text-3xl font-bold tracking-tight text-foreground">Setup</h2>
                <p class="mt-2 text-sm text-muted-foreground">
                    Thank you for using <b>PulseCheck</b>. <br>
                    To start, please create an account.
                </p>
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
                    notifyStore.add("Failed to create user: " + msg, {type: "error"})
                }

                await update();
                isLoading = false;
            }
        }}>

            <Input
                    id="name"
                    name="name"
                    type="text"
                    label="Username"
                    placeholder="admin"
                    required
            />

            <Input
                    id="email"
                    name="email"
                    type="email"
                    label="E-Mail"
                    placeholder="name@mail.com"
                    required
            />

            <Input
                    id="password"
                    name="password"
                    type="password"
                    label="Passwort"
                    placeholder="••••••••"
                    required
            />

            <Input
                    id="password_confirm"
                    name="password_confirm"
                    type="password"
                    label="Confirm Passwort"
                    placeholder="••••••••"
                    required
            />

            <Button disabled={isLoading} type="submit" class="w-full bg-primary text-primary-foreground hover:opacity-90" size="lg">
                Log in
            </Button>
        </form>

        {#if data.providers?.length > 0}
            <div class="relative my-8">
                <div class="absolute inset-0 flex items-center"><span class="w-full border-t border-border"></span></div>
                <div class="relative flex justify-center text-xs uppercase">
                    <span class="bg-light dark:bg-dark px-2 text-muted-foreground">Or</span>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-3">
                {#each data.providers as provider}
                    <Button
                            variant="outline"
                            class="w-full border-border hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            onclick={() => signUpWithProvider(provider.id)}
                    >
                        <span>Create User with {provider.name}</span>
                    </Button>
                {/each}
            </div>
        {/if}
    </Card>
</div>