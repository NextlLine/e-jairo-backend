import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { TeamService } from "./service";
import { dynamooseTeamRepository } from "../../../infra/dynamoose/repositories/team.dynamoose.repository";
import { dynamooseUnityRepository } from "../../../infra/dynamoose/repositories/unity.dynamoose.repository";
import { HttpError } from "../../../shared/errors/http-error";
import { dynamooseUserRepository } from "../../../infra/dynamoose/repositories/user.dynamoose.repository";

const teamService = new TeamService(dynamooseTeamRepository, dynamooseUnityRepository, dynamooseUserRepository);

export async function create(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    if (!event.body) {
        throw new HttpError(400, "Time nao fornecido");
    }

    if (!event.requestContext.authorizer){
        throw new HttpError(401, "Não autorizado");
    }

     const body = JSON.parse(event.body!);
    const userSub = event.requestContext.authorizer.jwt.claims.sub;

    const response = await teamService.createTeam(body, userSub);

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Team created successfully", data: response }),
    };
}

