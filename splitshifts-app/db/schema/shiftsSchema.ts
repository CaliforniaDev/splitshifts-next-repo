import { pgTable, uuid, varchar, text, timestamp, numeric, pgEnum } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { organizations } from './organizationsSchema';
import { workSites, roles } from './workSitesAndRolesSchema';
import { employees } from './employeesSchema';

// Enums for status fields
export const shiftStatusEnum = pgEnum('shift_status', ['draft', 'published', 'cancelled']);
export const assignmentStatusEnum = pgEnum('assignment_status', ['pending', 'accepted', 'declined', 'cancelled']);

export const shiftGroups = pgTable('shift_groups', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  orgId: uuid('org_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  shiftDate: timestamp('shift_date', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const shifts = pgTable('shifts', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  orgId: uuid('org_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  workSiteId: uuid('work_site_id')
    .notNull()
    .references(() => workSites.id, { onDelete: 'cascade' }),
  roleId: uuid('role_id')
    .notNull()
    .references(() => roles.id, { onDelete: 'cascade' }),
  shiftGroupId: uuid('shift_group_id')
    .references(() => shiftGroups.id, { onDelete: 'set null' }),
  shiftStart: timestamp('shift_start', { withTimezone: true }).notNull(),
  shiftEnd: timestamp('shift_end', { withTimezone: true }).notNull(),
  hourlyRate: numeric('hourly_rate', { precision: 10, scale: 2 }),
  notes: text('notes'),
  status: shiftStatusEnum('status').notNull().default('draft'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const shiftAssignments = pgTable('shift_assignments', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  orgId: uuid('org_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  shiftId: uuid('shift_id')
    .notNull()
    .references(() => shifts.id, { onDelete: 'cascade' })
    .unique(),
  employeeId: uuid('employee_id')
    .notNull()
    .references(() => employees.id, { onDelete: 'cascade' }),
  status: assignmentStatusEnum('status').notNull().default('pending'),
  assignedAt: timestamp('assigned_at', { withTimezone: true }).notNull().defaultNow(),
  respondedAt: timestamp('responded_at', { withTimezone: true }),
  responseNotes: text('response_notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
