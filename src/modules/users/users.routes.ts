import { FastifyInstance } from "fastify";
import {
  assignRoleToUserHandler,
  createUserHandler,
  loginHandler,
} from "./users.controllers";
import {
  AssignRoleToUserBodyT,
  assignRoleToUserJsonSchema,
  createUserJsonSchema,
  loginJsonSchema,
} from "./users.schema";
import { createRoleJSONSchema } from "../roles/roles.schemas";
import { PERMISSIONS } from "../../config/permissions";

export async function userRoutes(app: FastifyInstance) {
  app.post(
    "/",
    {
      schema: createUserJsonSchema,
    },
    createUserHandler
  );
  app.post(
    "/login",
    {
      schema: loginJsonSchema,
    },
    loginHandler
  );
  app.post<{ Body: AssignRoleToUserBodyT }>(
    "/roles",
    {
      schema: assignRoleToUserJsonSchema,
      preHandler: [app.guard.scope(PERMISSIONS["users:roles:write"])],
    },
    assignRoleToUserHandler
  );
}
