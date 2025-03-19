import {
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  first_name: varchar('first_name', { length: 255 }).notNull(),
  last_name: varchar('last_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
  is_active: boolean('is_active').notNull().default(true),
  two_factor_secret: text('2fa_secret'),
  two_factor_enabled: boolean('2fa_enabled').notNull().default(false),
});
