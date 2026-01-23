import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ZodError } from "zod";
import { AuthService } from "./service";
import { dynamooseUserRepository } from "../../../infra/dynamoose/repositories/user.dynamoose.repository";
import { dynamooseTeamRepository } from "../../../infra/dynamoose/repositories/team.dynamoose.repository";

const authService = new AuthService(dynamooseUserRepository, dynamooseTeamRepository);

export async function signUp(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Must pass a user" }),
      };
    }

    const body = JSON.parse(event.body!);
    const response = await authService.signUp(body);

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (err: any) {
    console.error("Error in signUpUser handler:", err);

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

export async function confirmCode(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Must pass a user" }),
      };
    }

    const body = JSON.parse(event.body!);

    const response = await authService.confirmCode(body);
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (err: any) {
    console.error("Error in confirmCode handler:", err);

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

export async function signIn(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Must pass a user" }),
      };
    }

    const body = JSON.parse(event.body);
    const response = await authService.signIn(body);

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };

  } catch (err: any) {
    console.error("Error in signIn handler:", err);

    if (err instanceof ZodError) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Invalid input",
          errors: err.issues,
        }),
      };
    }

    if (
      err.message === "Email ou senha inválidos" ||
      err.message === "Usuário não encontrado"
    ) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: err.message }),
      };
    }

    if (err.message === "Usuário ainda não confirmado") {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: err.message }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal server error",
      }),
    };
  }
}
