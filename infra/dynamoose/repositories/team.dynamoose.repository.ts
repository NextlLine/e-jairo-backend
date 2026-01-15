import { Team } from "../../../domain/team/team.entity";
import { TeamRepository } from "../../../domain/team/team.repository";
import { AppTable } from "../table";

export class TeamDynamooseRepository implements TeamRepository {
  async create(team: Team): Promise<Team> {
    await AppTable.create({
      PK: `TEAM#${team.id}`,
      SK: "PROFILE",

      GSI2PK: `UNITY#${team.unityId}`,
      GSI2SK: `TEAM#${team.id}`,

      entity: "TEAM",

      ...team,
    });

    return team;
  }

  async findById(teamId: string): Promise<Team | null> {
    const item = await AppTable.get({
      PK: `TEAM#${teamId}`,
      SK: "PROFILE",
    });

    if (!item) return null;

    return new Team(
      item.id,
      item.name,
      item.hash,
      item.unityId,
    );
  }

  async listByUnity(unityId: string): Promise<Team[]> {
    const items = await AppTable.query("GSI2PK")
      .eq(`UNITY#${unityId}`)
      .using("GSI2")
      .exec();

    return items.map((item: any) => new Team(
      item.id,
      item.name,
      item.unityId,
      item.hash,
    ));
  }
}

export const dynamooseTeamRepository = new TeamDynamooseRepository();