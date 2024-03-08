import { FastifyInstance } from "fastify";
import { createApplicationsBodyJSONSchema } from "./applications.schema";
import {
  createApplicationsHandler,
  getApplicationsHandler,
} from "./applications.controllers";

export async function applicationsRoutes(app: FastifyInstance) {
  app.post(
    "/",
    {
      schema: createApplicationsBodyJSONSchema,
    },
    createApplicationsHandler
  );

  app.get("/", getApplicationsHandler);
}
