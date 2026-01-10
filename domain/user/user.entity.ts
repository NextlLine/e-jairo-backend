import { UserRoles } from "../types/UserRoles";

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly role: UserRoles,
    public readonly teamId: string,
    public readonly createdAt: Date = new Date()
  ) { }
}

