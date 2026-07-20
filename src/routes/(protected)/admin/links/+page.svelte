<script lang="ts">
    import { notifyStore } from "$lib/notifications/notificationStore";
    import Select from "$lib/components/form/Select.svelte";
    import Input from "$lib/components/form/Input.svelte";
    import Button from "$lib/components/form/Button.svelte";
    import { enhance } from '$app/forms';
    import { dndzone, type DndEvent } from 'svelte-dnd-action';
    import { flip } from 'svelte/animate';
    import Badge from "$lib/components/Badge.svelte";
    import BottomPopup from "$lib/components/BottomPopup.svelte";

    let { data } = $props();

    let loading = $state(false);
    let orderDirty = $state(false);
    let savingOrder = $state(false);
    const flipDurationMs = 300;

    // local state
    let headerLinks = $derived(data.links.filter(l => l.location === 'header').sort((a,b) => a.order - b.order));
    let footerLinks = $derived(data.links.filter(l => l.location === 'footer').sort((a,b) => a.order - b.order));

    // sync from db
    $effect(() => {
        headerLinks = data.links.filter(l => l.location === 'header').sort((a,b) => a.order - b.order);
        footerLinks = data.links.filter(l => l.location === 'footer').sort((a,b) => a.order - b.order);
    });

    function handleHeaderConsider(e: CustomEvent<DndEvent<any>>) {
        headerLinks = e.detail.items;
    }

    function handleHeaderFinalize(e: CustomEvent<DndEvent<any>>) {
        headerLinks = e.detail.items;
        orderDirty = true;
    }

    function handleFooterConsider(e: CustomEvent<DndEvent<any>>) {
        footerLinks = e.detail.items;
    }

    function handleFooterFinalize(e: CustomEvent<DndEvent<any>>) {
        footerLinks = e.detail.items;
        orderDirty = true;
    }

    async function saveAllOrders() {
        savingOrder = true;
        try {
            for (const location of ['header', 'footer'] as const) {
                const items = location === 'header' ? headerLinks : footerLinks;
                const formData = new FormData();
                formData.append('items', JSON.stringify(items.map((item, index) => ({ id: item.id, order: index }))));

                const response = await fetch('?/updateOrder', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    notifyStore.add(`Failed to update ${location} order`, { type: 'error' });
                    savingOrder = false;
                    return;
                }
            }
            notifyStore.add('Link order updated', { type: 'success' });
            orderDirty = false;
        } finally {
            savingOrder = false;
        }
    }
</script>

<div class="space-y-8">
    <header>
        <h1 class="text-3xl font-bold">Custom Links</h1>
        <p class="text-zinc-500">Manage links for the Header and Footer.</p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-12">

            <section class="space-y-4">
                <div class="flex justify-between items-center">
                    <h2 class="text-xl font-semibold">Header Links</h2>
                </div>

                {#if headerLinks.length === 0}
                    <div class="p-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-center text-zinc-500">
                        No Header Links configured yet.
                    </div>
                {:else}
                    <div
                            use:dndzone={{ items: headerLinks, flipDurationMs }}
                            onconsider={handleHeaderConsider}
                            onfinalize={handleHeaderFinalize}
                            class="grid gap-2 min-h-12.5 outline-none"
                    >
                        {#each headerLinks as link (link.id)}
                            <div
                                    animate:flip={{ duration: flipDurationMs }}
                                    class="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl flex justify-between items-center shadow-sm cursor-grab active:cursor-grabbing"
                            >
                                <div class="flex items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-zinc-400"><path d="M5 9h14M5 15h14"/></svg>
                                    <span class="font-bold">{link.name}</span>
                                    <Badge variant="secondary">{link.url}</Badge>
                                </div>
                                <form method="POST" action="?/delete&id={link.id}" use:enhance>
                                    <button class="text-zinc-400 hover:text-red-500 p-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                        <span class="sr-only">Delete</span>
                                    </button>
                                </form>
                            </div>
                        {/each}
                    </div>
                {/if}


            </section>

            <section class="space-y-4">
                <div class="flex justify-between items-center">
                    <h2 class="text-xl font-semibold">Footer Links</h2>
                </div>

                {#if footerLinks.length === 0}
                    <div class="p-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-center text-zinc-500">
                        No Footer Links configured yet.
                    </div>
                {:else}
                    <div
                            use:dndzone={{ items: footerLinks, flipDurationMs }}
                            onconsider={handleFooterConsider}
                            onfinalize={handleFooterFinalize}
                            class="grid gap-2 min-h-12.5 outline-none"
                    >
                        {#each footerLinks as link (link.id)}
                            <div
                                    animate:flip={{ duration: flipDurationMs }}
                                    class="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl flex justify-between items-center shadow-sm cursor-grab active:cursor-grabbing"
                            >
                                <div class="flex items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-zinc-400"><path d="M5 9h14M5 15h14"/></svg>
                                    <span class="font-bold">{link.name}</span>
                                    <Badge variant="secondary">{link.url}</Badge>
                                </div>

                                <form method="POST" action="?/delete&id={link.id}" use:enhance>
                                    <button class="text-zinc-400 hover:text-red-500 p-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                        <span class="sr-only">Delete</span>
                                    </button>
                                </form>
                            </div>
                        {/each}
                    </div>
                    {/if}

            </section>
        </div>

        <div class="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm h-fit sticky top-8">
            <h2 class="text-xl font-semibold mb-6">Add Link</h2>
            <form method="POST" action="?/add" use:enhance={() => {
                loading = true;
                return async ({ result, update }) => {
                    if(result.type === "failure") {
                        let msg;
                        if(result.data && result.data.error) {
                            msg = result.data.error;
                        } else {
                            msg = "Unknown error."
                        }
                        notifyStore.add("Failed to create Link: " + msg, {type: "error"})
                    } else {
                        notifyStore.add("Link created successfully.", {type: "success"})
                    }
                    await update();
                    loading = false;
                }
            }}>
                <div class="grid gap-4">
                    <Input id="name" name="name" label="Name" required />
                    <Input id="url" name="url" label="URL" placeholder="https://..." required />
                    <Select id="location" name="location" label="Location" options={[{label: "Header", value: "header"}, { label: "Footer", value: "footer"}]} />
                </div>
                <Button disabled={loading} type="submit" class="mt-6 w-full">Add Link</Button>
            </form>
        </div>
    </div>

    <BottomPopup visible={orderDirty}>
        <div class="flex items-center justify-between w-full max-w-5xl mx-auto px-4">
            <div class="flex items-center gap-3">
                <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span class="text-zinc-900 dark:text-zinc-100 font-medium text-sm">
                    You have unsaved changes!
                </span>
            </div>
            <div class="flex items-center gap-2">
                <Button variant="ghost" onclick={() => { orderDirty = false; }} size="sm" class="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">
                    Discard
                </Button>
                <Button onclick={saveAllOrders} size="sm" disabled={savingOrder} class="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 px-6">
                    {savingOrder ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </div>
    </BottomPopup>
</div>