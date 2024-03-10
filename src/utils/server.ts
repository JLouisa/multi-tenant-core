import fastify from "fastify";
import { logger } from "./logger";
import { applicationsRoutes } from "../modules/applications/applications.routes";
import { userRoutes } from "../modules/users/users.routes";
import { ResetAppRoutes } from "../modules/dev/reset";

export async function buildServer() {
  const app = fastify({ logger });

  // Register plugins

  // Register routes
  app.register(applicationsRoutes, { prefix: "/api/applications" });
  app.register(userRoutes, { prefix: "/api/users" });
  app.register(ResetAppRoutes, { prefix: "/api/reset" });

  return app;
}
