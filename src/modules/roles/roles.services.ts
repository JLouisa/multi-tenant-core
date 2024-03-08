import { InferInsertModel } from "drizzle-orm";
import { db } from "../../db";
import { roles, RolesSchemaT } from "../../db/schema";

export async function createRole(data: RolesSchemaT) {
  const result = await db.insert(roles).values(data).returning();
  return result[0];
}
