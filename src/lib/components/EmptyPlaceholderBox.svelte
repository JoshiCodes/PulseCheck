<script lang="ts">

    import type {Snippet} from "svelte";

    type Props = {
        children?: Snippet;
    }

    let { children }: Props = $props();
</script>

<div class="p-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-center text-zinc-500">
    {#if children}
        {@render children()}
    {:else}
        <p class="text-lg">No items found.</p>
    {/if}
</div>