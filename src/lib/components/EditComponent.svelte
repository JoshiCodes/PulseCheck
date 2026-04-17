<script lang="ts">
    import Input from "$lib/components/form/Input.svelte";
    import type {HTMLInputTypeAttribute} from "svelte/elements";
    import type {Snippet} from "svelte";

    type Props = {
        name: string;
        id: string;
        value?: any;
        label?: string;
        type?: HTMLInputTypeAttribute;
        edit: boolean,
        content?: Snippet|null
        hasChanged?: boolean
    }

    let {
        name, id, value = $bindable(""),
        label, type = "text", edit = $bindable(false),
        content = null, hasChanged = $bindable(false)
    }: Props = $props();

    const initialValue = value;

</script>


<span class="text-zinc-500 block text-sm">{label}</span>
{#if edit}
    <Input
            id={id}
            name={name}
            bind:value
            {type}
            onChange={() => {
                console.log("value changed", value, initialValue);
                hasChanged = value !== initialValue;
            }}
    />
{:else}
    {#if content}
        {@render content()}
    {:else}
        <span class="my-4">{value}</span>
    {/if}
{/if}


