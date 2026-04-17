import { db } from '$lib/server/db';
import { pages } from '$lib/server/db/schema';

export const load = async () => {

	const all = await db.select().from(pages);

	if (!all) {
		return {
			pages: []
		}
	}

	return {
		pages: all
	};

};