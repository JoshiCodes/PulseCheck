<script lang="ts">
    import Input from '$lib/components/form/Input.svelte';
    import Checkbox from '$lib/components/form/Checkbox.svelte';
    import Button from '$lib/components/form/Button.svelte';

</script>

<div class="max-w-5xl mx-auto space-y-8 py-8 px-4">
    <header class="border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <h1 class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Notification Providers</h1>
        <p class="text-zinc-500 mt-1">Manage how notifications reach you when a monitor changes state.</p>
    </header>

    <div class="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm dark:shadow-none space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h2 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Email (SMTP)</h2>
                <p class="text-sm text-zinc-500 mt-1">Send notifications via email using an SMTP server.</p>
            </div>
            <Checkbox id="smtp-enabled" name="smtp-enabled" label="Enabled" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input id="smtp-host" name="smtp-host" label="SMTP Host" placeholder="smtp.example.com" />
            <Input id="smtp-port" name="smtp-port" label="SMTP Port" type="number" placeholder="587" />
            <Input id="smtp-username" name="smtp-username" label="Username" placeholder="user@example.com" />
            <Input id="smtp-password" name="smtp-password" label="Password" type="password" />
            <Input id="smtp-from" name="smtp-from" label="From Address" placeholder="noreply@example.com" />
            <Input id="smtp-to" name="smtp-to" label="To Address" placeholder="alerts@example.com" />
        </div>

        <div class="flex items-center gap-6 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <Checkbox id="smtp-tls" name="smtp-tls" label="Use TLS" />
            <Checkbox id="smtp-starttls" name="smtp-starttls" label="Use STARTTLS" />
        </div>

        <div class="flex justify-end">
            <Button type="button">Save</Button>
        </div>
    </div>
</div>
