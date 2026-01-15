import { dynamooseUnityRepository } from "../../../infra/dynamoose/repositories/unity.dynamoose.repository";
import { UnityService } from "./service";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ZodError } from "zod";

const unityService = new UnityService(dynamooseUnityRepository);

export async function create(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Must pass unity data" }),
            };
        }
        const body = JSON.parse(event.body!);
        const response = await unityService.createUnity(body);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Unity created successfully", data: response }),
        };

    } catch (err: any) {
        console.error("Error in createUnity handler:", err);

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