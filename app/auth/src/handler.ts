import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { AuthService } from "./service";
import { dynamooseUserRepository } from "../../../infra/dynamoose/repositories/user.dynamoose.repository";
import { dynamooseTeamRepository } from "../../../infra/dynamoose/repositories/team.dynamoose.repository";
import { HttpError } from "../../../shared/errors/http-error";
import { formatHttpErrorResponse } from "../../../shared/errors/format-http-error-response";

const authService = new AuthService(dynamooseUserRepository, dynamooseTeamRepository);

export async function signUp(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
   if (!event.body) {
      throw new HttpError(400, "Usuário nao fornecido");
    }

    const body = JSON.parse(event.body!);
    const response = await authService.signUp(body);

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (err) {
    return formatHttpErrorResponse(err, "Erro ao realizar cadastro");
  }
}

export async function confirmCode(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
   if (!event.body) {
      throw new HttpError(400, "Usuário nao fornecido");
    }

    const body = JSON.parse(event.body!);

    const response = await authService.confirmCode(body);
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (err) {
    return formatHttpErrorResponse(err, "Erro ao realizar cadastro");
  }
}

export async function signIn(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    if (!event.body) {
      throw new HttpError(400, "Usuário nao fornecido");
    }

    const body = JSON.parse(event.body);
    const response = await authService.signIn(body);

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };

  } catch (err) {
    return formatHttpErrorResponse(err, "Erro ao realizar login");
  }
}
