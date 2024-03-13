import { FastifyInstance } from "fastify";
import { createRoleHandler } from "./roles.controllers";
import { CreateRoleBodyT, createRoleJSONSchema } from "./roles.schemas";
import { PERMISSIONS } from "../../config/permissions";

export async function roleRoutes(app: FastifyInstance) {
  app.post<{ Body: CreateRoleBodyT }>(
    "/",
    {
      schema: createRoleJSONSchema,
      preHandler: [app.guard.scope(PERMISSIONS["roles:write"])],
    },
    createRoleHandler
  );
}
