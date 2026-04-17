import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { monitors } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = async ({ params }) => {

	const id = parseInt(params.id);
	if(isNaN(id)) {
		throw error(400, 'Invalid monitor ID');
	}

	const [monitor] = await db.select().from(monitors)
		.where(eq(monitors.id, id))
		.limit(1);

	if(!monitor) {
		throw error(404, 'Monitor not found');
	}

	return {
		monitor
	};

};

export const actions = {
	delete: async ({ params }) => {
		const id = parseInt(params.id);
		if(isNaN(id)) {
			throw error(400, 'Invalid monitor ID');
		}

		await db.delete(monitors).where(eq(monitors.id, id));
		return { success: true };

	}
}