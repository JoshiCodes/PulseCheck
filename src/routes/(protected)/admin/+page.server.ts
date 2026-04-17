import { Settings } from '$lib/server/settings';
import { pages } from '$lib/server/db/schema';
import { db } from '$lib/server/db';

export const load = async () => {

	const allPages = await db.select().from(pages);

	return {
		settings: {
			allPages,

			allowSignUp: await Settings.get('allowSignUp', false),
			showAllOnMainPage: await Settings.get('showAllOnMainPage', true),
			defaultStatusPage: await Settings.get('defaultStatusPage', null),

			lastSaved: await Settings.get('lastSaved', null)
		}
	};

};

export const actions = {
	saveSettings: async ({ request }) => {
		const formData = await request.formData();
		const allowSignUp = formData.get('allowSignUp') === 'on';
		const showAllOnMainPage = formData.get('showAllOnMainPage') === 'on';
		const defaultStatusPage = formData.get('defaultStatusPage');

		await Settings.set('allowSignUp', allowSignUp);
		await Settings.set('showAllOnMainPage', showAllOnMainPage);
		await Settings.set('defaultStatusPage', defaultStatusPage || null);

		const date = new Date();
		await Settings.set('lastSaved', date.toLocaleString("en-US"));

		return { success: true, saved: date };

	}
}