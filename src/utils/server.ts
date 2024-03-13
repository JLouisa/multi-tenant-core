import fastify from "fastify";
import guard from "fastify-guard";
import { logger } from "./logger";
import { applicationsRoutes } from "../modules/applications/applications.routes";
import { userRoutes } from "../modules/users/users.routes";
import { ResetAppRoutes } from "../modules/dev/reset";
import { roleRoutes } from "../modules/roles/roles.routes";
import { env } from "../config/env";
import jwt from "jsonwebtoken";

type User = {
  id: string;
  applicationId: string;
  scopes: string[];
};

declare module "fastify" {
  interface FastifyRequest {
    user: User;
  }
}

export async function buildServer() {
  const app = fastify({ logger });

  app.decorateRequest("user", null);

  app.addHook("onRequest", async (request, reply) => {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return;
    }

    try {
      const token = authHeader.replace("Bearer ", "");
      const decoded = jwt.verify(token, env.JWT_SECRET) as User;

      request.user = decoded;
    } catch (error) {
      logger.error(error);
      reply.code(401).send({ message: "Unauthorized" });
    }
  });

  // Register plugins
  app.register(guard, {
    requestProperty: "user",
    scopeProperty: "scopes",
    errorHandler: (error, request, reply) => {
      logger.error(error);
      reply.code(500).send({ message: "Not possible" });
    },
  });

  // Register routes
  app.register(applicationsRoutes, { prefix: "/api/applications" });
  app.register(userRoutes, { prefix: "/api/users" });
  app.register(roleRoutes, { prefix: "/api/roles" });
  app.register(ResetAppRoutes, { prefix: "/api/reset" });

  return app;
}
