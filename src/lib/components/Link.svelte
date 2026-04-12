<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		href: string;
		class?: string;
		children: Snippet;
		variant?: 'default' | 'primary' | 'muted';
	}

	let { href, class: className = '', children, variant = 'default' }: Props = $props();

	const variants = {
		default: 'text-foreground hover:text-primary',
		primary: 'text-primary hover:opacity-80',
		muted: 'text-secondary-foreground/70 hover:text-foreground'
	};
</script>

<a {href} class="font-medium transition-colors {variants[variant]} {className}">
	{@render children()}
</a>