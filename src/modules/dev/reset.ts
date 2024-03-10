import { FastifyInstance } from "fastify";
import { db } from "../../db";
import { applications, roles, users, usersToRoles } from "../../db/schema";

export async function ResetAppRoutes(app: FastifyInstance) {
  app.delete("/", ResetApp);
}

export async function ResetApp() {
  try {
    await db.delete(users);
    await db.delete(usersToRoles);
    await db.delete(roles);
    await db.delete(applications);
  } catch (error) {
    console.error(error);
    return error;
  }
}
