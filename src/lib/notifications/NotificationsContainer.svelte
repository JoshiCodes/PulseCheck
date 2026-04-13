<!-- ToastContainer.svelte -->
<script lang="ts">
    import { slide } from 'svelte/transition';
    import {notifyStore, type NotifyType} from "$lib/notifications/notificationStore";
    import Button from "$lib/components/form/Button.svelte";

    function getNotifyClasses(type: NotifyType) {
        const baseClasses = 'relative rounded-lg px-4 py-3 flex justify-between items-center border';
        const typeClasses = {
            success: 'border-emerald-600 bg-emerald-100/20 text-emerald-950 dark:border-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-100',
            error: 'border-red-600 bg-red-100 text-red-950 dark:border-red-700 dark:bg-red-950/20 dark:text-red-100',
            warning: 'border-yellow-600 bg-yellow-100 text-yellow-950 dark:border-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-100',
            info: 'border-purple-600 bg-purple-100 text-purple-950 dark:border-purple-700 dark:bg-purple-950/20 dark:text-purple-100',
        };
        return `${baseClasses} ${typeClasses[type] || typeClasses.info}`;
    }
</script>

<div class="fixed z-50 bottom-5 right-5 w-1/5 pointer-events-none flex flex-col gap-2">
    {#each $notifyStore as notify (notify.id)}
        <div
                class={getNotifyClasses(notify.options.type)}
                in:slide={{ duration: 200, axis: 'y' }}
                out:slide={{ duration: 200, axis: 'y' }}
                style="pointer-events: auto;"
        >
            <span class="flex-1">{notify.message}</span>
            <div class="flex gap-2 ml-4">
                {#if notify.options.action}
                    <Button
                            onclick={() => {
                                if(notify.options.action) notify.options.action.callback();
                                notifyStore.remove(notify.id);
                            }}
                            variant="ghost"
                            size="sm"
                            class=""
                    >
                        {notify.options.action.label}
                    </Button>
                {/if}
                {#if notify.options.canClose}
                    <button
                            onclick={() => notifyStore.remove(notify.id)}
                            class="px-2 py-1 rounded hover:bg-white/20 transition"
                    >
                        ✕
                    </button>
                {/if}
            </div>
        </div>
    {/each}
</div>