import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatHttpErrorResponse } from "../../../shared/errors/format-http-error-response";
import { HttpError } from "../../../shared/errors/http-error";
import { AdvertisementService } from "./service";
import { dynamooseAdvertisementRepository } from "../../../infra/dynamoose/repositories/advertisement.dynamoose.repository";
import { userService } from "../../user/src/handler";

const advertisementService = new AdvertisementService(dynamooseAdvertisementRepository)

export async function create(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        if (!event.body) {
            throw new HttpError(400, "Dados do anúncio não fornecidos");
        }

        if (!event.requestContext.authorizer) {
            throw new HttpError(401, "Não autorizado");
        }

        const userSub = event.requestContext.authorizer.jwt.claims.sub;

        const user = await userService.getUserById(userSub);
        const teamId = user?.teamId;

        if (!teamId) {
            throw new HttpError(404, "Time do usuário não encontrado");
        }

        const body = JSON.parse(event.body);

        const data = {
            message: body.message as string,
            teamId: teamId as string,
        }

        console.log("Creating advertisement with data:", data);

        await advertisementService.create(data);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Anúncio criado com sucesso" }),
        };
    } catch (err) {
        return formatHttpErrorResponse(err, "Erro ao criar anúncio");
    }
}

export async function listByTeam(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        if (!event.requestContext.authorizer) {
            throw new HttpError(401, "Não autorizado");
        }

        const userSub = event.requestContext.authorizer.jwt.claims.sub;

        const user = await userService.getUserById(userSub);
        const teamId = user?.teamId;

        if (!teamId) {
            throw new HttpError(404, "Time do usuário não encontrado");
        }

        const advertisements = await advertisementService.listByTeam(teamId);

        return {
            statusCode: 200,
            body: JSON.stringify(advertisements),
        };
    } catch (err) {
        return formatHttpErrorResponse(err, "Erro ao buscar anúncios por time");
    }
}