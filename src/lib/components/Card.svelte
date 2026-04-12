<script lang="ts">
	interface Props {
		class?: string;
		children: import('svelte').Snippet;
		header?: import('svelte').Snippet;
		footer?: import('svelte').Snippet;
	}

	let { class: className = '', children, header, footer }: Props = $props();
</script>

<div class="rounded-2xl border border-border bg-background shadow-sm {className}">
	{#if header}
		<div class="border-b border-border p-3">
			{@render header()}
		</div>
	{/if}
	<div class="p-3">
		{@render children()}
	</div>
	{#if footer}
		<div class="border-t border-border bg-secondary/10 p-4">
			{@render footer()}
		</div>
	{/if}
</div>
