import { FastifyInstance } from "fastify";
import { createUserHandler } from "./users.controllers";
import { createUserJsonSchema } from "./users.schema";

export async function userRoutes(app: FastifyInstance) {
  app.post(
    "/",
    {
      schema: createUserJsonSchema,
    },
    createUserHandler
  );
}
