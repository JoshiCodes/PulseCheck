<script lang="ts">
    import Button from "$lib/components/form/Button.svelte";
    import Input from "$lib/components/form/Input.svelte";
    import MultiSelect from "$lib/components/form/MultiSelect.svelte";
    import { goto } from "$app/navigation";
    import { enhance } from '$app/forms';
    import { notifyStore } from "$lib/notifications/notificationStore";
    import Checkbox from "$lib/components/form/Checkbox.svelte";

    let { data } = $props();
    let loading = $state(false);

    const monitors = $derived(data.monitors);

    const monitorOptions = $derived(monitors.map(monitor => ({ value: monitor.id.toString(), label: monitor.name })));

    let selectedMonitors = $state([]);
</script>

<div class="max-w-5xl mx-auto space-y-8 py-8 px-4">
    <header class="flex items-end justify-between border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div>
            <h1 class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Add Status Page</h1>
            <p class="text-zinc-500 mt-1">Create a public or private status dashboard.</p>
        </div>
        <a href="/admin/pages" class="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
            ← Back to overview
        </a>
    </header>

    <form
            action="?/create"
            method="POST"
            class="grid grid-cols-1 lg:grid-cols-3 gap-8"
            use:enhance={() => {
            loading = true;
            return async ({ result, update }) => {
                if(result.type === "failure") {
                    const msg = result.data?.error ?? "Unknown error.";
                    notifyStore.add("Failed to create Status Page: " + msg, {type: "error"});
                } else if(result.type === "success") {
                    notifyStore.add("Status Page created successfully.", {type: "success"});
                    if(result.data?.id) {
                        await goto(`/admin/pages/${result.data.id}`);
                    } else {
                        await goto("/admin/pages");
                    }
                }
                await update();
                loading = false;
            };
        }}
    >
        <div class="lg:col-span-2 space-y-6">
            <div class="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-5 shadow-sm dark:shadow-none">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input id="name" label="Display Name" name="name" required placeholder="e.g. Public Services" />
                    <Input id="slug" label="URL Slug (/status/[slug])" name="slug" required placeholder="e.g. system-status" />
                </div>

                <div class="pt-2">
                    <MultiSelect
                            id="monitors"
                            name="monitors"
                            label="Assigned Monitors"
                            options={monitorOptions}
                            bind:value={selectedMonitors}
                    />
                </div>
            </div>
        </div>

        <div class="space-y-6">
            <div class="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-6 shadow-sm dark:shadow-none">
                <h3 class="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Settings</h3>

                <div class="space-y-4">
                    <div class="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-700/50 transition-colors">
                        <Checkbox id="active" name="active" label="Active" checked={true} />
                        <p class="text-xs text-zinc-500 ml-7 mt-1">If disabled, the page is not accessible.</p>
                    </div>

                    <div class="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-700/50 transition-colors">
                        <Checkbox id="requiresAuth" name="requiresAuth" label="Authentication required" />
                        <p class="text-xs text-zinc-500 ml-7 mt-1">Only logged in users can view this page.</p>
                    </div>
                </div>

                <div class="pt-4">
                    <Button type="submit" class="w-full justify-center py-3" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Status Page'}
                    </Button>
                </div>
            </div>
        </div>
    </form>
</div>