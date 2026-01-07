import { User } from "../../../domain/user/user.entity";
import { UserRepository } from "../../../domain/user/user.repository";
import { AppTable } from "../table";

export class UserDynamooseRepository implements UserRepository {

  async create(user: User): Promise<User> {
    await AppTable.create({
      PK: `USER#${user.id}`,
      SK: "PROFILE",

      GSI1PK: user.teamId ? `TEAM#${user.teamId}` : undefined,
      GSI1SK: user.teamId ? `USER#${user.id}` : undefined,

      entity: "USER",

      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      teamId: user.teamId,
    });

    return user;
  }

  async findById(id: string): Promise<User | null> {
    const item = await AppTable.get({
      PK: `USER#${id}`,
      SK: "PROFILE",
    });

    if (!item) return null;

    return new User(
      item.id,
      item.email,
      item.name,
      item.role,
      item.teamId
    );
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    const updated = await AppTable.update(
      { PK: `USER#${id}`, SK: "PROFILE" },
      updateData
    );

    return new User(
      updated.id,
      updated.email,
      updated.name,
      updated.role,
      updated.teamId
    );
  }

  async delete(id: string): Promise<void> {
    await AppTable.delete({
      PK: `USER#${id}`,
      SK: "PROFILE",
    });
  }

  async listByTeam(teamId: string): Promise<User[]> {
    const result = await AppTable.query("GSI1PK")
      .eq(`TEAM#${teamId}`)
      .using("GSI1")
      .exec();

    return result.map(
      item =>
        new User(
          item.id,
          item.email,
          item.name,
          item.role,
          item.teamId
        )
    );
  }
}
