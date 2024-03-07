import { logger } from "./utils/logger";
import { buildServer } from "./utils/server";

async function main() {
  console.log("Hello, World!");

  const app = await buildServer();

  app.listen({ port: 3000 });

  logger.info("Server is running on http://localhost:3000");
}

main();
