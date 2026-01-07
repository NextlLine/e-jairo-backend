import { AppTable } from "../table";

export class TeamDynamooseRepository {
  async create(team: {
    id: string;
    name: string;
    hash: string;
    unityId: string;
  }) {
    return AppTable.create({
      PK: `TEAM#${team.id}`,
      SK: "PROFILE",

      GSI2PK: `UNITY#${team.unityId}`,
      GSI2SK: `TEAM#${team.id}`,

      entity: "TEAM",

      ...team,
    });
  }

  async findById(teamId: string) {
    return AppTable.get({
      PK: `TEAM#${teamId}`,
      SK: "PROFILE",
    });
  }

  async listByUnity(unityId: string) {
    return AppTable.query("GSI2PK")
      .eq(`UNITY#${unityId}`)
      .using("GSI2")
      .exec();
  }
}
