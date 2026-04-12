import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';
import { env } from '$env/dynamic/private';
import postgres from 'postgres';

let isBuilding = false;
try {
	const { building } = await import('$app/environment');
	isBuilding = building;
} catch (e) {
	isBuilding = false;
}

if (!env.DATABASE_URL && !isBuilding) throw new Error('DATABASE_URL is not set');

const client = postgres(env.DATABASE_URL || 'postgres://dummy:dummy@localhost:5432/dummy', {
	max: isBuilding ? 0 : 10,
	idle_timeout: 20,
	max_lifetime: 60 * 30
});
export const db = drizzle(client, { schema });
