<script lang="ts">
    import Button from "$lib/components/form/Button.svelte";
    import {goto} from "$app/navigation";
    import Badge from "$lib/components/Badge.svelte";
    import EmptyPlaceholderBox from "$lib/components/EmptyPlaceholderBox.svelte";

    let { data } = $props();
    const pages = $derived(data.pages);

    let loading = $state(false);

</script>

<div class="space-y-8">
    <header>
        <h1 class="text-3xl font-bold">Status Pages</h1>
        <p class="text-zinc-500">Show the state of multiple services on one page.</p>
    </header>

    <div class="">
        <div class="w-full flex items-center justify-end">
            <Button class="justify-self-end" onclick={() => {goto("/admin/pages/new")}}>Add Page</Button>
        </div>
        <div class="mt-2 md:mt-4">
            {#if pages.length === 0}
                <EmptyPlaceholderBox>
                    No pages configured yet.
                </EmptyPlaceholderBox>
            {:else}
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {#each pages as page}
                        <a href={"/admin/pages/" + page.id}
                           class="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4
                            bg-zinc-200/70 dark:bg-zinc-900/50 hover:bg-zinc-200 dark:hover:bg-zinc-900
                            hover:-translate-y-1 hover:shadow-xl
                            transition-all duration-200
                            flex justify-between items-center
">
                            <div class="flex items-center gap-2 md:gap-6">
                                <h2 class="text-lg font-semibold">{page.name}</h2>
                                <span class="text-sm text-zinc-500 dark:text-zinc-400">
                                    /status/{page.slug}
                                </span>
                            </div>
                            <Badge variant={page.active ? "success" : "danger"} >
                                {#if page.active}
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