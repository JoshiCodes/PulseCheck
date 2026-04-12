<script lang="ts">
	interface Props {
		class?: string;
		animate?: boolean;
	}

	let { class: className = '', animate = true }: Props = $props();
</script>

<div
	class="rounded-md bg-secondary/50 {animate ? 'animate-pulse' : ''} {className}"
	aria-hidden="true"
></div>
