<script>

    import Input from "$lib/components/form/Input.svelte";
    import Button from "$lib/components/form/Button.svelte";
    import EditComponent from "$lib/components/EditComponent.svelte";
    import BottomPopup from "$lib/components/BottomPopup.svelte";

    let {data} = $props();
    let monitor = $state({ ...data.monitor });

    let editMode = $state(false);
    let changed = $state(false);

    $effect(() => {
        if (!editMode) {
            monitor = { ...data.monitor };
            changed = false;
        }
    });

    function reset() {
        monitor = { ...data.monitor };
        changed = false;
    }

</script>

{editMode}
{changed}

<BottomPopup visible={editMode && changed}>
    <div class="flex items-center gap-4 px-2 w-full">
        <div class="flex items-center gap-3">
            <div class="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></div>
            <span class="text-zinc-900 dark:text-white font-medium">You have unsaved changes!</span>
        </div>
        <div class="flex items-center gap-2 ml-auto">
            <Button variant="ghost" onclick={reset} size="sm" class="border-none hover:bg-zinc-300/50 dark:hover:bg-zinc-800/50">
                Discard
            </Button>
            <Button variant="primary" size="sm" class="shadow-lg shadow-violet-500/20 px-6">
                Save Changes
            </Button>
        </div>
    </div>
</BottomPopup>

<div class="p-6">
    <div class="w-full flex justify-between items-center">
        <h1 class="text-2xl font-bold mb-4">Monitor Details</h1>
        <Button onclick={() => {
            if(editMode) {
                reset();
                editMode = false;
            } else {
                editMode = true;
            }
            changed = false;
        }}>
            {#if editMode}
                Cancel
            {:else}
                Edit
            {/if}
        </Button>
    </div>

    <div class="grid md:grid-cols-2 ">

        <div class="bg-zinc-200 dark:bg-zinc-900 shadow-lg rounded-lg p-6 space-y-4">
            <div class="w-full">
                <div class="">
                    <EditComponent
                            id="name" name="name" label="Name"
                            bind:value={monitor.name}
                            bind:edit={editMode}
                            bind:hasChanged={changed}
                    />
                </div>

                <div>
                    <EditComponent
                            id="url" name="url" label="URL"
                            bind:value={monitor.url}
                            bind:edit={editMode}
                    >
                        {#snippet content()}
                            <a href={monitor.url}>{monitor.url}</a>
                        {/snippet}
                    </EditComponent>
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
        </div>
    </div>

    <div class="mt-6">
        <a href="/admin/monitors" class="text-sm text-zinc-500 hover:text-zinc-700">
            ← Back to overview
        </a>
    </div>
</div>