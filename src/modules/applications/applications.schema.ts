import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const createApplicationsBodySchema = z.object({
  name: z.string({ required_error: "Name is required" }),
});

export type CreateApplicationsBody = z.infer<
  typeof createApplicationsBodySchema
>;

export const createApplicationsBodyJSONSchema = {
  body: zodToJsonSchema(
    createApplicationsBodySchema,
    "createApplicationsBodySchema"
  ),
};
