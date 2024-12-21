
import { pgTable, uuid, varchar, integer, pgEnum, timestamp, char, date, text, boolean, smallint } from "drizzle-orm/pg-core";

const SESSION_TIMEOUT = 1000 * 60 * 60 * 12;

export const userTypeEnum = pgEnum("user_type_enum", ["internal", "external"])

export const usersTable = pgTable("users", {
  id: uuid().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  userType: userTypeEnum("user_type").default("external"),
  createdAt: timestamp("created_at").defaultNow(),
  lastUpdatedAt: timestamp("last_updated_at")
})

export const sessionsTable = pgTable("sessions", {
  id: uuid().primaryKey(),
  userId: uuid("user_id").references(() => usersTable.id),
  expiresAt: timestamp("created_at").$defaultFn(() => {
    return new Date(Date.now() + (SESSION_TIMEOUT))
  })
})

export const addressTable = pgTable("address", {
  id: uuid().primaryKey(),
  cep: char({ length: 9 }).notNull(),
  street: varchar({ length: 100 }).notNull(),
  neighborhood: varchar({ length: 100 }).notNull(),
  city: varchar({ length: 100 }).notNull(),
  uf: char({ length: 2 }).notNull(),
  number: integer(),
  complement: text(),
  description: text(),
  createdAt: timestamp("crated_at").defaultNow(),
})

export const workTypeEnum = pgEnum("work_enum", [
  "formal",
  "informal",
  "unemployed"
])
export const housingTypeEnum = pgEnum("housing_enum", [
  "own",
  "minha_casa_minha_vida",
  "rent",
  "given"
])
export const relationTypeEnum = pgEnum("relation_enum", [
  "maried",
  "stable_union",
  "affair",
  "ex",
  "none"
])

export const usersExtraDataTable = pgTable("extra_data", {
  id: uuid().primaryKey().references(() => usersTable.id),
  cpf: char({ length: 11}).notNull(),
  birthDate: date().notNull(),
  phone: varchar({ length: 13 }),
  adultChildren: integer().default(0),
  minorChildren: integer().default(0),
  work: workTypeEnum().notNull(),
  income: varchar({ length: 50 }).notNull(),
  housing: housingTypeEnum().notNull(),
  relation: relationTypeEnum().notNull(),
  home: uuid().references(() => addressTable.id)
})

export const volunteerKindTable = pgTable("volunteer_kind", {
  id: uuid().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  enabled: boolean().default(true),
  createdBy: uuid("created_by").references(() => usersTable.id),
  createdAt: timestamp("created_at").defaultNow(),
})

export const volunteersTable = pgTable("volunteers", {
  id: uuid().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  phone: varchar({ length: 13 }).notNull(),
  description: text(),
  enabled: boolean().default(true),
  createdBy: uuid("created_by").references(() => usersTable.id),
  createdAt: timestamp("created_at").defaultNow(),
  kind: uuid("kind_id").references(() => volunteerKindTable.id).notNull()
})

export const helpKindTable = pgTable("help_kind", {
  id: uuid().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  enabled: boolean().default(true),
  createdBy: uuid("created_by").references(() => usersTable.id),
  createdAt: timestamp("created_at").defaultNow(),
})

export const helpsTable = pgTable("helps", {
  id: uuid().primaryKey(),
  description: text().notNull(),
  kind: uuid("kind_id").references(() => helpKindTable.id).notNull(),
  createdBy: uuid("created_by").references(() => usersTable.id),
  createdAt: timestamp("created_at").defaultNow(),
  deletedAt: timestamp("deleted_at").defaultNow(),
  resolvedAt: timestamp("resolved_at").defaultNow(),
  rate: smallint(),
})
