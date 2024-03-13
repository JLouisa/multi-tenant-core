import pino from "pino";

export const logger = pino({
  redact: ["DATABASE_CONNECTION", "JWT_SECRET"],
  level: "debug",
  transport: {
    target: "pino-pretty",
  },
});
