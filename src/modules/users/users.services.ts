import { db } from "../../db";
import argon2 from "argon2";
import {
  UsersSchemaInsertT,
  users,
  applications,
  usersToRoles,
  UsersToRolesSchemaInsertT,
} from "../../db/schema";
import { eq } from "drizzle-orm";

export async function createUser(data: UsersSchemaInsertT) {
  const hashedPassword = await argon2.hash(data.password);

  const result = await db
    .insert(users)
    .values({ ...data, password: hashedPassword })
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
      applicationId: applications.id,
    });

  return result[0];
}

export async function getUserByApplication(applicationId: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.applicationId, applicationId));

  return result;
}

export async function assignRoleToUser(data: UsersToRolesSchemaInsertT) {
  const result = await db.insert(usersToRoles).values(data).returning();

  return result[0];
}
