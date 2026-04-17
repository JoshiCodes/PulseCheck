<script lang="ts">
    import Button from "$lib/components/form/Button.svelte";
    import Checkbox from "$lib/components/form/Checkbox.svelte";
    import Select from "$lib/components/form/Select.svelte";
    import {notifyStore} from "$lib/notifications/notificationStore";
    import {enhance} from "$app/forms";

    let { data } = $props();

    let settings = $derived(data.settings);

    let loading = $state(false);
</script>

<div class="space-y-8">
    <header class="space-y-2 border-b border-zinc-300 dark:border-zinc-800 pb-6">
        <h1 class="text-3xl font-bold">Settings</h1>
        <p class="text-zinc-400">
            Configure and manage your <span class="text-primary font-medium">PulseCheck</span> instance global preferences.
        </p>
    </header>

    <form class="space-y-8" method="post" action="?/saveSettings"
          use:enhance={() => {
            loading = true;
            return async ({ result, update }) => {
                if(result.type === "failure") {
                    const msg = result.data?.error ?? "Unknown error.";
                    notifyStore.add("Failed to update settings: " + msg, {type: "error"});
                } else if(result.type === "success") {
                    notifyStore.add("Successfully saved settings..", {type: "success"});
                }
                await update();
                loading = false;
            };
        }}
    >
        <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="space-y-1">
                <h2 class="text-lg font-medium text-zinc-700 dark:text-zinc-200">Authentication</h2>
                <p class="text-sm text-zinc-500">Control how users interact with your instance.</p>
            </div>

            <div class="md:col-span-2">
                <div class="bg-zinc-300/50 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-xl p-6 transition-all hover:border-zinc-700/50">
                    <div class="flex items-start justify-between">
                        <div class="space-y-1">
                            <Checkbox
                                    id="allowSignUp"
                                    name="allowSignUp"
                                    label="Allow Public Signups"
                                    checked={settings.allowSignUp}
                            />
                            <p class="text-xs text-zinc-500 ml-7">
                                If enabled, anyone can create a new account.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="space-y-1">
                <h2 class="text-lg font-medium text-zinc-700 dark:text-zinc-200">Pages</h2>
                <p class="text-sm text-zinc-500">
                    Define the layout and content of your pages.
                </p>
            </div>

            <div class="md:col-span-2 flex flex-col gap-6">
                <div class="bg-zinc-300/50 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-xl p-6 transition-all hover:border-zinc-700/50">
                    <div class="flex items-start justify-between">
                        <div class="space-y-1">
                            <Checkbox
                                    id="showAllOnMainPage"
                                    name="showAllOnMainPage"
                                    label="Show all states on main page"
                                    checked={settings.showAllOnMainPage}
                            />
                            <p class="text-xs text-zinc-500 ml-7">
                                If enabled, all states will be shown on the main page.
                                Otherwise, the main page will redirect to /login or the default status page.
                            </p>
                        </div>
                    </div>
                </div>
                <div class="bg-zinc-300/50 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-xl p-6 transition-all hover:border-zinc-700/50">
                    <div class="flex items-start justify-between">
                        <div class="space-y-1">
                            <Select
                                    id="defaultStatusPage"
                                    name="defaultStatusPage"
                                    label="Default Status Page"
                                    options={
                                        [
                                            {label: 'None', value: ""}
                                            , ...settings.allPages?.map(page => ({label: page.name, value: String(page.slug)}))
                                        ]
                                    }
                                    bind:value={settings.defaultStatusPage}
                            />
                            <p class="text-xs text-zinc-500">
                                Select the default status page to show when users visit the main page.
                                If no status page is selected, the main page will redirect to /login. <br>
                                This requires the "Show all states on main page" setting to be disabled.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <div class="pt-6 border-t border-zinc-300 dark:border-zinc-800 flex items-center justify-end gap-4">
            <span class="text-xs text-zinc-500 italic">Last saved: {settings.lastSaved ?? "Never"}</span>
            <Button
                    type="submit"
                    class="bg-primary text-primary-foreground hover:opacity-90 px-8 transition-all"
                    disabled={loading}
            >
                {#if loading}
                    Saving...
                {:else}
                    Save Changes
                {/if}
            </Button>
        </div>
    </form>
</div>