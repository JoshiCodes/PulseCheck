<script>

    let { data } = $props();
    const monitor = $derived(data.monitor);

</script>

<div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Monitor Details</h1>

    <div class="bg-zinc-200 dark:bg-zinc-900 shadow-lg rounded-lg p-6 space-y-4">
        <div>
            <span class="text-zinc-500 block text-sm">Name</span>
            <p class="text-lg font-medium">{monitor.name}</p>
        </div>

        <div>
            <span class="text-zinc-500 block text-sm">URL</span>
            <a href={monitor.url} target="_blank" class="text-primary-600 hover:underline">
                {monitor.url}
            </a>
        </div>

        <div class="flex gap-8">
            <div>
                <span class="text-zinc-500 block text-sm">Type</span>
                <span class="uppercase font-mono">{monitor.type}</span>
            </div>
            <div>
                <span class="text-zinc-500 block text-sm">Interval</span>
                <span>{monitor.interval} seconds</span>
            </div>
            <div>
                <span class="text-zinc-500 block text-sm">Status</span>
                <span class={monitor.active ? 'text-emerald-500' : 'text-red-500'}>
                    {monitor.active ? 'Active' : 'Deactivated'}
                </span>
            </div>
        </div>

        <div>
            <span class="text-zinc-500 block text-sm">Accepted status codes</span>
            <div class="flex gap-2 mt-1">
                {#each monitor.status_accepted.split(',') as code}
                    <span class="bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded text-xs">
                        {code}
                    </span>
                {/each}
            </div>
        </div>
    </div>

    <div class="mt-6">
        <a href="/admin/monitors" class="text-sm text-zinc-500 hover:text-zinc-700">
            ← Back to overview
        </a>
    </div>
</div>