import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const task = sqliteTable('task', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	title: text('title').notNull(),
	priority: integer('priority').notNull().default(1)
});

export const product = sqliteTable('product', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	description: text('description'),
	rawCost: real('raw_cost').notNull().default(0),
	weightG: real('weight_g').notNull().default(0),
	logisticsReceivingCostPerKg: real('logistics_receiving_cost_per_kg').notNull().default(0),
	packagingManufacturingCost: real('packaging_manufacturing_cost').notNull().default(0),
	logisticsDeliveryCost: real('logistics_delivery_cost').notNull().default(0),
	markupPercentage: real('markup_percentage').notNull().default(0),
	gstPercentage: real('gst_percentage').notNull().default(18),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const settings = sqliteTable('settings', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	businessName: text('business_name').notNull().default(''),
	defaultMarkupPercentage: real('default_markup_percentage').notNull().default(0),
	defaultLogisticsReceivingCostPerKg: real('default_logistics_receiving_cost_per_kg')
		.notNull()
		.default(0),
	defaultGstPercentage: real('default_gst_percentage').notNull().default(18)
});

export * from './auth.schema';
