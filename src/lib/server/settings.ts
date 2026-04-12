import { db } from '$lib/server/db';
import { settings } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const Settings = {
	async get<T>(key: string, defaultValue: T): Promise<T> {
		try {
			const result = db.select().from(settings).where(eq(settings.key, key)).get();
			if (!result) return defaultValue;
			return JSON.parse(result.value) as T;
		} catch {
			return defaultValue;
		}
	},

	async set(key: string, value: any) {
		const jsonValue = JSON.stringify(value);
		await db
			.insert(settings)
			.values({ key, value: jsonValue })
			.onConflictDoUpdate({
				target: settings.key,
				set: { value: jsonValue }
			});
	}
};
