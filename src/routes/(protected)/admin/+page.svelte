<script lang="ts">
    import Checkbox from "$lib/components/form/Checkbox.svelte";
    import Select from "$lib/components/form/Select.svelte";
    import {notifyStore} from "$lib/notifications/notificationStore";
    import {enhance} from "$app/forms";
    import Button from "$lib/components/form/Button.svelte";
    import BottomPopup from "$lib/components/BottomPopup.svelte";

    let { data } = $props();

    let settings = $derived(data.settings);

    let loading = $state(false);
    let dirty = $state(false);

    function markDirty() {
        dirty = true;
    }
</script>

<div class="space-y-8">
    <header class="space-y-2 border-b border-zinc-300 dark:border-zinc-800 pb-6">
        <h1 class="text-3xl font-bold">Settings</h1>
        <p class="text-zinc-400">
            Configure and manage your <span class="text-primary font-medium">PulseCheck</span> instance global preferences.
        </p>
    </header>

    <form id="settings-form" class="space-y-8" method="post" action="?/saveSettings"
          onchange={markDirty}
          use:enhance={() => {
            loading = true;
            return async ({ result, update }) => {
                if(result.type === "failure") {
                    const msg = result.data?.error ?? "Unknown error.";
                    notifyStore.add("Failed to update settings: " + msg, {type: "error"});
                } else if(result.type === "success") {
                    notifyStore.add("Successfully saved settings..", {type: "success"});
                    dirty = false;
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

        <div class="pt-6 border-t border-zinc-300 dark:border-zinc-800 flex items-center justify-end">
            <span class="text-xs text-zinc-500 italic">Last saved: {settings.lastSaved ?? "Never"}</span>
        </div>
    </form>

    <BottomPopup visible={dirty}>
        <div class="flex items-center justify-between w-full max-w-5xl mx-auto px-4">
            <div class="flex items-center gap-3">
                <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span class="text-zinc-900 dark:text-zinc-100 font-medium text-sm">
                    You have unsaved changes!
                </span>
            </div>
            <div class="flex items-center gap-2">
                <Button variant="ghost" onclick={() => { dirty = false; }} size="sm" class="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">
                    Discard
                </Button>
                <Button type="submit" form="settings-form" size="sm" disabled={loading} class="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 px-6">
                    {loading ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </div>
    </BottomPopup>
</div>