import { db } from '$lib/server/db';
import { monitors, monitorLogs } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';

export const load = async () => {
	const allMonitors = await db.select().from(monitors);

	// Wir laden für jeden Monitor die letzten 10 Ergebnisse
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
				recentLogs: logs.reverse() // Zeitlich aufsteigend für die Timeline
			};
		})
	);

	return {
		monitors: monitorsWithLogs
	};
};
