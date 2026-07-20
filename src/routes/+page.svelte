<script lang="ts">
    import { onMount } from "svelte";
    import { invalidateAll } from "$app/navigation";
    import MonitorCard from "$lib/components/MonitorCard.svelte";

    const { data } = $props();

    onMount(() => {
        const interval = setInterval(() => {
            invalidateAll();
        }, 10000);

        return () => clearInterval(interval);
    })
</script>

<div class="p-4 sm:p-8 max-w-5xl mx-auto">
    <h1 class="text-2xl font-bold mb-4 sm:mb-6">Monitors</h1>

    <div class="grid gap-4">
        {#each data.monitors as monitor}
            <MonitorCard {monitor} />
        {/each}
    </div>
</div>