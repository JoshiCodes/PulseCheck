<script lang="ts">
    type Props = {
        id: string,
        name?: string | null,
        label?: string | null,
        placeholder?: string,
        disabled?: boolean,
        required?: boolean,
        value?: string[],
        class?: string | null,
    }

    let {
        id,
        label = null,
        name = null,
        placeholder = "Add with enter",
        disabled = false,
        required = false,
        value = $bindable([]),
        class: className = null,
    } = $props();

    let inputValue = $state("");

    function addTag(tag: string) {
        const cleanTag = tag.trim().replace(/,$/, "");
        if (cleanTag && !value.includes(cleanTag)) {
            value = [...value, cleanTag];
        }
        inputValue = "";
    }

    function removeTag(index: number) {
        value = value.filter((_, i) => i !== index);
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === "Enter" || event.key === "," || event.key === " ") {
            event.preventDefault();
            addTag(inputValue);
        } else if (event.key === "Backspace" && inputValue === "" && value.length > 0) {
            removeTag(value.length - 1);
        }
    }
</script>

<div class={className}>
    <div class="w-full">
        {#if label}
            <label for={id} class="font-semibold mb-2 block">{label}</label>
        {/if}

        <div class="flex flex-wrap gap-2 border-box w-full
                    bg-zinc-200 dark:bg-zinc-800
                    rounded-lg py-2 px-3 mt-2
                    focus-within:ring-2 focus-within:ring-zinc-400 transition-all
                    {disabled ? 'opacity-50 cursor-not-allowed' : ''}">

            {#each value as tag, i}
                <span class="flex items-center gap-1 bg-zinc-300 dark:bg-zinc-700
                             px-2 py-1 rounded text-sm font-medium">
                    {tag}
                    {#if !disabled}
                        <button
                                type="button"
                                onclick={() => removeTag(i)}
                                class="hover:text-red-500 transition-colors"
                                aria-label="Remove {tag}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    {/if}
                </span>
            {/each}

            <input
                    type="text"
                    {id}
                    {disabled}
                    {placeholder}
                    bind:value={inputValue}
                    onkeydown={handleKeyDown}
                    onblur={() => addTag(inputValue)}
                    class="flex-1 bg-transparent border-none outline-none min-w-[120px] py-1
                       disabled:cursor-not-allowed placeholder:text-zinc-500"
            />
        </div>

        {#if name}
            <input type="hidden" {name} value={value.join(',')} {required} />
        {/if}
    </div>
</div>