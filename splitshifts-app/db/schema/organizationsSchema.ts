import { pgTable, uuid, varchar, text, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const organizations = pgTable('organizations', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  weekStartDay: varchar('week_start_day', { length: 10 }).notNull().default('monday'),
  settings: jsonb('settings').$type<{
    dashboardTint?: string;
    payPeriodType?: 'weekly' | 'bi-weekly' | 'monthly';
    payPeriodStartDay?: string;
    defaultShiftDuration?: number;
    overtimeThreshold?: number;
    [key: string]: any;
  }>().default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});
