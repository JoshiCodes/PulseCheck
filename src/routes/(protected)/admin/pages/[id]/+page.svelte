<script lang="ts">
    import { fly } from 'svelte/transition';
    import { untrack } from "svelte";
    import { enhance } from "$app/forms";
    import { goto } from "$app/navigation";

    import Button from "$lib/components/form/Button.svelte";
    import Checkbox from "$lib/components/form/Checkbox.svelte";
    import EditComponent from "$lib/components/EditComponent.svelte";
    import TagInput from "$lib/components/form/TagInput.svelte";
    import BottomPopup from "$lib/components/BottomPopup.svelte";
    import { notifyStore } from "$lib/notifications/notificationStore";
    import MultiSelect from "$lib/components/form/MultiSelect.svelte";

    let { data } = $props();

    let page = $state(untrack(() => ({ ...data.page })));
    let editMode = $state(false);
    let loading = $state(false);

    let selectedMonitors = $state(untrack(() => data.page.monitors?.split(',') || []));
    let selectedMonitorsString = $derived(selectedMonitors.join(','));

    let currentData = $derived({
        ...page,
        monitors: selectedMonitors.join(',')
    });
    let originalData = $derived({
        ...data.page,
        monitors: data.page.monitors || ""
    });

    let anyChanged = $derived(JSON.stringify(currentData) !== JSON.stringify(originalData));

    function reset() {
        page = { ...data.page };
        selectedMonitors = data.page.monitors.split(',')
        editMode = false;
    }

    const monitorOptions = $derived(data.allMonitors);
</script>

<BottomPopup visible={editMode && anyChanged}>
    <form method="post" action="?/update" use:enhance={() => {
        loading = true;
        return async ({ result, update }) => {
            if(result.type === "success") {
                notifyStore.add("Status page updated.", {type: "success"});
                editMode = false;
            } else if(result.type === "failure") {
                notifyStore.add("Update failed: " + result.data?.error, {type: "error"});
            }
            await update();
            page = { ...data.page };
            selectedMonitors = data.page.monitors.split(',') || []
            loading = false;
        };
    }} class="flex items-center justify-between w-full max-w-5xl mx-auto px-4">
        <input type="hidden" name="monitorIds" bind:value={selectedMonitorsString} />
        <input type="hidden" name="name" bind:value={page.name} />
        <input type="hidden" name="slug" bind:value={page.slug} />
        <input type="hidden" name="active" bind:value={page.active} />
        <input type="hidden" name="requires_auth" bind:value={page.requiresAuth} />

        <div class="flex items-center gap-3">
            <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span class="text-zinc-900 dark:text-zinc-100 font-medium text-sm">Unsaved changes on Status Page</span>
        </div>
        <div class="flex items-center gap-2">
            <Button variant="ghost" onclick={reset} type="button" size="sm" class="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">
                Discard
            </Button>
            <Button type="submit" disabled={loading} size="sm" class="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 px-6">
                {loading ? 'Saving...' : 'Save Changes'}
            </Button>
        </div>
    </form>
</BottomPopup>

<div class="max-w-5xl mx-auto py-8 px-4 space-y-8">
    <header class="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-200 dark:border-zinc-800 pb-6 gap-4">
        <div>
            <div class="flex items-center gap-3 mb-1">
                <h1 class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                    {editMode ? 'Edit Status Page' : page.name}
                </h1>
                {#if !editMode}
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider {page.active ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-zinc-500/10 text-zinc-500'}">
                        {page.active ? 'Public' : 'Hidden'}
                    </span>
                {/if}
            </div>
            <p class="text-zinc-500 text-xs font-mono tracking-widest uppercase">
                /status/{page.slug} &bull; ID: {page.id}
            </p>
        </div>

        <div class="flex items-center gap-3">
            <a href="/admin/pages" class="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 mr-2 transition-colors">
                ← Back
            </a>
            <Button
                    variant={editMode ? 'ghost' : 'primary'}
                    class={editMode ? 'border border-zinc-200 dark:border-zinc-700' : ''}
                    onclick={() => editMode = !editMode}
            >
                {editMode ? 'Cancel' : 'Edit Page'}
            </Button>
        </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
            <div class="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                <h3 class="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-6">General Settings</h3>
                <div class="space-y-6">
                    <EditComponent
                            id="name" name="name" label="Page Title"
                            bind:value={page.name} bind:edit={editMode}
                    />

                    <EditComponent
                            id="slug" name="slug" label="URL Slug"
                            bind:value={page.slug} bind:edit={editMode}
                    >
                        {#snippet content()}
                            <span class="text-zinc-400 text-sm">/status/</span><span class="text-emerald-500 font-medium font-mono">{page.slug}</span>
                        {/snippet}
                    </EditComponent>
                </div>
            </div>

            <div class="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                <h3 class="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Assigned Monitors</h3>
                {#if editMode}
                    <div transition:fly={{ y: 10, duration: 200 }}>
                        <MultiSelect
                                id="monitors"
                                name="monitors"
                                options={
                                [
                                    ...monitorOptions.map(m => ({
                                        value: String(m.id),
                                        label: m.name
                                    }))
                                ]
                                }
                                bind:value={selectedMonitors}
                        />
                        <p class="text-[10px] text-zinc-500 mt-2 italic">Select the monitors that should be visible on this status page.</p>
                    </div>
                {:else}
                    <div class="flex flex-wrap gap-2">
                        {#if page.monitors?.length > 0}
                            {#each page.monitors.split(",") as m}
                                <span class="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-300">
                                    {#if data.allMonitors.find(mon => String(mon.id) === m)}
                                        {data.allMonitors.find(mon => String(mon.id) === m)?.name}
                                    {:else}
                                        Unknown Monitor (ID: {m})
                                    {/if}
                                </span>
                            {/each}
                        {:else}
                            <span class="text-zinc-500 italic text-sm text-center w-full py-4">No monitors assigned to this page.</span>
                        {/if}
                    </div>
                {/if}
            </div>
        </div>

        <div class="space-y-6">
            <div class="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                <h3 class="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Visibility & Access</h3>
                <div class="space-y-4">
                    <div class="pb-4 border-b border-zinc-100 dark:border-zinc-800">
                        <span class="text-zinc-500 block text-xs font-bold uppercase mb-2">Publishing</span>
                        {#if editMode}
                            <Checkbox id="active" label="Page is public" bind:checked={page.active} />
                        {:else}
                            <div class="flex items-center gap-2">
                                <div class="size-2 rounded-full {page.active ? 'bg-emerald-500' : 'bg-zinc-500'}"></div>
                                <span class="text-sm font-medium">{page.active ? 'Visible to everyone' : 'Private / Draft'}</span>
                            </div>
                        {/if}
                    </div>

                    <div>
                        <span class="text-zinc-500 block text-xs font-bold uppercase mb-2">Access Control</span>
                        {#if editMode}
                            <Checkbox id="requires_auth" label="Requires Login" bind:checked={page.requiresAuth} />
                        {:else}
                            <div class="flex items-center gap-2 text-sm">
                                {#if page.requiresAuth}
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4 text-amber-500">
                                        <path fill-rule="evenodd" d="M8 1a3.5 3.5 0 0 0-3.5 3.5V7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7V4.5A3.5 3.5 0 0 0 8 1Zm2 6V4.5a2 2 0 1 0-4 0V7h4Z" clip-rule="evenodd" />
                                    </svg>
                                    <span>Authenticated Users Only</span>
                                {:else}
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4 text-emerald-500">
                                        <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm-1-8.4a.75.75 0 1 1 1.5 0v3.3a.75.75 0 1 1-1.5 0V6.6ZM8 4.5a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5Z" />
                                    </svg>
                                    <span>Public Access</span>
                                {/if}
                            </div>
                        {/if}
                    </div>
                </div>
            </div>

            {#if editMode}
                <form method="post" action="?/delete" class="p-4 rounded-xl bg-red-50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/20"
                      transition:fly={{ y: 20, duration: 200 }}
                      use:enhance={() => {
                        return async ({ result }) => {
                            if(result.type === "success") {
                                notifyStore.add("Page deleted.", {type: "success"});
                                await goto("/admin/pages");
                            }
                        };
                    }}
                >
                    <input type="hidden" name="id" value={page.id} />
                    <h4 class="text-xs font-bold text-red-600 dark:text-red-500 uppercase mb-2">Danger Zone</h4>
                    <p class="text-[11px] text-red-700/70 dark:text-red-500/60 leading-relaxed mb-3">
                        This will permanently delete the status page.
                    </p>
                    <Button variant="ghost" type="submit" class="w-full text-red-600 hover:bg-red-600 hover:text-white border border-red-200 dark:border-red-900/30 py-2 text-[10px] uppercase font-bold">
                        Delete Status Page
                    </Button>
                </form>
            {/if}
        </div>
    </div>
</div>