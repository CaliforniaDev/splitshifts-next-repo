import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  uuid,
} from 'drizzle-orm/pg-core';
import { users } from './usersSchema';

export const emailVerificationTokenSchema = pgTable('email_verification_tokens', {
  id: uuid('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  token: text('token').notNull(),
  tokenExpiration: timestamp('token_expiration').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
