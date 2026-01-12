import { Team } from "./team.entity";

export interface TeamRepository {
  create(team: Team): Promise<Team>;
  findById(teamId: string): Promise<Team | null>;
  listByUnity(unityId: string): Promise<Team[]>;
}