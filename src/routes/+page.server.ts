import { db } from '$lib/server/db';
import { monitors, monitorLogs } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';

export const load = async () => {
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
