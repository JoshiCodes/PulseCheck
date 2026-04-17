<script lang="ts">
    type Option = {
        value: string | number,
        label: string
    };

    type Props = {
        id: string,
        name?: string | null,
        label?: string | null,
        disabled?: boolean,
        required?: boolean,
        options?: Option[],
        value?: (string | number)[],
        class?: string | null,
    }

    let {
        id,
        label = null,
        name = null,
        disabled = false,
        required = false,
        options = [],
        value = $bindable([]),
        class: className = null,
    } = $props();

    function toggle(optionValue: string | number) {
        if (disabled) return;

        if (value.includes(optionValue)) {
            value = value.filter(v => v !== optionValue);
        } else {
            value = [...value, optionValue];
        }
    }
</script>

<div class={className}>
    {#if label}
        <label for={id} class="font-semibold mb-3 block text-zinc-900 dark:text-zinc-200">{label}</label>
    {/if}

    <div
            {id}
            class="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-zinc-50 dark:bg-zinc-900/30 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800"
    >
        {#each options as option}
            {@const isSelected = value.includes(option.value)}

            <button
                    type="button"
                    onclick={() => toggle(option.value)}
                    disabled={disabled}
                    class="flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-all text-left
                {isSelected
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600 shadow-sm dark:shadow-none'}
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <div class="size-4 rounded border flex items-center justify-center transition-colors
                    {isSelected
                        ? 'bg-primary border-primary'
                        : 'bg-zinc-100 dark:bg-transparent border-zinc-300 dark:border-zinc-500'}">
                    {#if isSelected}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" class="size-3 text-primary-foreground">
                            <path d="M20 6L9 17l-5-5" />
                        </svg>
                    {/if}
                </div>

                <span class="text-sm font-medium">{option.label}</span>
            </button>

            {#if isSelected && name}
                <input type="hidden" {name} value={option.value} />
            {/if}
        {/each}

        {#if options.length === 0}
            <p class="text-zinc-500 text-sm italic p-2">No options available.</p>
        {/if}
    </div>

    {#if required && value.length === 0}
        <input type="checkbox" class="sr-only" required />
    {/if}
</div>