import { db } from '$lib/server/db';
import { settings } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const Settings = {
	/**
	 * Get a value from the database.
	 * @param key - The key of the value to retrieve.
	 * @param defaultValue - The default value to return if the key is not found.
	 * @returns The value of the key, or the default value if the key is not found.
	 */
	async get<T>(key: string, defaultValue: T): Promise<T> {
		try {
			const [result] = await db
				.select()
				.from(settings)
				.where(eq(settings.key, key))
				.limit(1);

			if (!result) return defaultValue;

			return JSON.parse(result.value) as T;
		} catch (error) {
			return defaultValue;
		}
	},

	/**
	 * Set a value in the database.
	 * @param key - The key of the value to set.
	 * @param value - The value to set.
	 * @returns A promise that resolves when the value has been set.
	 * @remarks This method uses an upsert operation to insert or update the value in the database.
	 * The value is stored as a JSON string, so it can be any serializable value.
	 */
	async set(key: string, value: any): Promise<void> {
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