<script lang="ts">
    import Button from "$lib/components/form/Button.svelte";
    import {goto} from "$app/navigation";
    import Input from "$lib/components/form/Input.svelte";
    import Select from "$lib/components/form/Select.svelte";
    import TagInput from "$lib/components/form/TagInput.svelte";
    import { enhance } from '$app/forms';
    import {notifyStore} from "$lib/notifications/notificationStore";

    let { data } = $props();

    let loading = $state(false);

</script>

<div class="space-y-8">
    <header>
        <h1 class="text-3xl font-bold">Add Monitor</h1>
        <p class="text-zinc-500">Create a new Service Monitor.</p>
    </header>

    <div class="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm h-fit sticky top-8">
        <form action="?/create" method="POST" use:enhance={() => {
                loading = true;
                return async ({ result, update }) => {
                    if(result.type === "failure") {
                        let msg;
                        if(result.data && result.data.error) {
                            msg = result.data.error;
                        } else {
                            msg = "Unknown error."
                        }
                        notifyStore.add("Failed to create Monitor: " + msg, {type: "error"})
                    } else if(result.type === "success") {
                        notifyStore.add("Monitor created successfully.", {type: "success"})
                        if(result.data && result.data.id) {
                            await goto(`/admin/monitors/${result.data.id}`);
                        } else {
                            notifyStore.add("Failed to retrieve Monitor ID.", {type: "warning"})
                            await goto("/admin/monitors");
                        }
                    }
                    await update();
                    loading = false;
                };
        }}>
            <div class="grid md:grid-cols-3 gap-4 md:gap-8">
                <div>
                    <Input id="name" label="Name" name="name" required />
                    <Input id="url" label="URL" name="url" required placeholder="https://..." />
                    <Select id="type" label="Type" name="type"
                            options={[{label: "HTTP(s)", value: "http"}, {label: "PING (ICMP)", value: "ping"}]}
                            value="http"
                            required />
                </div>
                <div>
                    <div>
                        <Input id="check-interval" label="Check Interval (seconds)" name="checkInterval" type="number" value="60" suffix="seconds" />
                        <Input id="timeout" label="Timeout (seconds)" name="timeout" type="number" value="30" suffix="seconds" />
                        <Input id="retries" label="Retries" name="retries" type="number" value="0" suffix="times" />
                    </div>
                </div>
                <div>
                    <dl class="text-zinc-700 dark:text-zinc-400">
                        <dt class="font-semibold">Name</dt>
                            <dd>The name of the monitor.</dd>
                        <dt class="font-semibold">URL</dt>
                            <dd>The URL to monitor.</dd>
                        <dt class="font-semibold">Type</dt>
                            <dd>The type of monitor.</dd>
                        <dt class="font-semibold">Check Interval</dt>
                            <dd>The interval (in seconds) at which the monitor will check the URL.</dd>
                        <dt class="font-semibold">Timeout</dt>
                            <dd>The timeout (in seconds) for the monitor to respond.</dd>
                        <dt class="font-semibold">Retries</dt>
                            <dd>The number of retries to attempt if the monitor fails to respond.</dd>
                    </dl>
                </div>
            </div>
            <div class="mt-2 md:mt-4 grid md:grid-cols-3 gap-4 md:gap-8">
                <TagInput
                        class="col-span-2"
                        id="status-codes" name="statusCodes" label="Expected Status Codes"
                        placeholder="e.g. 200, 204"
                        value={["200", "201", "202", "204"]}
                        />
            </div>
            <div class="mt-4 md:mt-8">
                <Button type="submit" disabled={loading}>Create</Button>
            </div>
        </form>
    </div>

    <div class="mt-6">
        <a href="/admin/monitors" class="text-sm text-zinc-500 hover:text-zinc-700">
            ← Back to overview
        </a>
    </div>
</div>