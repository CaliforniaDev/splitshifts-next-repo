import {
  pgTable,
  uuid,
  integer,
  varchar,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { organizations } from './organizationsSchema';
import { users } from './usersSchema';

export const organizationUsers = pgTable('organization_users', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  orgId: uuid('org_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 50 }).notNull().default('admin'), // For now, everyone who creates org is admin
  isActive: boolean('is_active').notNull().default(true),
  joinedAt: timestamp('joined_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Create an enum for organization roles (for future expansion)
export const orgRoleEnum = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  MEMBER: 'member',
} as const;
