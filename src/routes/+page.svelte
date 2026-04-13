<script lang="ts">

    const { data } = $props();

</script>

<div class="p-8 max-w-5xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Monitors</h1>

    <div class="grid gap-4">
        {#each data.monitors as monitor}
            <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 flex items-center justify-between shadow-sm">

                <div class="flex items-center gap-4">
                    <div class="w-3 h-3 rounded-full animate-pulse {monitor.recentLogs.at(-1)?.status === 200 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'}"></div>
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
        {/each}
    </div>
</div>