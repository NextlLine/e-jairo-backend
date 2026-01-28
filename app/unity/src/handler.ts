import { dynamooseUnityRepository } from "../../../infra/dynamoose/repositories/unity.dynamoose.repository";
import { dynamooseAddressRepository } from "../../../infra/dynamoose/repositories/address.dynamoose.repository";
import { formatHttpErrorResponse } from "../../../shared/errors/format-http-error-response";
import { UnityService } from "./service";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { dynamooseUserRepository } from "../../../infra/dynamoose/repositories/user.dynamoose.repository";
import { HttpError } from "../../../shared/errors/http-error";

const unityService = new UnityService(dynamooseUnityRepository, dynamooseAddressRepository, dynamooseUserRepository);

export async function create(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Must pass unity data" }),
            };
        }

        if (!event.requestContext.authorizer){
            throw new HttpError(401, "Não autorizado");
        }

        const body = JSON.parse(event.body!);
        const userSub = event.requestContext.authorizer.jwt.claims.sub;

        const response = await unityService.createUnity(body, userSub);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Unity created successfully", data: response }),
        };

    } catch (err: any) {
        return formatHttpErrorResponse(err, "Erro ao criar unidade");
    }
}