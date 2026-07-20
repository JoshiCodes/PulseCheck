<script lang="ts">
    import Button from '$lib/components/form/Button.svelte';
    import { fly } from 'svelte/transition';

    interface Props {
        show: boolean;
        loading?: boolean;
        onclick?: (e: MouseEvent) => void;
        type?: 'button' | 'submit';
        form?: string | null;
    }

    let {
        show,
        loading = false,
        onclick,
        type = 'button',
        form = null
    }: Props = $props();
</script>

{#if show}
    <div
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        transition:fly={{ y: 40, duration: 250 }}
    >
        <div class="flex items-center gap-4 px-5 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg">
            <span class="text-sm text-zinc-600 dark:text-zinc-300">You have unsaved changes.</span>
            <Button {type} {onclick} size="sm" disabled={loading} form={form}>
                {loading ? 'Saving...' : 'Save'}
            </Button>
        </div>
    </div>
{/if}
