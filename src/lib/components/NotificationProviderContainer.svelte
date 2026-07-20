<script lang="ts">

	import type { Snippet } from 'svelte';

	type Props = {
		title: string,
		description?: string|null,
		children: Snippet
	}

	let { title, description, children }: Props = $props();

</script>


<div class="">
	<h3 class="text-2xl font-bold">{title}</h3>
	{#if description}
		<p class="text-zinc-500">
			{description}
		</p>
	{/if}
	<div class="mt-2 md:mt-4">
		{@render children()}
	</div>
</div>