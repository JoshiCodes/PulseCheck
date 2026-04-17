<script lang="ts">
    import { onMount } from "svelte";
    import { invalidateAll } from "$app/navigation";

    const { data } = $props();

    // Automatischer Refresh alle 10 Sekunden
    onMount(() => {
        const interval = setInterval(() => invalidateAll(), 10000);
        return () => clearInterval(interval);
    });

    // Globaler System-Status (Derived)
    // Wenn mindestens ein Monitor DOWN ist -> "Degraded"
    // Wenn alle UP oder keine Daten da sind -> "Operational"
    const anyDown = $derived(
        data.monitors.some(m => m.recentLogs?.length > 0 && m.recentLogs.at(-1)?.status !== 200)
    );

    const allOperational = $derived(!anyDown && data.monitors.length > 0);
</script>

<div class="min-h-screen text-zinc-900 dark:text-zinc-100 selection:bg-emerald-500/30">
    <div class="max-w-4xl mx-auto p-6 md:p-12 space-y-10">

        <header class="flex flex-col gap-6">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-black tracking-tight">{data.page.name}</h1>
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
                    <h2 class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">All Systems Operational</h2>
                    <p class="text-sm text-emerald-600/60">Everything is working as expected.</p>
                {:else if anyDown}
                    <h2 class="text-2xl font-bold text-red-600 dark:text-red-400">Partial System Outage</h2>
                    <p class="text-sm text-red-600/60">We are currently experiencing issues.</p>
                {:else}
                    <h2 class="text-2xl font-bold text-zinc-500">System Status Unknown</h2>
                    <p class="text-sm text-zinc-400">No data available at the moment.</p>
                {/if}
            </div>
        </header>

        <main class="grid gap-4">
            {#each data.monitors as monitor}
                <div onclick={() => {}} tabindex="-1" onkeydown={(e) => e.key === 'Enter' && console.log('Aktion')}
                     role="button"
                     class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800
                 rounded-lg p-4 flex items-center justify-between shadow-sm
                 hover:-translate-y-1 hover:shadow-xl
                 transition-transform duration-200
                 cursor-pointer"
                >

                    <span class="sr-only">Click to view</span>

                    <div class="flex items-center gap-4">
                        <div class="w-3 h-3 rounded-full animate-pulse duration-1000 {monitor.recentLogs.at(-1)?.status === 200 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'}"></div>
                        <div>
                            <h3 class="font-semibold text-zinc-800 dark:text-zinc-100">{monitor.name}</h3>
                            <p class="text-sm text-zinc-500 truncate max-w-50">{monitor.url}</p>
                        </div>
                    </div>

                    <div class="flex items-center gap-6">
                        <div class="text-right">
                            <span class="text-xs uppercase text-zinc-400 font-medium block">Response time</span>
                            <span class="text-sm font-mono tracking-tighter">
							{monitor.recentLogs.at(-1)?.responseTime ?? 0} ms
						</span>
                        </div>

                        <div class="flex flex-row-reverse gap-1">
                            {#each Array(10) as _, i}
                                {@const log = monitor.recentLogs[i]}
                                {#if log}
                                    <div
                                            class="w-2 h-8 rounded-full {log.status === 200 ? 'bg-green-500' : 'bg-red-500'}"
                                            title="State: {log.status} - {log.responseTime}ms"
                                    ></div>
                                {:else}
                                    <div class="w-2 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800"></div>
                                {/if}
                            {/each}
                        </div>

                        <div class="text-center min-w-12.5">
						<span class="text-lg font-bold {monitor.recentLogs.at(-1)?.status === 200 ? 'text-green-500' : 'text-red-500'}">
							{monitor.recentLogs.at(-1)?.status === 200 ? 'UP' : 'DOWN'}
						</span>
                        </div>
                    </div>
                </div>
            {:else}
                <div class="py-20 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
                    <p class="text-zinc-500 text-sm">No services are being monitored for this page.</p>
                </div>
            {/each}
        </main>

    </div>
</div>