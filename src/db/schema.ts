import {
  pgTable,
  primaryKey,
  timestamp,
  uuid,
  varchar,
  uniqueIndex,
  text,
} from "drizzle-orm/pg-core";

export const applications = pgTable("applications", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  createAt: timestamp("create_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().notNull(),
    email: varchar("email", { length: 256 }).notNull(),
    name: varchar("email", { length: 256 }).notNull(),
    applicationId: uuid("applications_id")
      .references(() => applications.id)
      .notNull(),
    password: varchar("password", { length: 256 }).notNull(),
    createAt: timestamp("create_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (users) => {
    return {
      cpk: primaryKey(users.email, users.applicationId),
      idIndex: uniqueIndex("users_id_index").on(users.id),
    };
  }
);

export const roles = pgTable(
  "roles",
  {
    id: uuid("id").defaultRandom().notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    applicationId: uuid("applications_id")
      .references(() => applications.id)
      .notNull(),
    permissions: text("permissions").array().$type<Array<String>>().notNull(),
    createAt: timestamp("create_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (roles) => {
    return {
      cpk: primaryKey(roles.name, roles.applicationId),
      idIndex: uniqueIndex("roles_id_index").on(roles.id),
    };
  }
);

export const usersToRoles = pgTable(
  "users_to_roles",
  {
    applicationId: uuid("applications_id")
      .references(() => applications.id)
      .notNull(),
    roleId: uuid("roles_id")
      .references(() => roles.id)
      .notNull(),
    userId: uuid("users_id")
      .references(() => users.id)
      .notNull(),
  },
  (usersToRoles) => {
    return {
      cpk: primaryKey(
        usersToRoles.applicationId,
        usersToRoles.userId,
        usersToRoles.roleId
      ),
    };
  }
);
