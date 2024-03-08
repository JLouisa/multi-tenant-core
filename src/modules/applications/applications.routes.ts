import { FastifyInstance } from "fastify";
import { createApplicationsBodyJSONSchema } from "./applications.schema";
import { createApplicationsHandler } from "./applications.controllers";

export async function applicationsRoutes(app: FastifyInstance) {
  app.post(
    "/",
    {
      schema: createApplicationsBodyJSONSchema,
    },
    createApplicationsHandler
  );

  app.get("/applications", async (request, reply) => {
    // create an application
  });
}
