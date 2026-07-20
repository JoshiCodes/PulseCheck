<script lang="ts">
    import { onMount } from "svelte";
    import { invalidateAll } from "$app/navigation";
    import MonitorCard from "$lib/components/MonitorCard.svelte";

    const { data } = $props();

    onMount(() => {
        const interval = setInterval(() => invalidateAll(), 10000);
        return () => clearInterval(interval);
    });

    const anyDown = $derived(
        data.monitors.some(m => m.recentLogs?.length > 0 && m.recentLogs.at(-1)?.status !== 200)
    );

    const allOperational = $derived(!anyDown && data.monitors.length > 0);
</script>

<div class="min-h-screen text-zinc-900 dark:text-zinc-100 selection:bg-emerald-500/30">
    <div class="max-w-4xl mx-auto p-4 sm:p-6 md:p-12 space-y-8 sm:space-y-10">

        <header class="flex flex-col gap-4 sm:gap-6">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl sm:text-3xl font-black tracking-tight">{data.page.name}</h1>
                    <p class="text-zinc-500 text-sm mt-1 flex items-center gap-2">
                        <span class="relative flex h-2 w-2">
                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Live system status
                    </p>
                </div>
            </div>

            <div class="w-full p-6 rounded-lg shadow-sm flex flex-col items-center justify-center text-center gap-2 transition-all duration-500
                {allOperational ? 'bg-emerald-500/5' : anyDown ? 'bg-red-500/5 border-red-500/20' : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'}">

                {#if allOperational}
                    <h2 class="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">All Systems Operational</h2>
                    <p class="text-sm text-emerald-600/60">Everything is working as expected.</p>
                {:else if anyDown}
                    <h2 class="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400">Partial System Outage</h2>
                    <p class="text-sm text-red-600/60">We are currently experiencing issues.</p>
                {:else}
                    <h2 class="text-xl sm:text-2xl font-bold text-zinc-500">System Status Unknown</h2>
                    <p class="text-sm text-zinc-400">No data available at the moment.</p>
                {/if}
            </div>
        </header>

        <main class="grid gap-4">
            {#each data.monitors as monitor}
                <MonitorCard {monitor} />
            {:else}
                <div class="py-20 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
                    <p class="text-zinc-500 text-sm">No services are being monitored for this page.</p>
                </div>
            {/each}
        </main>

    </div>
</div>