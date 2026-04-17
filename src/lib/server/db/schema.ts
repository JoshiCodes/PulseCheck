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
	name: text('name').notNull().unique(),
	url: text('url').notNull().unique(),
	active: boolean('active').notNull().default(true),
	type: text().notNull().default('http'),
	interval: integer('interval').notNull().default(60),
	timeout: integer('timeout').notNull().default(30),
	retries: integer('retries').notNull().default(0),
	status_accepted: text().notNull().default('200,201,202,204'),
});

export const pages = pgTable('pages', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	active: boolean('active').notNull().default(true),
	monitors: text('monitors').notNull().default(''), // Comma-separated list of monitor IDs

	createdAt: timestamp('created_at', { withTimezone: true, mode: "date"}).$defaultFn(() => new Date()),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: "date"}).$defaultFn(() => new Date()),

	requiresAuth: boolean('requires_auth').notNull().default(false),
})

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
