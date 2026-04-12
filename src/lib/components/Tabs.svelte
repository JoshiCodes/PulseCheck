<script lang="ts">
	interface Tab {
		id: string;
		label: string;
	}

	interface Props {
		tabs: Tab[];
		activeTab: string;
		onchange?: (id: string) => void;
		class?: string;
	}

	let {
		tabs,
		activeTab = $bindable(),
		onchange,
		class: className = ''
	}: Props = $props();

	function handleSelect(id: string) {
		activeTab = id;
		onchange?.(id);
	}
</script>

<div class="inline-flex h-10 items-center justify-center rounded-lg bg-secondary/30 p-1 text-secondary-foreground {className}">
	{#each tabs as tab}
		<button
			onclick={() => handleSelect(tab.id)}
			class="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 {activeTab ===
			tab.id
				? 'bg-background text-foreground shadow-sm'
				: 'hover:bg-background/50 hover:text-foreground'}"
		>
			{tab.label}
		</button>
	{/each}
</div>
