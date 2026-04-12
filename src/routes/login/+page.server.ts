import { fail, redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import { sanitizeReturnTo } from '$lib/utils';
import { db } from '$lib/server/db';
import { oidcProviders } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = async () => {
	const providers = await db.select({
		id: oidcProviders.id,
		name: oidcProviders.name
	})
		.from(oidcProviders)
		.where(eq(oidcProviders.enabled, true));

	return {
		providers
	};
};

export const actions = {
	default: async ({ request, url }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const rememberMe = formData.get('remember-me') === 'on';

		try {
			await auth.api.signInEmail({
				body: { email, password, rememberMe }
			});
		} catch (err: any) {
			return fail(400, { error: 'Wrong email or password.' });
		}

		const redirectTo = sanitizeReturnTo(url.searchParams.get('returnTo'), '/admin');
		throw redirect(302, redirectTo);
	}
};
