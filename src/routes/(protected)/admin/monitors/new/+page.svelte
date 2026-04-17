<script lang="ts">
    import Button from "$lib/components/form/Button.svelte";
    import { goto } from "$app/navigation";
    import Input from "$lib/components/form/Input.svelte";
    import Select from "$lib/components/form/Select.svelte";
    import TagInput from "$lib/components/form/TagInput.svelte";
    import { enhance } from '$app/forms';
    import { notifyStore } from "$lib/notifications/notificationStore";

    let { data } = $props();
    let loading = $state(false);
</script>

<div class="max-w-5xl mx-auto space-y-8 py-8 px-4">
    <header class="flex items-end justify-between border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div>
            <h1 class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Add Monitor</h1>
            <p class="text-zinc-500 mt-1">Configure a new service monitor to track uptime.</p>
        </div>
        <a href="/admin/monitors" class="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
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
                    notifyStore.add("Failed to create Monitor: " + msg, {type: "error"});
                } else if(result.type === "success") {
                    notifyStore.add("Monitor created successfully.", {type: "success"});
                    if(result.data?.id) {
                        await goto(`/admin/monitors/${result.data.id}`);
                    } else {
                        await goto("/admin/monitors");
                    }
                }
                await update();
                loading = false;
            };
        }}
    >
        <div class="lg:col-span-2 space-y-6">
            <div class="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-6 shadow-sm dark:shadow-none">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input id="name" label="Name" name="name" required placeholder="e.g. Main API" />
                    <Select
                            id="type" label="Type" name="type"
                            options={[{label: "HTTP(s)", value: "http"}, {label: "PING (ICMP)", value: "ping"}]}
                            value="http"
                            required
                    />
                </div>

                <Input id="url" label="URL / Target" name="url" required placeholder="https://api.example.com" />

                <div class="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <TagInput
                            id="status-codes" name="statusCodes" label="Expected Status Codes"
                            placeholder="e.g. 200, 204"
                            value={["200", "201", "202", "204"]}
                    />
                    <p class="text-xs text-zinc-500 mt-2">The monitor will mark the service as "down" if it returns a different code.</p>
                </div>
            </div>
        </div>

        <div class="space-y-6">
            <div class="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-6 shadow-sm dark:shadow-none">
                <h3 class="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Thresholds</h3>

                <div class="space-y-4">
                    <Input id="check-interval" label="Check Interval" name="checkInterval" type="number" value="60" suffix="sec" />
                    <Input id="timeout" label="Timeout" name="timeout" type="number" value="30" suffix="sec" />
                    <Input id="retries" label="Retries" name="retries" type="number" value="0" suffix="times" />
                </div>

                <div class="pt-4">
                    <Button type="submit" class="w-full justify-center py-3" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Monitor'}
                    </Button>
                </div>
            </div>

            <div class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10">
                <h4 class="text-sm font-medium text-emerald-700 dark:text-emerald-500 mb-2 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clip-rule="evenodd" />
                    </svg>
                    Quick Tip
                </h4>
                <p class="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    HTTP monitors follow redirects by default. For PING monitors, make sure your firewall allows ICMP traffic.
                </p>
            </div>
        </div>
    </form>
</div>