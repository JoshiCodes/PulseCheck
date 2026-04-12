import  { type Handle, redirect } from '@sveltejs/kit';
import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { user } from '$lib/server/db/auth.schema';
import { db } from '$lib/server/db';
import { count } from 'drizzle-orm';
import { sequence } from '@sveltejs/kit/hooks';

let isSetupComplete = false;

const handleSetup: Handle = async ({event, resolve}) => {
	if(building) return resolve(event);

	if(!isSetupComplete) {
		try {
			const res = await db.select({value: count()}).from(user);
			if(res[0].value > 0) {
				isSetupComplete = true;
			}
		} catch (e) {
			console.error("Error checking setup status:", e);
			console.warn(
				"This may be the result of a missing user table. If you haven't set up your database yet, please do so by running bun run db:generate and bun run db:push."
			);
		}
	}

	const isSetupRoute = event.url.pathname.startsWith("/setup");

	if(!isSetupComplete && !isSetupRoute) {
		throw redirect(303, "/setup");
	}

	if(isSetupComplete && isSetupRoute) {
		throw redirect(303, "/");
	}

	return resolve(event);

}

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

export const handle: Handle = sequence(handleSetup, handleBetterAuth);
