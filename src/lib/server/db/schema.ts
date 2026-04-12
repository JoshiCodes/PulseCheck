import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const task = sqliteTable('task', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	title: text('title').notNull(),
	priority: integer('priority').notNull().default(1)
});

export const monitors = sqliteTable('monitors', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	url: text('url').notNull(),
	active: integer('active', { mode: "boolean" }).notNull().default(true),
});

export const monitorLogs = sqliteTable('monitor_logs', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	monitorId: integer('monitor_id').references(() => monitors.id, { onDelete: 'cascade' }),
	status: integer('status'),
	responseTime: integer('response_time'), // in ms
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const settings = sqliteTable('settings', {
	key: text('key').primaryKey(),
	value: text('value').notNull()
});

export * from './auth.schema';
