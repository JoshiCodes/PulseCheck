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

export const customLinks = sqliteTable('custom_links', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	url: text('url').notNull(),
	order: integer('order').notNull().default(0),
	location: text('location').notNull().$type<"header"|"footer">().default('header'),
});

export const oidcProviders = sqliteTable('oidc_providers', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	clientId: text('client_id').notNull(),
	clientSecret: text('client_secret').notNull(),
	issuer: text('issuer').notNull(),
	enabled: integer('enabled', { mode: 'boolean' }).default(true),
	scopes: text('scopes'),
	authentication: text('authentication').$type<"basic" | "post">(),
});

export * from './auth.schema';
