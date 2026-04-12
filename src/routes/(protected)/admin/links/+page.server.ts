import { db } from '$lib/server/db';
import { customLinks, oidcProviders } from '$lib/server/db/schema';
import { fail } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { clearLinkCache } from '$lib/server/linksCache';

export const load = async () => {
	return {
		links: await db.select().from(customLinks).orderBy(customLinks.location, customLinks.order),
	};
};

export const actions = {
	add: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const location = formData.get('location') as string;
		const url = formData.get('url') as string;

		if (!name || !location || !url) {
			return fail(400, { message: 'Missing required fields' });
		}

		if (location !== 'header' && location !== 'footer') {
			return fail(400, { message: 'Invalid location' });
		}

		const existingLinks = await db
			.select()
			.from(customLinks)
			.where(and(eq(customLinks.name, name), eq(customLinks.location, location)))
			.limit(1);

		if (existingLinks.length > 0) {
			return fail(400, { message: 'Link name already exists' });
		}

		await db.insert(customLinks).values({
			name,
			location,
			url
		});

		clearLinkCache();

		return { success: true };
	},
	updateOrder: async ({ request }) => {
		const data = await request.formData();
		const items = JSON.parse(data.get('items') as string);

		// Batch Update in Drizzle
		for (const item of items) {
			await db.update(customLinks).set({ order: item.order }).where(eq(customLinks.id, item.id));
		}
		clearLinkCache();

		return { success: true };
	},
	delete: async ({ url }) => {
		const id = url.searchParams.get('id');
		if (id) {
			await db.delete(customLinks).where(eq(customLinks.id, parseInt(id)));
			clearLinkCache();
			return { success: true };
		}
		return { success: false, error: 'ID is required' };
	}
};