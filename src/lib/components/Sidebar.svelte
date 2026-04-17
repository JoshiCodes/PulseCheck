<script lang="ts">
    import { page } from '$app/state';

    const menuItems = [
        { name: 'Settings', href: '/admin' },
        { name: 'Monitors', href: '/admin/monitors' },
        { name: 'Pages', href: '/admin/pages' },
        { name: 'User Management', href: '/admin/users' },
        { name: 'OIDC Providers', href: '/admin/oidc', },
        { name: 'Custom Links', href: '/admin/links', }
    ];

    // Hilfsfunktion um zu prüfen, ob der Pfad aktiv ist
    const isActive = (href: string) => {
        if (href === '/admin') return page.url.pathname === '/admin';
        return page.url.pathname.startsWith(href);
    };
</script>

<aside class="h-screen w-64 flex-col border-r border-zinc-200  p-4 dark:border-zinc-800 bg-light dark:bg-dark">

    <nav class="flex-1 space-y-1">
        {#each menuItems as item}
            {@const active = isActive(item.href)}
            <a
                    href={item.href}
                    class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200
				{active
					? 'bg-primary-200 dark:bg-primary-950 text-primary-700 dark:text-primary-400'
					: 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100'}"
            >
                {item.name}
            </a>
        {/each}
    </nav>
</aside>