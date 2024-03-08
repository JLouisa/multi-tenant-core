import { FastifyReply, FastifyRequest } from "fastify";
import { CreateApplicationsBody } from "./applications.schema";
import { createApplications, getApplications } from "./applications.services";
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

  const superAdminRolePromise = createRole({
    applicationId: application.id,
    name: SYSTEM_ROLES.SUPER_ADMIN,
    permissions: ALL_PERMISSIONS as unknown as string[],
  });

  const applicationUserRolePromise = createRole({
    applicationId: application.id,
    name: SYSTEM_ROLES.APPLICATION_USER,
    permissions: USER_ROLE_PERMISSIONS as unknown as string[],
  });

  const [superAdminRole, applicationUserRole] = await Promise.allSettled([
    superAdminRolePromise,
    applicationUserRolePromise,
  ]);

  if (applicationUserRole.status === "rejected") {
    throw new Error("Failed to create applicationUserRole");
  }
  if (superAdminRole.status === "rejected") {
    throw new Error("Failed to create superAdminRole");
  }

  return {
    application,
    superAdminRole: superAdminRole.value,
    applicationUserRole: applicationUserRole.value,
  };
}

export async function getApplicationsHandler() {
  const applications = await getApplications();
  return applications;
}
