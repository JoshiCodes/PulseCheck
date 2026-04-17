import { error, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { monitors, pages } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = async ({ params }) => {

	const id = parseInt(params.id);
	if(isNaN(id)) {
		throw error(400, 'Invalid page ID');
	}

	const [page] = await db.select().from(pages).where(eq(pages.id, id)).limit(1);

	if(!page) {
		throw error(404, 'Page not found');
	}

	const allMonitors = await db.select().from(monitors);

	return {
		page,
		allMonitors
	};

};

export const actions = {
	update: async ({ request, params }) => {
		const id = parseInt(params.id);
		if (isNaN(id)) throw error(400, 'Invalid ID');

		const data = await request.formData();

		const name = data.get('name')?.toString();
		const slug = data.get('slug')?.toString();
		const active = data.get('active') === 'true';
		const requiresAuth = data.get('requires_auth') === 'true';
		const monitorIdsRaw = data.get('monitorIds')?.toString();

		if (!name || !slug) {
			return fail(400, { error: 'Name and Slug are required' });
		}

		try {
			await db
				.update(pages)
				.set({
					name,
					slug,
					active,
					requiresAuth,
					monitors: monitorIdsRaw,
					updatedAt: new Date()
				})
				.where(eq(pages.id, id));

			return { success: true };
		} catch (e: any) {
			console.error(e);
			return fail(500, { error: e.message || 'Failed to update page' });
		}
	},

	delete: async ({ params }) => {
		const id = parseInt(params.id);
		if(isNaN(id)) {
			throw error(400, 'Invalid page ID');
		}

		try {
			await db.delete(pages).where(eq(pages.id, id));
		} catch (e) {
			console.error(e);
			return fail(500, { error: 'Failed to delete page' });
		}

		return { success: true };

	}
}