<script lang="ts">
    import { onMount } from "svelte";
    import { invalidateAll } from "$app/navigation";

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
            <div onclick={() => {}} tabindex="-1" onkeydown={(e) => e.key === 'Enter' && console.log('Aktion')}
                 role="button"
                 class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800
                 rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between shadow-sm
                 hover:-translate-y-1 hover:shadow-xl
                 transition-transform duration-200
                 cursor-pointer gap-4 sm:gap-0"
            >

                <span class="sr-only">Click to view</span>

                <div class="flex items-center gap-4 w-full sm:w-auto">
                    <div class="shrink-0 w-3 h-3 rounded-full animate-pulse duration-1000 {monitor.recentLogs.at(-1)?.status === 200 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'}"></div>

                    <div class="flex-1 min-w-0">
                        <h3 class="font-semibold text-zinc-800 dark:text-zinc-100 truncate">{monitor.name}</h3>
                        <p class="text-sm text-zinc-500 truncate">{monitor.url}</p>
                    </div>
                </div>

                <div class="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto">
                    <div class="text-left sm:text-right">
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
                                        class="w-1.5 sm:w-2 h-6 sm:h-8 rounded-full {log.status === 200 ? 'bg-green-500' : 'bg-red-500'}"
                                        title="State: {log.status} - {log.responseTime}ms"
                                ></div>
                            {:else}
                                <div class="w-1.5 sm:w-2 h-6 sm:h-8 rounded-full bg-zinc-100 dark:bg-zinc-800"></div>
                            {/if}
                        {/each}
                    </div>

                    <div class="text-right sm:text-center min-w-[3rem]">
                        <span class="text-lg font-bold {monitor.recentLogs.at(-1)?.status === 200 ? 'text-green-500' : 'text-red-500'}">
                            {monitor.recentLogs.at(-1)?.status === 200 ? 'UP' : 'DOWN'}
                        </span>
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div>