import { dynamooseUnityRepository } from "../../../infra/dynamoose/repositories/unity.dynamoose.repository";
import { dynamooseAddressRepository } from "../../../infra/dynamoose/repositories/address.dynamoose.repository";
import { formatHttpErrorResponse } from "../../../shared/errors/format-http-error-response";
import { UnityService } from "./service";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { dynamooseUserRepository } from "../../../infra/dynamoose/repositories/user.dynamoose.repository";
import { HttpError } from "../../../shared/errors/http-error";
import { th } from "zod/v4/locales";

const unityService = new UnityService(dynamooseUnityRepository, dynamooseAddressRepository, dynamooseUserRepository);

export async function create(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        if (!event.body) {
            throw new HttpError(400, "Unidade nao fornecida");
        }

        if (!event.requestContext.authorizer){
            throw new HttpError(401, "Não autorizado");
        }

        const body = JSON.parse(event.body!);
        const userSub = event.requestContext.authorizer.jwt.claims.sub;

        const response = await unityService.createUnity(body, userSub);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Unidade criada com sucesso", data: response }),
        };

    } catch (err: any) {
        return formatHttpErrorResponse(err, "Erro ao criar unidade");
    }
}