import { z } from "zod";
import { ALL_PERMISSIONS } from "../../config/permissions";
import zodToJsonSchema from "zod-to-json-schema";

const createRoleBodySchema = z.object({
  name: z.string().min(3).max(255),
  permissions: z.array(z.enum(ALL_PERMISSIONS)),
  //   applicationId: z.string().uuid(),
});

export type CreateRoleBodyT = z.infer<typeof createRoleBodySchema>;

export const createRoleJSONSchema = {
  body: zodToJsonSchema(createRoleBodySchema, "createRoleBodySchema"),
};
