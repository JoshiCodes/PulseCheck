import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { monitors, pages } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = async ({ params }) => {

	const allMonitors = await db.select().from(monitors);

	return {
		monitors: allMonitors
	};

};

export const actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const slug = formData.get('slug') as string;
		const monitors = formData.getAll('monitors') as string[];
		const active = formData.get('active') === 'on';
		const requiresAuth = formData.get('requiresAuth') === 'on';

		if (!name || !slug) {
			throw error(400, 'Name and slug are required');
		}

		const [existingPage] = await db.select()
			.from(pages).where(eq(pages.slug, slug)).limit(1);

		if(existingPage) {
			throw error(400, 'Page with this slug already exists');
		}

		const monitorsString = monitors.join(',');

		const page = await db.insert(pages).values({
			name,
			slug,
			active,
			monitors: monitorsString,
			requiresAuth
		});

	}
}