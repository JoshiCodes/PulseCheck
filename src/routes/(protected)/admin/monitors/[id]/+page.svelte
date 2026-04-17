<script lang="ts">
    import { fly } from 'svelte/transition';
    import Button from "$lib/components/form/Button.svelte";
    import Select from "$lib/components/form/Select.svelte";
    import TagInput from "$lib/components/form/TagInput.svelte";
    import Checkbox from "$lib/components/form/Checkbox.svelte";
    import EditComponent from "$lib/components/EditComponent.svelte";
    import BottomPopup from "$lib/components/BottomPopup.svelte";

    // Importiere untrack von svelte
    import { untrack } from "svelte";

    let { data } = $props();

    let monitor = $state(untrack(() => ({ ...data.monitor })));
    let editMode = $state(false);

    let statusArray = $state(untrack(() =>
        monitor.status_accepted ? monitor.status_accepted.split(',') : []
    ));

    $effect(() => {
        if (editMode) {
            monitor.status_accepted = statusArray.join(',');
        }
    });

    let anyChanged = $derived(JSON.stringify(monitor) !== JSON.stringify(data.monitor));

    function reset() {
        monitor = { ...data.monitor };
        statusArray = monitor.status_accepted ? monitor.status_accepted.split(',') : [];
        editMode = false;
    }

    function save() {
        console.log("Saving changes...", monitor);
        // TODO: Implement saving changes
        editMode = false;
    }
</script>

<BottomPopup visible={editMode && anyChanged}>
    <div class="flex items-center justify-between w-full max-w-5xl mx-auto px-4">
        <div class="flex items-center gap-3">
            <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span class="text-zinc-900 dark:text-zinc-100 font-medium text-sm">
                You have unsaved changes!
            </span>
        </div>
        <div class="flex items-center gap-2">
            <Button variant="ghost" onclick={reset} size="sm" class="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">
                Discard
            </Button>
            <Button onclick={save} size="sm" class="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 px-6">
                Save Changes
            </Button>
        </div>
    </div>
</BottomPopup>

<div class="max-w-5xl mx-auto py-8 px-4 space-y-8">
    <header class="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-200 dark:border-zinc-800 pb-6 gap-4">
        <div>
            <div class="flex items-center gap-3 mb-1">
                <h1 class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                    {editMode ? 'Edit Mode' : monitor.name}
                </h1>
                {#if !editMode}
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider {monitor.active ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-zinc-500/10 text-zinc-500'}">
                        {monitor.active ? 'Active' : 'Paused'}
                    </span>
                {/if}
            </div>
            <p class="text-zinc-500 text-xs font-mono tracking-widest uppercase">
                {monitor.type} &bull; {monitor.id}
            </p>
        </div>

        <div class="flex items-center gap-3">
            <a href="/admin/monitors" class="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 mr-2 transition-colors">
                ← Back
            </a>
            <Button
                    variant={editMode ? 'ghost' : 'primary'}
                    class={editMode ? 'border border-zinc-200 dark:border-zinc-700' : ''}
                    onclick={() => editMode = !editMode}
            >
                {editMode ? 'Cancel' : 'Edit Monitor'}
            </Button>
        </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
            <div class="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                <h3 class="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-6">Identity & Target</h3>

                <div class="space-y-6">
                    <EditComponent
                            id="name" name="name" label="Monitor Name"
                            bind:value={monitor.name} bind:edit={editMode}
                    />

                    <EditComponent
                            id="url" name="url" label="Target URL"
                            bind:value={monitor.url} bind:edit={editMode}
                    >
                        {#snippet content()}
                            <a href={monitor.url} target="_blank" class="text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1.5 font-medium mt-1">
                                {monitor.url}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-3.5">
                                    <path fill-rule="evenodd" d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0Z" clip-rule="evenodd" />
                                </svg>
                            </a>
                        {/snippet}
                    </EditComponent>

                    <div>
                        <span class="text-zinc-500 block text-sm mb-1">Monitor Type</span>
                        {#if editMode}
                            <Select
                                    id="type" name="type"
                                    options={[{label: "HTTP(s)", value: "http"}, {label: "PING (ICMP)", value: "ping"}]}
                                    bind:value={monitor.type}
                            />
                        {:else}
                            <span class="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-3 py-1 rounded-md text-sm font-mono uppercase inline-block mt-1">
                                {monitor.type}
                            </span>
                        {/if}
                    </div>
                </div>
            </div>

            <div class="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                <h3 class="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-6">Validation & Thresholds</h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <EditComponent
                                id="interval" name="interval" label="Check Interval" type="number"
                                bind:value={monitor.interval} bind:edit={editMode}
                        >
                            {#snippet content()}
                                <span class="text-zinc-900 dark:text-zinc-100 font-semibold block mt-1">{monitor.interval} seconds</span>
                            {/snippet}
                        </EditComponent>
                    </div>

                    <div>
                        <span class="text-zinc-500 block text-sm mb-1">Expected Status Codes</span>
                        {#if editMode}
                            <TagInput
                                    id="status_accepted" name="status_accepted"
                                    bind:value={statusArray}
                            />
                        {:else}
                            <div class="flex flex-wrap gap-1.5 mt-1">
                                {#each statusArray as code}
                                    <span class="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 rounded text-xs font-mono">
                                        {code}
                                    </span>
                                {/each}
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
        </div>

        <div class="space-y-6">
            <div class="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                <h3 class="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Status & Health</h3>

                <div class="space-y-4">
                    <div class="pb-4 border-b border-zinc-100 dark:border-zinc-800">
                        <span class="text-zinc-500 block text-xs font-bold uppercase mb-2">Monitor Status</span>
                        {#if editMode}
                            <div class="p-2 -mx-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700">
                                <Checkbox id="active" label="Monitor is active" bind:checked={monitor.active} />
                            </div>
                        {:else}
                            <div class="flex items-center gap-2">
                                <div class="size-2 rounded-full {monitor.active ? 'bg-emerald-500' : 'bg-zinc-500'}"></div>
                                <span class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                    {monitor.active ? 'Monitoring Active' : 'Paused'}
                                </span>
                            </div>
                        {/if}
                    </div>

                    <div class="flex items-center justify-between text-sm pt-2">
                        <span class="text-zinc-500">Uptime (24h)</span>
                        <span class="font-medium text-emerald-600 dark:text-emerald-400">???%</span>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                        <span class="text-zinc-500">Avg. Response</span>
                        <span class="font-medium text-zinc-900 dark:text-zinc-100">???ms</span>
                    </div>
                </div>
            </div>

            {#if editMode}
                <div class="p-4 rounded-xl bg-red-50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/20 transition-opacity duration-300 {editMode ? 'opacity-100' : 'opacity-40'}"
                transition:fly={{ y: 20, duration: 200 }}
                >
                    <h4 class="text-xs font-bold text-red-600 dark:text-red-500 uppercase mb-2">Danger Zone</h4>
                    <p class="text-[11px] text-red-700/70 dark:text-red-500/60 leading-relaxed mb-3">
                        Deleting this monitor will stop all checks and wipe historical data.
                    </p>
                    <Button variant="ghost" disabled={!editMode} class="w-full text-red-600 hover:bg-red-600 hover:text-white border border-red-200 dark:border-red-900/30 py-2 text-[10px] uppercase font-bold tracking-tighter disabled:opacity-50">
                        Delete Monitor
                    </Button>
                </div>
            {/if}
        </div>
    </div>
</div>