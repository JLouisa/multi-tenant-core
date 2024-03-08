import { InferInsertModel } from "drizzle-orm";
import { db } from "../../db";
import { applications, ApplicationsSchemaInsertT } from "../../db/schema";

export async function createApplications(data: ApplicationsSchemaInsertT) {
  const result = await db
    .insert(applications)
    .values({
      name: data.name,
    })
    .returning();

  return result[0];
}

export async function getApplications() {
  // SELECT * FROM applications;
  // SELECT id, name, created_at FROM applications;
  const result = await db
    .select({
      id: applications.id,
      name: applications.name,
      createdAt: applications.createAt,
    })
    .from(applications);

  return result;
}
