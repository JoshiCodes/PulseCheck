import { clearLinkCache, getLinks } from '$lib/server/linksCache';

let cachedLinks: any = null;
let lastFetch = 0;
const CACHE_DURATION = 1000 * 60 * 15; // 15 minutes

export const load = async ({ setHeaders }) => {

	const now = Date.now();
	if (now - lastFetch > CACHE_DURATION) {
		clearLinkCache();
		lastFetch = now;
	}
	cachedLinks = await getLinks();

	return {
		headerLinks: cachedLinks?.headerLinks || [],
		footerLinks: cachedLinks?.footerLinks || []
	};

};