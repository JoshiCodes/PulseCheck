import { Settings } from '$lib/server/settings';

export const load = async () => {

	return {
		settings: {
			allowSignUp: await Settings.get('allowSignUp', true),
			showAllOnMainPage: await Settings.get('showAllOnMainPage', true),
			defaultStatusPage: await Settings.get('defaultStatusPage', null),

			lastSaved: await Settings.get('lastSaved', null)
		}
	};

};

export const actions = {
	saveSettings: async ({ request }) => {

	}
}