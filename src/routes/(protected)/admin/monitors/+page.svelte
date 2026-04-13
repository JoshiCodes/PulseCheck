<script lang="ts">
    import Button from "$lib/components/form/Button.svelte";
    import {goto} from "$app/navigation";
    import Badge from "$lib/components/Badge.svelte";

    let { data } = $props();
    const monitors = $derived(data.monitors);

    let loading = $state(false);

</script>

<div class="space-y-8">
    <header>
        <h1 class="text-3xl font-bold">Service Monitors</h1>
        <p class="text-zinc-500">Monitor the status of your services.</p>
    </header>

    <div class="">
        <div class="flex items-center justify-between">
            <Button variant="ghost" size="sm" onclick={() => {}}>Save Order</Button>
            <Button onclick={() => {goto("/admin/monitors/new")}}>Add Monitor</Button>
        </div>
        <div class="mt-2 md:mt-4">
            {#if monitors.length === 0}
                <div class="p-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-center text-zinc-500">
                    No Monitors configured yet.
                </div>
            {:else}
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {#each monitors as monitor}
                        <a href={"/admin/monitors/" + monitor.id}
                           class="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4
                            bg-zinc-200/70 dark:bg-zinc-900/50 hover:bg-zinc-200 dark:hover:bg-zinc-900
                            hover:-translate-y-1 hover:shadow-xl
                            transition-all duration-200
                            flex justify-between items-center
">
                            <div>
                                <h2 class="text-xl font-semibold">{monitor.name}</h2>
                                <p class="text-zinc-500">{monitor.url}</p>
                            </div>
                            <Badge variant={monitor.active ? "success" : "danger"} >
                                {#if monitor.active}
                                    Active
                                {:else}
                                    Inactive
                                {/if}
                            </Badge>
                        </a>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</div>