import { pgTable, uuid, varchar, text, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { organizations } from './organizationsSchema';

export const workSites = pgTable('work_sites', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  orgId: uuid('org_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  address: text('address'),
  timezone: varchar('timezone', { length: 50 }).notNull().default('America/New_York'),
  contactInfo: jsonb('contact_info').$type<{
    primaryContact?: string;
    phone?: string;
    email?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
  }>(),
  is247: boolean('is_24_7').notNull().default(false),
  accessInstructions: jsonb('access_instructions').$type<{
    keyLocation?: string;
    accessCodes?: string;
    specialInstructions?: string;
    contactRequired?: boolean;
  }>(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const roles = pgTable('roles', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  orgId: uuid('org_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  hourlyRate: varchar('hourly_rate', { length: 20 }), // Store as string to avoid precision issues
  requirements: jsonb('requirements').$type<{
    minimumAge?: number;
    requiredCertifications?: string[];
    physicalRequirements?: string[];
    equipmentProvided?: string[];
    specialSkills?: string[];
  }>(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});
