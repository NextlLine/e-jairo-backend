export const UserRoles = {
  ADMIN: "ADMIN",
  MASTER: "MASTER",
  USER: "USER",
} as const;

export type UserRoles = typeof UserRoles[keyof typeof UserRoles];
