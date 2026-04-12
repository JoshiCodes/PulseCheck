import { pgTable, serial, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

export const task = pgTable('task', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	title: text('title').notNull(),
	priority: integer('priority').notNull().default(1)
});

export const monitors = pgTable('monitors', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	url: text('url').notNull(),
	active: boolean('active').notNull().default(true)
});

export const monitorLogs = pgTable('monitor_logs', {
	id: serial('id').primaryKey(),
	monitorId: integer('monitor_id').references(() => monitors.id, { onDelete: 'cascade' }),
	status: integer('status'),
	responseTime: integer('response_time'), // in ms
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).$defaultFn(() => new Date())
});

export const settings = pgTable('settings', {
	key: text('key').primaryKey(),
	value: text('value').notNull()
});

export const customLinks = pgTable('custom_links', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	url: text('url').notNull(),
	order: integer('order').notNull().default(0),
	location: text('location').notNull().$type<'header' | 'footer'>().default('header')
});

export const oidcProviders = pgTable('oidc_providers', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	clientId: text('client_id').notNull(),
	clientSecret: text('client_secret').notNull(),
	issuer: text('issuer').notNull(),
	enabled: boolean('enabled').default(true),
	scopes: text('scopes'),
	authentication: text('authentication').$type<'basic' | 'post'>()
});

export * from './auth.schema';
