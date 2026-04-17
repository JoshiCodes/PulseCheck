<script lang="ts">
    type Option = {
        value: any,
        label: string
    };

    type Props = {
        id: string,
        name?: string | null,
        label?: string | null,
        disabled?: boolean,
        required?: boolean,
        copyButton?: boolean,
        copyButtonDisabled?: boolean,
        copyValue?: string | null,
        options?: Option[],
        value?: any,
        suffix?: string | null,
        class?: string | null,
    }

    let {
        id,
        label = null,
        name = null,
        disabled = false,
        required = false,
        copyButton = false,
        copyButtonDisabled = false,
        copyValue = null,
        options = [],
        value = $bindable(null),
        suffix = null,
        class: className = null,
    } = $props();

    let copied = $state(false);

    function copy() {
        window.navigator.clipboard.writeText(copyValue ?? value);
        copied = true;
        setTimeout(() => {copied = false}, 2000)
    }
</script>

<div class={className}>
    <div class="relative inline-block w-full">
        {#if label}
            <label for={id} class="font-semibold block">{label}</label>
        {/if}

        <div class="flex items-stretch border-box w-full rounded-lg my-2 relative">
            <select
                    id={id}
                    name={name}
                    bind:value={value}
                    disabled={disabled}
                    required={required}
                    class="w-full py-2 px-4 {suffix ? 'rounded-l-lg' : 'rounded-lg'}
                bg-zinc-200 dark:bg-zinc-800
                text-zinc-900 dark:text-zinc-100
                appearance-none cursor-pointer
                focus:outline-none focus:ring-2 focus:ring-emerald-500/50
                disabled:cursor-not-allowed disabled:opacity-50
                h-10.5 py-0 leading-none
                "
            >
                {#if !value && required}
                    <option value="" disabled selected>Please select...</option>
                {/if}

                {#each options as option}
                    <option value={option.value}>
                        {option.label}
                    </option>
                {/each}
            </select>

            <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 {copyButton ? 'mr-10' : ''}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
                    <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                </svg>
            </div>

            {#if suffix}
                <div class="flex items-center justify-center px-3
                            bg-zinc-300 dark:bg-zinc-700
                            border-l border-zinc-400 dark:border-zinc-600
                            text-zinc-600 dark:text-zinc-300
                            text-sm font-medium select-none
                            rounded-r-lg"
                >
                    {suffix}
                </div>
            {/if}
        </div>

        {#if copyButton}
            <button title="Copy" type="button"
                    class="absolute right-2 {label ? 'top-[48%]' : 'top-[20%]'} z-1
                     p-1 md:p-2 rounded-lg
                    {
                    copied ?
                     'bg-emerald-300 hover:bg-emerald-300 dark:bg-emerald-600 dark:hover:bg-emerald-600' :
                     'bg-zinc-300 enabled:hover:bg-zinc-400 ' +
                      'dark:bg-zinc-900 enabled:dark:hover:bg-zinc-950'
                     }
                    hover:cursor-pointer transition-colors duration-200
                    disabled:cursor-not-allowed
            " onclick={copy}
                    disabled={copyButtonDisabled || !value}
            >
                {#if copied}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                    </svg>
                {/if}
            </button>
        {/if}
    </div>
</div>