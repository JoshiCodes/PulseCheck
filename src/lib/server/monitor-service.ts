import { monitors } from '$lib/server/db/schema';
import { monitorQueue } from '$lib/server/worker';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { runMonitorCheck } from '$lib/server/checker';

export const MonitorService = {

	async upsertJob(monitor: typeof monitors.$inferSelect) {
		if(!monitorQueue) {
			console.warn("Skipping upsert job because the queue is not initialized. This may be the result of running in a build environment or an issue with BullMQ initialization.");
			return;
		}
		await monitorQueue.add(
			'monitor-' + monitor.id,
			{ monitorId: monitor.id },
			{
				repeat: { every: monitor.interval * 1000 },
				jobId: monitor.id.toString()
			}
		);
		console.log(`Monitor ${monitor.id} added to queue.`);
		await runMonitorCheck(monitor);
	},

	async syncMonitorsWithQueue() {
		if(!monitorQueue) {
			console.warn("Skipping syncing monitors with queue because the queue is not initialized. This may be the result of running in a build environment or an issue with BullMQ initialization.");
			return;
		}
		const allActive = await db.select().from(monitors).where(eq(monitors.active, true));
		for(const m of allActive) {
			console.log(`Syncing monitor ${m.id} with queue...`);
			await this.upsertJob(m);
		}
	}

};