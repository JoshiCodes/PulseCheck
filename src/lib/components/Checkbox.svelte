<script lang="ts">
	interface Props {
		id?: string;
		name?: string;
		label?: string;
		checked?: boolean;
		required?: boolean;
		onchange?: (e: Event) => void;
		class?: string;
	}

	let {
		id,
		name,
		label,
		checked = $bindable(false),
		required = false,
		onchange,
		class: className = ''
	}: Props = $props();
</script>

<div class="flex items-center space-x-2 {className}">
	<div class="relative flex items-center">
		<input
			type="checkbox"
			{id}
			{name}
			{required}
			{onchange}
			bind:checked
			class="peer h-5 w-5 cursor-pointer appearance-none rounded border border-border bg-secondary/10 transition-all checked:border-primary checked:bg-primary hover:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10"
		/>
		<svg
			class="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-primary-foreground opacity-0 transition-opacity peer-checked:opacity-100"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="4"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<polyline points="20 6 9 17 4 12"></polyline>
		</svg>
	</div>
	{#if label}
		<label for={id} class="cursor-pointer text-sm font-medium text-foreground select-none">
			{label}
		</label>
	{/if}
</div>
