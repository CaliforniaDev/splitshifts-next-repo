import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core';
import { users } from './usersSchema';

export const emailVerificationTokenSchema = pgTable('email_verification_tokens', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  token: text('token').notNull(),
  tokenExpiration: timestamp('token_expiration').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
