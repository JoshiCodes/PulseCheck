<script lang="ts">
	interface Props {
		variant?: 'primary' | 'secondary' | 'outline';
		class?: string;
		children: import('svelte').Snippet;
	}

	let { variant = 'primary', class: className = '', children }: Props = $props();

	const variants = {
		primary: 'bg-primary/10 text-primary border-primary/20',
		secondary: 'bg-secondary text-secondary-foreground border-border',
		outline: 'bg-transparent border-border text-foreground'
	};
</script>

<span
	class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors {variants[
		variant
	]} {className}"
>
	{@render children()}
</span>
