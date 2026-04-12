import { fail, redirect } from '@sveltejs/kit';
import { signUp } from '$lib/auth-client';
import { auth } from '$lib/server/auth';
import { sanitizeReturnTo } from '$lib/utils';
import { db } from '$lib/server/db';
import { oidcProviders } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = async () => {
	const providers = await db
		.select({
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
	default: async ({url, request, fetch}) => {
		const formData = await request.formData();
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		const confirmPassword = formData.get('password_confirm') as string;
		const name = formData.get("name") as string;

		if(!email || !password || !confirmPassword || !name) {
			return fail(400, { error: "All fields are required" });
		}

		if(!email.includes("@")) {
			return fail(400, { error: "Invalid email address" });
		}

		if(password !== confirmPassword) {
			return fail(400, { error: "Passwords do not match" });
		}

		try {
			await auth.api.signUpEmail({
				body: {
					email,
					password,
					name
				}
			});
		} catch (err: any) {
			console.error("Error during sign up:", err);
			return fail(400, { error: err.message });
		}


		const redirectTarget = sanitizeReturnTo(url.searchParams.get('returnTo'), '/admin');
		throw redirect(303, redirectTarget);

	}
}