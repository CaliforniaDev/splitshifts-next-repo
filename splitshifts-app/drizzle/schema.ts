import { pgTable, foreignKey, unique, serial, integer, text, timestamp, varchar, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const passwordResetTokens = pgTable("password_reset_tokens", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id"),
	token: text(),
	tokenExpiration: timestamp("token_expiration", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "password_reset_tokens_user_id_users_id_fk"
		}).onDelete("cascade"),
	unique("password_reset_tokens_user_id_unique").on(table.userId),
]);

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	firstName: varchar("first_name", { length: 255 }).notNull(),
	lastName: varchar("last_name", { length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	password: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	"2FaSecret": text("2fa_secret"),
	"2FaEnabled": boolean("2fa_enabled").default(false).notNull(),
	lastLogin: timestamp("last_login", { mode: 'string' }),
	emailVerified: boolean("email_verified").default(false).notNull(),
	emailVerifiedAt: timestamp("email_verified_at", { mode: 'string' }),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const emailVerificationTokens = pgTable("email_verification_tokens", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	token: text().notNull(),
	tokenExpiration: timestamp("token_expiration", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "email_verification_tokens_user_id_users_id_fk"
		}).onDelete("cascade"),
	unique("email_verification_tokens_user_id_unique").on(table.userId),
]);
