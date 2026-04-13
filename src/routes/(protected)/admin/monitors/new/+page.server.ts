import  { isMonitorType } from '$lib/types';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { monitors } from '$lib/server/db/schema';
import { eq, or } from 'drizzle-orm';
import { MonitorService } from '$lib/server/monitor-service';

export const actions = {
	create: async ({ request }) => {

		const formData = await request.formData();
		const name = formData.get('name') as string;
		const url = formData.get('url') as string;
		if(!name || !url) {
			return fail(400, { error: 'Name and URL are required' });
		}
		// validate type
		const type = formData.get('type');
		if(!type) {
			return fail(400, { error: 'Monitor type is required' });
		}
		if(!isMonitorType(type)) {
			return fail(400, { error: 'Invalid monitor type' });
		}

		if(type == "http") {
			if(!url.startsWith("http://") && !url.startsWith("https://")) {
				return fail(400, { error: 'URL must start with http:// or https://' });
			}
		}

		const checkInterval = Number(formData.get('checkInterval')) || 60;
		const timeout = Number(formData.get('timeout')) || 30;
		const retries = Number(formData.get('retries')) || 0;

		if(!checkInterval || checkInterval < 60 || checkInterval > 3600) {
			return fail(400, { error: 'Check interval must be between 60 and 3600 seconds' });
		}
		if(!timeout || timeout < 1 || timeout > 60) {
			return fail(400, { error: 'Timeout must be between 1 and 60 seconds' });
		}
		if(retries < 0) {
			return fail(400, { error: 'Retries must be a non-negative number' });
		}

		const statusCodes = (formData.get('statusCodes') || "200, 201, 202, 204") as string;

		if (!statusCodes || !statusCodes.match(/^\d+(,\s*\d+)*$/)) {
			return fail(400, { error: 'Status codes must be a list of numbers' });
		}

		const existing = await db.select()
			.from(monitors)
			.where(
				or(
					eq(monitors.name, name),
					eq(monitors.url, url)
				)
			);

		if(existing.length > 0) {
			const nameExists = existing.some(m => m.name === name);
			const urlExists = existing.some(m => m.url === url);
			if(nameExists && urlExists) {
				return fail(400, { error: 'Monitor with this name and URL already exists' });
			}
			if(nameExists) {
				return fail(400, { error: 'A monitor with this name already exists' });
			}
			if(urlExists) {
				return fail(400, { error: 'A monitor with this URL already exists' });
			}
			return fail(400, { error: 'A monitor with this name or URL already exists' });
		}

		const [monitor] = await db.insert(monitors).values({
			name,
			url,
			active: true,
			type,
			interval: checkInterval,
			timeout,
			retries,
			status_accepted: statusCodes
		}).returning();

		if(!monitor) {
			return fail(500, { error: 'Failed to create monitor' });
		}

		await MonitorService.upsertJob(monitor);

		return {
			success: true,
			id: monitor.id
		}

	}
};