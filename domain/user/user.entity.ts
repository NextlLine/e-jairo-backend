export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly role: "ADMIN" | "USER",
    public readonly teamId?: string,
    public readonly createdAt: Date = new Date()
  ) { }
}
