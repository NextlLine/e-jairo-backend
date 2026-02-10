import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { dynamooseUserRepository } from "../../../infra/dynamoose/repositories/user.dynamoose.repository";
import { UserService } from "./service";
import { HttpError } from "../../../shared/errors/http-error";
import { formatHttpErrorResponse } from "../../../shared/errors/format-http-error-response";

export const userService = new UserService(dynamooseUserRepository);

export async function get(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        if (!event.requestContext.authorizer) {
            throw new HttpError(401, "Não autorizado");
        }

        const userSub = event.requestContext.authorizer.jwt.claims.sub;

        const user = await userService.getUserById(userSub);

        return {
            statusCode: 200,
            body: JSON.stringify(user),
        };
    } catch (err) {
        return formatHttpErrorResponse(err, "Erro ao buscar usuário");
    }
}