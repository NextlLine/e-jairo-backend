import z from "zod";
import { TeamRepository } from "../../../domain/team/team.repository";
import { UnityRepository } from "../../../domain/unity/unity.repository";
import { Team } from "../../../domain/team/team.entity";
import { randomUUID } from "crypto";

const CreateTeamSchema = z.object({
  name: z.string().min(3).max(50),
  hash: z.string().min(10).max(100),
  unityId: z.string().uuid(),
});

export class TeamService {
  constructor(private readonly teamRepository: TeamRepository, private readonly unityRepository: UnityRepository) { }

  async createTeam(teamData: z.infer<typeof CreateTeamSchema>) {
    const validatedData = CreateTeamSchema.parse(teamData);

    const existingUnity = await this.unityRepository.findById(validatedData.unityId);
    if (!existingUnity) {
      throw new Error("Unity not found");
    }  
    
    const team = new Team(
      randomUUID(),
      validatedData.name,
      validatedData.hash,
      validatedData.unityId,
    );

    await this.teamRepository.create(team);

    return team;
  }
}