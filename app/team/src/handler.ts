import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ZodError } from "zod";
import { TeamService } from "./service";
import { dynamooseTeamRepository } from "../../../infra/dynamoose/repositories/team.dynamoose.repository";
import { dynamooseUnityRepository } from "../../../infra/dynamoose/repositories/unity.dynamoose.repository";

const teamService = new TeamService(dynamooseTeamRepository, dynamooseUnityRepository);

export async function create(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Must pass team data" }),
            };
        }

        const body = JSON.parse(event.body!);
        const response = await teamService.createTeam(body);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Team created successfully" , data: response }),
        };
    } catch (err: any) {
        console.error("Error in createTeam handler:", err);

        if (err instanceof ZodError) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Invalid input", errors: err.issues }),
            };
        }

        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error: " + err.message }),
        };
    } 
}

