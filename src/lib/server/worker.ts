import { Queue, Worker } from 'bullmq';
import { db } from '$lib/server/db';
import { monitorLogs, monitors } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { runMonitorCheck } from '$lib/server/checker';
import { env } from '$env/dynamic/private';
import { building } from '$app/environment';

const connection = {
	host: env.REDIS_HOST || 'localhost',
	port: env.REDIS_PORT ? parseInt(env.REDIS_PORT) : 6379
};

const QUEUE_NAME = 'monitor-checks';

export let monitorQueue: Queue | undefined;
export let monitorWorker: Worker | undefined;

if (!building) {
	console.log('Initializing BullMQ Queue and Worker...');

	monitorQueue = new Queue(QUEUE_NAME, { connection });

	monitorWorker = new Worker(
		QUEUE_NAME,
		async (job) => {
			const { monitorId } = job.data;
			const [monitor] = await db.select().from(monitors).where(eq(monitors.id, monitorId)).limit(1);
			if (!monitor || !monitor.active) return;

			await runMonitorCheck(monitor);
		},
		{ connection }
	);

	monitorWorker.on('error', (err) => {
		console.error('Worker Error:', err);
	});

	monitorWorker.on('failed', (job, err) => {
		console.error(`Job ${job?.id} failed:`, err);
	});
}