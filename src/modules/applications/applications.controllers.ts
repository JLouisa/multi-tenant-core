import { FastifyReply, FastifyRequest } from "fastify";
import { CreateApplicationsBody } from "./applications.schema";
import { createApplications } from "./applications.services";
import { applications } from "../../db/schema";
import {
  ALL_PERMISSIONS,
  SYSTEM_ROLES,
  USER_ROLE_PERMISSIONS,
} from "../../config/permissions";
import { createRole } from "../roles/roles.services";

export async function createApplicationsHandler(
  request: FastifyRequest<{ Body: CreateApplicationsBody }>,
  reply: FastifyReply
) {
  // create an application
  const { name } = request.body;
  const application = await createApplications({ name });

  const superAdminRole = await createRole({
    applicationId: applications.id,
    name: SYSTEM_ROLES.SUPER_ADMIN,
    permissions: ALL_PERMISSIONS as unknown as string[],
  });

  const applicationUserRole = await createRole({
    applicationId: applications.id,
    name: SYSTEM_ROLES.APPLICATION_USER,
    permissions: USER_ROLE_PERMISSIONS as unknown as string[],
  });
  return { application, superAdminRole, applicationUserRole };
}
