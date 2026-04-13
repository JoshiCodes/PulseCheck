<script lang="ts">
	interface Props {
		variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'danger';
		class?: string;
		children: import('svelte').Snippet;
	}

	let { variant = 'primary', class: className = '', children }: Props = $props();

	const variants = {
		primary: 'bg-primary-500/20 text-primary-400 border-primary/20',
		secondary: 'bg-secondary-500/50 text-secondary-foreground border-border',
		outline: 'bg-transparent border-border text-foreground',
		success: 'bg-emerald-500/20 text-emerald-400 border-emerald/20',
		danger: 'bg-red-500/20 text-red-400 border-red/20',
	};
</script>

<span
	class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors {variants[
		variant
	]} {className}"
>
	{@render children()}
</span>
