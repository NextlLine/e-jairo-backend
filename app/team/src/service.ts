import z from "zod";
import { TeamRepository } from "../../../domain/team/team.repository";
import { UnityRepository } from "../../../domain/unity/unity.repository";
import { Team } from "../../../domain/team/team.entity";
import { randomUUID } from "crypto";
import { HttpError } from "../../../shared/errors/http-error";
import { mapToHttpError } from "../../../shared/errors/map-http-error";
import { UserRoles } from "../../../domain/types/UserRoles";
import { verifyUserRole } from "../../../infra/dynamoose/shared/verify-user-permission";
import { UserRepository } from "../../../domain/user/user.repository";

const CreateTeamSchema = z.object({
  name: z.string().min(3).max(50),
  unityId: z.string().uuid(),
});

export class TeamService {
  constructor(
    private readonly teamRepository: TeamRepository, 
    private readonly unityRepository: UnityRepository, 
    private readonly userRepository: UserRepository
  ) { }

  async createTeam(teamData: z.infer<typeof CreateTeamSchema>, userSub: string) {
    await verifyUserRole(userSub, [UserRoles.ADMIN], this.userRepository);
    
    const validatedData = CreateTeamSchema.parse(teamData);

    const existingUnity = await this.unityRepository.findById(validatedData.unityId);
    if (!existingUnity) {
      throw new HttpError(404, "Unidade não encontrada");
    }

    const team = new Team(
      randomUUID(),
      validatedData.name,
      validatedData.unityId,
    );

    try {
      await this.teamRepository.create(team);
      return team;

    } catch (error) {
      return mapToHttpError(error, "criar time");
    }
  }
}