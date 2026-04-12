<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		class?: string;
		icon?: Snippet;
		children?: Snippet;
	}

	let { title, class: className = '', icon, children }: Props = $props();
</script>

<div
	class="group relative flex flex-col items-start rounded-2xl border border-border bg-background p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 {className}"
>
	<div
		class="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
	></div>
	{#if icon}
		<div
			class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/50 text-primary transition-all group-hover:scale-110 group-hover:bg-primary/10"
		>
			{@render icon()}
		</div>
	{/if}
	<h3 class="text-xl font-bold tracking-tight text-foreground">{title}</h3>
	{#if children}
		<div class="mt-2 text-sm leading-relaxed text-secondary-foreground/70">
			{@render children()}
		</div>
	{/if}
</div>