<script lang="ts">
	import Logo from './Logo.svelte';
	import Link from './Link.svelte';
	import {page} from "$app/state";

	const footerLinks = $derived(page.data.footerLinks || []);

	function chunkArray(array: any[], size: number) {
		const chunks = [];
		for (let i = 0; i < array.length; i += size) {
			chunks.push(array.slice(i, i + size));
		}
		return chunks;
	}

	const linkColumns = $derived(chunkArray(footerLinks, 3));
</script>

<footer class="border-t border-border bg-light dark:bg-dark py-12 z-50">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 gap-12 md:grid-cols-4">
			<div class="col-span-1 md:col-span-2">
				<div class="flex items-center gap-2 text-xl font-bold tracking-tight text-primary">
					<Logo />
					PulseCheck
				</div>
				<p class="mt-4 max-w-xs text-sm text-secondary-foreground/60">
					Modern, Open-Source Platform to monitor your systems.
				</p>
			</div>
			<div class="flex flex-col">
				<h4 class="text-sm font-bold uppercase tracking-wider text-foreground">
					Links
				</h4>
				{#each linkColumns as column, index}
					<div>
						<ul class="mt-4 space-y-2">
							{#each column as link}
								<li>
									<Link href={link.url} variant="muted" class="text-sm">
										{link.name}
									</Link>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</div>
		<div class="mt-12 border-t border-border pt-8 text-center text-sm text-secondary-foreground/60">
			<p>&copy; {new Date().getFullYear()} PulseCheck. All rights reserved.</p>
		</div>
	</div>
</footer>