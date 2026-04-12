<script lang="ts">
    import Button from '$lib/components/Button.svelte';
    import Input from '$lib/components/Input.svelte';
    import Card from '$lib/components/Card.svelte';
    import { enhance } from "$app/forms";
    import {notifyStore} from "$lib/notifications/notificationStore";
    import {onMount} from "svelte";

    let isLoading = $state(false);

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
    </Card>
</div>