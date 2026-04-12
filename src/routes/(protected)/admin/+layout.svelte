<script>
    import Sidebar from "$lib/components/Sidebar.svelte";

    let { children } = $props();
</script>

<Sidebar />
<main class="grow">
    {@render children()}
</main>