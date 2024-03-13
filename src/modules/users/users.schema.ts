import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

const createUserBodySchema = z.object({
  email: z.string().email(),
  name: z.string(),
  applicationId: z.string().uuid(),
  password: z.string().min(6),
  initialUser: z.boolean().optional(),
});

export type CreateUserBodyT = z.infer<typeof createUserBodySchema>;
export const createUserJsonSchema = {
  body: zodToJsonSchema(createUserBodySchema, "createUserBodySchema"),
};

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  applicationId: z.string().uuid(),
});

export type LoginBodyT = z.infer<typeof loginSchema>;

export const loginJsonSchema = {
  body: zodToJsonSchema(loginSchema, "loginSchema"),
};

// Assign role to user
const assignRoleToUserBodySchema = z.object({
  userId: z.string().uuid(),
  roleId: z.string().uuid(),
  // applicationId: z.string().uuid(),
});

export type AssignRoleToUserBodyT = z.infer<typeof assignRoleToUserBodySchema>;

export const assignRoleToUserJsonSchema = {
  body: zodToJsonSchema(
    assignRoleToUserBodySchema,
    "assignRoleToUserBodySchema"
  ),
};
