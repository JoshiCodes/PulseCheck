<script lang="ts">
	import Logo from './Logo.svelte';
	import Link from './Link.svelte';
</script>

<footer class="border-t border-border bg-background py-12 bottom-0 z-50">
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
			<div>
				<h4 class="text-sm font-bold uppercase tracking-wider text-foreground">Product</h4>
				<ul class="mt-4 space-y-2">
					<li><Link href="/features" variant="muted" class="text-sm">Features</Link></li>
					<li><Link href="/pricing" variant="muted" class="text-sm">Pricing</Link></li>
					<li><Link href="/docs" variant="muted" class="text-sm">Documentation</Link></li>
				</ul>
			</div>
			<div>
				<h4 class="text-sm font-bold uppercase tracking-wider text-foreground">Legal</h4>
				<ul class="mt-4 space-y-2">
					<li><Link href="/privacy" variant="muted" class="text-sm">Privacy</Link></li>
					<li><Link href="/terms" variant="muted" class="text-sm">Terms</Link></li>
				</ul>
			</div>
		</div>
		<div class="mt-12 border-t border-border pt-8 text-center text-sm text-secondary-foreground/60">
			<p>&copy; {new Date().getFullYear()} PulseCheck. Alle Rechte vorbehalten.</p>
		</div>
	</div>
</footer>