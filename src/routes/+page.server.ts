import { db } from '$lib/server/db';
import { monitors, monitorLogs } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import { Settings } from '$lib/server/settings';
import { redirect } from '@sveltejs/kit';

export const load = async ({locals}) => {

	if (!await Settings.get('showAllOnMainPage', true)) {

		const defaultStatusPage = await Settings.get('defaultStatusPage', null);

		if(defaultStatusPage) throw redirect(
			302,
			`/status/${defaultStatusPage}`
		);

		if (!locals.user) throw redirect(302, '/login');
		else throw redirect(302, '/admin');
	}

	const allMonitors = await db.select().from(monitors);

	// Load last 10 logs for each monitor
	const monitorsWithLogs = await Promise.all(
		allMonitors.map(async (m) => {
			const logs = await db
				.select()
				.from(monitorLogs)
				.where(eq(monitorLogs.monitorId, m.id))
				.orderBy(desc(monitorLogs.createdAt))
				.limit(10);

			return {
				...m,
				recentLogs: logs.reverse() // Reverse the logs to show the latest first
			};
		})
	);

	return {
		monitors: monitorsWithLogs
	};
};
