<script lang="ts">
    import { page } from '$app/state';
    import Button from "$lib/components/form/Button.svelte";

    const error: any = page.error;
    const status = page.status;

    // Ein bisschen Persönlichkeit für verschiedene Statuscodes
    const messages: Record<number, { title: string; desc: string }> = {
        404: {
            title: "Page not found",
            desc: "This link seems to lead nowhere. Maybe it got lost in the void?"
        },
        500: {
            title: "Server Error",
            desc: "Something went wrong on our end. Don't worry, our engineers are already on it!"
        },
        0: {
            title: "Unexpected Error",
            desc: error?.message || "An unexpected error occurred. Please try again later."
        }
    };

    const content = messages[status] || messages[0];
</script>

<div class="min-h-[80vh] flex flex-col items-center justify-center p-8 max-w-5xl mx-auto text-center">
    <span class="px-3 py-1 rounded-full bg-red-500/50 dark:bg-red-400/50 border border-red-700 text-red-700 dark:text-red-300 text-xs font-mono mb-4">
        Status {status}
    </span>

    <h1 class="text-4xl md:text-6xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 mb-4">
        {content.title}
    </h1>

    <p class="text-zinc-700 dark:text-zinc-400 text-lg max-w-md mb-10">
        {content.desc}
    </p>

    <div class="flex flex-row gap-4 mt-2 md:mt-4">
        <Button variant="primary" onclick={() => window.location.href = '/'}>
            Back home
        </Button>

        <Button variant="secondary" onclick={() => window.location.reload()}>
            Reload Page
        </Button>
    </div>

    {#if error?.stack}
        <div class="mt-16 text-left w-full max-w-2xl">
            <details class="group">
                <summary class="cursor-pointer text-zinc-500 text-sm hover:text-zinc-300 transition-colors list-none flex items-center gap-2">
                    <span class="group-open:rotate-90 transition-transform">▶</span>
                    Fehlerdetails anzeigen
                </summary>
                <pre class="mt-4 p-4 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-500 overflow-x-auto font-mono">
                    {error.stack}
                </pre>
            </details>
        </div>
    {/if}
</div>