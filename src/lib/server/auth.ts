import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { env } from '$env/dynamic/private';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import { oidcProviders, user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { genericOAuth } from 'better-auth/plugins';
import type { GenericEndpointContext } from 'better-auth';
import { bootstrapProviders } from '$lib/server/bootstrap';

const dbProviders = await db.select().from(oidcProviders).where(eq(oidcProviders.enabled, true));

const providers = dbProviders.map((provider) => ({
	providerId: provider.id,
	clientId: provider.clientId,
	clientSecret: provider.clientSecret,
	issuer: provider.issuer,
	discoveryUrl: provider.issuer + "/.well-known/openid-configuration",
	authentication: provider.authentication || "basic",
	scopes: (provider.scopes && provider.scopes.length > 0) ? provider.scopes.split(' ') : ["openid", "profile", "email"], // default scopes if not provided
	autoLink: true,
}));

if(providers.length === 0 && env.INIT_OIDC_ID) {
	await bootstrapProviders();
}

export const auth = betterAuth({
	baseURL: env.ORIGIN,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'sqlite' }),
	emailAndPassword: { enabled: true },
	databaseHooks: {
		user: {
			create: {
				before: (async (u: any, _context: any) => {
					const [existingUser] = await db.select()
						.from(user)
						.where(eq(user.email, u.email))
						.limit(1);

					const users = await db.select().from(user).limit(1);

					if (!existingUser) {
						const signUpAllowed = true || users.length === 0; // TODO

						if (!signUpAllowed) {
							throw new Error("Registration is disabled. Only existing users can log in.");
						}
					}

					return user;
				}) as any
			}
		}
	},
	plugins: [
		genericOAuth({
			config: providers
		}),
		sveltekitCookies(getRequestEvent) // make sure this is the last plugin in the array
	]
});
