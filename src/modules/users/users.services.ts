import { db } from "../../db";
import argon2 from "argon2";
import {
  UsersSchemaInsertT,
  users,
  applications,
  usersToRoles,
  UsersToRolesSchemaInsertT,
  roles,
} from "../../db/schema";
import { and, eq } from "drizzle-orm";

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

export async function getUserByEmail({
  email,
  applicationId,
}: {
  email: string;
  applicationId: string;
}) {
  const result = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      applicationId: users.applicationId,
      roleId: roles.id,
      password: users.password,
      permissions: roles.permissions,
    })
    .from(users)
    .where(and(eq(users.email, email), eq(users.applicationId, applicationId)))
    // LEFT JOIN
    // FROM usersToRoles
    // ON usersToRoles.userId = users.id
    // AND usersToRoles.applicationId = users.applicationId
    .leftJoin(
      usersToRoles,
      and(
        eq(usersToRoles.userId, users.id),
        eq(usersToRoles.applicationId, users.applicationId)
      )
    )
    // LEFT JOIN
    // FROM roles
    // ON roles.id = usersToRoles.roleId
    .leftJoin(roles, eq(roles.id, usersToRoles.roleId));

  if (!result.length) {
    return null;
  }

  const user = result.reduce((acc, current) => {
    if (!acc.id) {
      return { ...current, permissions: new Set(current.permissions) };
    }

    if (!current.permissions) {
      return acc;
    }

    for (const permissions of current.permissions) {
      acc.permissions.add(permissions);
    }

    return acc;
  }, {} as Omit<(typeof result)[number], "permissions"> & { permissions: Set<string> });

  return {
    ...user,
    permissions: Array.from(user.permissions),
  };
}
