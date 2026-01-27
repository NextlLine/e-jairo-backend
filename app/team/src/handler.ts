import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ZodError } from "zod";
import { TeamService } from "./service";
import { dynamooseTeamRepository } from "../../../infra/dynamoose/repositories/team.dynamoose.repository";
import { dynamooseUnityRepository } from "../../../infra/dynamoose/repositories/unity.dynamoose.repository";
import { formatHttpErrorResponse } from "../../../shared/errors/format-http-error-response";
import { HttpError } from "../../../shared/errors/http-error";

const teamService = new TeamService(dynamooseTeamRepository, dynamooseUnityRepository);

export async function create(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        if (!event.body) {
            throw new HttpError(400, "Time nao fornecido");
        }

        const body = JSON.parse(event.body!);
        const response = await teamService.createTeam(body);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Team created successfully" , data: response }),
        };
    } catch (err: any) {
        return formatHttpErrorResponse(err, "Erro ao criar time");
    } 
}

