import { asc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { customLinks } from '$lib/server/db/schema';

let cachedLinks: any = null;

export const getLinks = async () => {
	if (cachedLinks) return cachedLinks;

	const allLinks = await db.select().from(customLinks).orderBy(asc(customLinks.order));
	cachedLinks = {
		headerLinks: allLinks.filter((l) => l.location === 'header'),
		footerLinks: allLinks.filter((l) => l.location === 'footer')
	};
	return cachedLinks;
};

export const clearLinkCache = () => {
	cachedLinks = null;
};
