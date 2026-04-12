import { db } from '$lib/server/db';
import { oidcProviders } from '$lib/server/db/schema';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async () => {
	return {
		providers: await db.select().from(oidcProviders)
	};
};

export const actions = {
	save: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id') as string;
		const name = data.get('name') as string;
		const clientId = data.get('clientId') as string;
		const clientSecret = data.get('clientSecret') as string;
		const issuer = data.get('issuer') as string;
		const scopes = data.get('scope') as string;
		const authentication = data.get('authentication') as string;

		if(authentication !== "basic" && authentication !== "post") {
			return fail(400, { message: 'Invalid Authentication Method' });
		}

		if (!id || !name || !clientId || !clientSecret) {
			return fail(400, { message: 'Pflichtfelder fehlen' });
		}

		await db
			.insert(oidcProviders)
			.values({
				id,
				name,
				clientId,
				clientSecret,
				issuer: issuer,
				enabled: true,
				scopes: scopes || "",
				authentication: authentication as "basic" | "post"
			})
			.onConflictDoUpdate({
				target: oidcProviders.id,
				set: { name, clientId, clientSecret, issuer: issuer, scopes: scopes || "", authentication: authentication as "basic" | "post" }
			});

		if(process.env.NODE_ENV === "production") {
			setTimeout(() => {
				console.log('Restarting server to apply new OIDC settings...');
				process.exit(0);
			}, 1000);
		} else {
			console.warn('OIDC settings updated. Please restart the server to apply changes.');
		}

		return { success: true };
	},
	delete: async ({ url }) => {
		const id = url.searchParams.get('id');
		if (id) {
			await db.delete(oidcProviders).where(eq(oidcProviders.id, id));
		}
	}
};