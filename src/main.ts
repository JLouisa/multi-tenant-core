import { migrate } from "drizzle-orm/node-postgres/migrator";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { buildServer } from "./utils/server";
import { db } from "./db";

async function gracefulShutdown({
  app,
}: {
  app: Awaited<ReturnType<typeof buildServer>>;
}) {
  logger.info("Shutting down server...");

  await app.close();

  logger.info("Server has been shut down.");
}

async function main() {
  console.log("Hello, World!");

  const app = await buildServer();

  await app.listen({ port: env.PORT, host: env.HOST });

  await migrate(db, {
    migrationsFolder: "./migrations",
  });

  const signals = ["SIGINT", "SIGTERM"] as const;

  logger.info(env, "Debug");

  for (const signal of signals) {
    process.on(signal, async () => {
      console.log(`Received ${signal}.`);
      await gracefulShutdown({ app });

      process.exit(0);
    });
  }
}

main();
