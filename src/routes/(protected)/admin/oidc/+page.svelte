<script lang="ts">
    import { enhance } from '$app/forms';
    import Input from '$lib/components/Input.svelte';
    import {page} from "$app/state";
    import Select from "$lib/components/Select.svelte";
    import {notifyStore} from "$lib/notifications/notificationStore";
    import Button from "$lib/components/Button.svelte";

    let { data, form } = $props();
    let loading = $state(false);

    let id = $state('');
    // Hilfsvariable für den Provider-Typ (um Issuer-Feld zu zeigen/verstecken)

    const callbackUri = $derived(`${page.url.origin}/api/auth/oauth2/callback/${id || 'provider-id'}`);
</script>

<div class="space-y-8">
    <header>
        <h1 class="text-3xl font-bold">OIDC Providers</h1>
        <p class="text-zinc-500">Manage external OIDC Providers to log in with.</p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div class="lg:col-span-2 space-y-4">
            <h2 class="text-xl font-semibold">Active Providers</h2>
            <div class="grid gap-4">
                {#each data.providers as p}
                    <div class="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl flex justify-between items-center shadow-sm">
                        <div>
                            <div class="flex items-center gap-2">
                                <span class="font-bold">{p.name}</span>
                                <span class="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 uppercase font-mono">
                                    {p.id}
                                </span>
                            </div>
                            <p class="text-xs text-zinc-400 mt-1">{p.issuer || 'Native OAuth'}</p>
                        </div>
                        <form method="POST" action="?/delete&id={p.id}" use:enhance>
                            <button class="text-zinc-400 hover:text-red-500 p-2 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                <span class="sr-only">Delete</span>
                            </button>
                        </form>
                    </div>
                {/each}
                {#if data.providers.length === 0}
                    <div class="p-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-center text-zinc-500">
                        No providers configured yet.
                    </div>
                {/if}
            </div>
        </div>

        <div class="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm h-fit">
            <h2 class="text-xl font-semibold mb-6">Add Provider</h2>
            <form method="POST" action="?/save" use:enhance={() => {
            loading = true;
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
                if(result.type === "success") {
                    notifyStore.add("Provider created successfully. The Server will now reboot to apply changes.", {type: "success"})
                }
                loading = false;
            }
        }} class="space-y-4">

                <Input id="id" bind:value={id} name="id" label="Provider ID (Slug)" placeholder="google, my-provider" required />
                <Input id="name" name="name" label="Displayname" placeholder="Google, My Provider" required />

                <Input id="clientId" name="clientId" label="Client ID" required />
                <Input id="clientSecret" name="clientSecret" label="Client Secret" type="password" required />

                <Input id="issuer" name="issuer" label="Issuer URL" placeholder="https://..." required />

                <Select id="authentication" name="authentication" options={[{label: 'Basic Auth', value: 'basic'}, {label: 'Body', value: 'post'}]} label="Authentication Type" required />

                <Input id="scope" name="scope" label="Scope" placeholder="openid profile email" />

                <Button
                        type="submit"
                        disabled={loading}
                        class="w-full  py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                    {loading ? 'Saving...' : 'Save Provider'}
                </Button>

                <p class="text-center text-sm text-zinc-500 mt-4">
                    Make sure your provider has the following as a valid redirect uri:
                    <code class="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded-md">
                        {callbackUri}
                    </code>
                </p>

            </form>
        </div>
    </div>
</div>