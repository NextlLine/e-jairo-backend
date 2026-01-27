import { dynamooseUnityRepository } from "../../../infra/dynamoose/repositories/unity.dynamoose.repository";
import { dynamooseAddressRepository } from "../../../infra/dynamoose/repositories/address.dynamoose.repository";
import { formatHttpErrorResponse } from "../../../shared/errors/format-http-error-response";
import { UnityService } from "./service";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const unityService = new UnityService(dynamooseUnityRepository, dynamooseAddressRepository);

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
        return formatHttpErrorResponse(err, "Erro ao criar unidade");
    }
}