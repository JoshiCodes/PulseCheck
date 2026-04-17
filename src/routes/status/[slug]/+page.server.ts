import { error, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { pages, monitors, monitorLogs } from '$lib/server/db/schema';
import { eq, inArray, desc } from 'drizzle-orm';

export const load = async ({ params, locals }) => {
	// 1. Seite laden
	const [page] = await db.select().from(pages).where(eq(pages.slug, params.slug)).limit(1);

	if (!page) throw error(404, 'Status page not found');

	// Zugriffsschutz
	if (!page.active && !locals.user) throw error(403, 'This page is currently offline');
	if (page.requiresAuth && !locals.user) {
		throw redirect(302, `/login?redirectTo=/status/${page.slug}`);
	}

	// 2. Monitore auflösen (IDs aus String extrahieren)
	const monitorIds = page.monitors
		.split(',')
		.map((id) => parseInt(id.trim()))
		.filter((id) => !isNaN(id));

	let monitorsWithLogs: any[] = [];

	if (monitorIds.length > 0) {
		const allMonitors = await db.select().from(monitors).where(inArray(monitors.id, monitorIds));

		// 3. Für jeden Monitor die letzten 10 Logs holen
		monitorsWithLogs = await Promise.all(
			allMonitors.map(async (m) => {
				const logs = await db
					.select()
					.from(monitorLogs)
					.where(eq(monitorLogs.monitorId, m.id))
					.orderBy(desc(monitorLogs.createdAt))
					.limit(10);

				return {
					...m,
					recentLogs: logs.reverse() || [] // Umdrehen für die Timeline (alt nach neu)
				};
			})
		);
	}

	return { page, monitors: monitorsWithLogs };
};
