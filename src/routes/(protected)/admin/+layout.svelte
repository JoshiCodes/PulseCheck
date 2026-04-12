<script>
    import Sidebar from "$lib/components/Sidebar.svelte";
    let { children } = $props();
</script>

<div class="flex h-full w-full">
    <Sidebar />

    <div class="flex-1 px-8 py-4">
        {@render children()}
    </div>
</div>