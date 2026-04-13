import  { monitorLogs, type monitors } from '$lib/server/db/schema';
import { db } from '$lib/server/db';

export async function runMonitorCheck(monitor: typeof monitors.$inferSelect) {

	const start = performance.now();
	let status: number | null = null;
	let responseTime: number;

	try {
		const res = await fetch(monitor.url, {
			signal: AbortSignal.timeout(monitor.timeout * 1000),
			headers: {
				'Cache-Control': 'no-cache'
			}
		});

		status = res.status;
		responseTime = Math.round(performance.now() - start);

		const accepted = monitor.status_accepted.split(",").map(s => s.trim());
		const isUp = accepted.includes(status.toString());

		await db.insert(monitorLogs).values({
			monitorId: monitor.id,
			status,
			responseTime
		});

		return {
			success: isUp,
			status,
			responseTime
		}
	} catch (error) {
		responseTime = Math.round(performance.now() - start);

		await db.insert(monitorLogs).values({
			monitorId: monitor.id,
			status: status ?? 0,
			responseTime
		});

		return {
			success: false,
			 status: 0,
			 responseTime
		}
	}

}