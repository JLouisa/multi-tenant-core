import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserBodyT } from "./users.schema";
import { SYSTEM_ROLES } from "../../config/permissions";
import { getRoleByName } from "../roles/roles.services";
import {
  assignRoleToUser,
  createUser,
  getUserByApplication,
} from "./users.services";
import { applications } from "../../db/schema";

export async function createUserHandler(
  req: FastifyRequest<{ Body: CreateUserBodyT }>,
  reply: FastifyReply
) {
  const { initialUser, ...data } = req.body;

  console.log(`initialUser`);
  console.log(initialUser);

  console.log(`data`);
  console.log(data);

  const roleName = initialUser
    ? SYSTEM_ROLES.SUPER_ADMIN
    : SYSTEM_ROLES.APPLICATION_USER;

  console.log(`roleName`);
  console.log(roleName);

  if (roleName === SYSTEM_ROLES.SUPER_ADMIN) {
    const appUsers = await getUserByApplication(data.applicationId);

    console.log(`appUsers`);
    console.log(appUsers);

    if (appUsers.length > 0) {
      return reply.code(400).send({
        message: "Super admin already exists for this application.",
        extensions: {
          code: "APPLICATION_ALREADY_SUPER_SUPER",
          app: data.applicationId,
        },
      });
    }
  }

  const role = await getRoleByName({
    name: roleName,
    applicationId: data.applicationId,
  });

  console.log(`role`);
  console.log(role);

  // Should never happen if application is properly created
  if (!role) {
    return reply.code(404).send({
      message: "Role not found",
      extensions: {
        code: "ROLE_NOT_FOUND",
        role: roleName,
      },
    });
  }

  try {
    const user = await createUser(data);

    console.log(`user`);
    console.log(user);

    await assignRoleToUser({
      userId: user.id,
      applicationId: data.applicationId,
      roleId: role.id,
    });

    // Assign a role to User
    return user;
  } catch (error) {
    console.error(error);
    return reply.code(500).send({
      message: "Error creating user",
      extensions: {
        code: "ERROR_CREATING_USER",
      },
    });
  }
}
