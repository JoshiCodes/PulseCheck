<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		type?: 'button' | 'submit' | 'reset';
		variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		class?: string;
		onclick?: (e: MouseEvent) => void;
		disabled?: boolean;
		children: Snippet;
	}

	let {
		type = 'button',
		variant = 'primary',
		size = 'md',
		class: className = '',
		onclick,
		disabled = false,
		children
	}: Props = $props();

	const variants = {
		primary: 'bg-primary-500 text-primary-foreground border-primary-700 shadow-sm hover:brightness-110 active:scale-[0.98] hover:bg-primary-400',
		secondary: 'bg-secondary text-secondary-foreground border-secondary shadow-sm hover:bg-secondary/80 active:scale-[0.98]',
		outline: 'border-border bg-transparent hover:bg-secondary text-foreground active:scale-[0.98]',
		ghost: 'bg-transparent hover:bg-secondary border-none text-foreground active:scale-[0.98]'
	};

	const sizes = {
		sm: 'px-3 py-1.5 text-xs',
		md: 'px-4 py-2 text-sm',
		lg: 'px-6 py-3 text-base'
	};
</script>

<button
	{type}
	{onclick}
	{disabled}
	class="inline-flex items-center justify-center rounded-lg font-medium
	transition-all duration-200 ease-in-out
	border
	 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20
	 disabled:pointer-events-none disabled:opacity-50 {variants[variant]} {sizes[size]} {className}"
>
	{@render children()}
</button>