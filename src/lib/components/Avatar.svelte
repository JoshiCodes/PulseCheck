<script lang="ts">
	interface Props {
		src?: string;
		fallback: string;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	}

	let { src, fallback, size = 'md', class: className = '' }: Props = $props();

	const sizes = {
		sm: 'h-8 w-8 text-xs',
		md: 'h-10 w-10 text-sm',
		lg: 'h-12 w-12 text-base'
	};
</script>

<div
	class="relative flex shrink-0 overflow-hidden rounded-full bg-secondary ring-2 ring-background {sizes[
		size
	]} {className}"
>
	{#if src}
		<img {src} alt={fallback} class="aspect-square h-full w-full object-cover" />
	{:else}
		<div class="flex h-full w-full items-center justify-center font-medium text-secondary-foreground">
			{fallback.substring(0, 2).toUpperCase()}
		</div>
	{/if}
</div>
