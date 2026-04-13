import { db } from '$lib/server/db';
import { monitors } from '$lib/server/db/schema';

export const load = async () => {

	const all = await db.select().from(monitors);

	if (!all) {
		return {
			monitors: []
		}
	}

	return {
		monitors: all
	};

};