import { env } from '$env/dynamic/private';
import { db } from './db';
import { oidcProviders } from './db/schema';
import { eq } from 'drizzle-orm';

export async function bootstrapProviders() {
	/*
	#INIT_OIDC_ID="my-provider"
#INIT_OIDC_DISPLAY="My Provider"
#INIT_OIDC_URL="https://my-provider.com"
#INIT_OIDC_CLIENT_ID="my-client-id"
#INIT_OIDC_CLIENT_SECRET="my-client-secret"
#INIT_OIDC_AUTH_TYPE="basic" # or "post"
#INIT_OIDC_SCOPE="openid profile email"
	 */
	if (!env.INIT_OIDC_ID || !env.INIT_OIDC_DISPLAY ||
		!env.INIT_OIDC_URL || !env.INIT_OIDC_CLIENT_ID || !env.INIT_OIDC_CLIENT_SECRET
		|| !env.INIT_OIDC_AUTH_TYPE || !env.INIT_OIDC_SCOPE
	) return;

	try {

		const existing = await db
			.select()
			.from(oidcProviders)
			.where(eq(oidcProviders.id, env.INIT_OIDC_ID))
			.limit(1);

		if (existing.length === 0) {
			console.log(`[Bootstrap] Adding provider: ${env.INIT_OIDC_DISPLAY}`);
			await db.insert(oidcProviders).values({
				id: env.INIT_OIDC_ID as string,
				name: env.INIT_OIDC_DISPLAY as string,
				clientId: env.INIT_OIDC_CLIENT_ID as string,
				clientSecret: env.INIT_OIDC_CLIENT_SECRET as string,
				issuer: env.INIT_OIDC_URL as string,
				enabled: true,
				scopes: env.INIT_OIDC_SCOPE as string,
				authentication: env.INIT_OIDC_AUTH_TYPE as "basic"|"post"
			});

			console.log(`[Bootstrap] Provider ${env.INIT_OIDC_DISPLAY} added successfully.`);
			console.warn(`[Bootstrap] The Server will stop now. The INIT_OIDC_* variables will be ignored upon next start.`);

			process.exit(0);

		}
	} catch (e) {
		console.error('[Bootstrap] Failed Create Provider:', e);
	}
}
