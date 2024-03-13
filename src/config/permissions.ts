export const ALL_PERMISSIONS = [
  // Users
  "users:roles:write", // Allowed to add a role to a user
  "users:roles:delete", // Allowed to remove a role from a user

  // Roles
  "roles:write", // Allowed to create a role

  // Post
  "post:write",
  "post:read",
  "post:delete",
  "post:edit-own",
] as const;

export const PERMISSIONS = ALL_PERMISSIONS.reduce((acc, permission) => {
  acc[permission] = permission;
  return acc;
}, {} as Record<(typeof ALL_PERMISSIONS)[number], (typeof ALL_PERMISSIONS)[number]>);

export const USER_ROLE_PERMISSIONS = [
  PERMISSIONS["post:write"],
  PERMISSIONS["post:read"],
];

export const SYSTEM_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  APPLICATION_USER: "APPLICATION_USER",
};
