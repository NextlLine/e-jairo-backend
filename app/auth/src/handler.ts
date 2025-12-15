import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { signUpUserService } from "./service";
import { ZodError } from "zod";

export async function signUpUser(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Must pass a user" }),
      };
    }

    const body = JSON.parse(event.body!);
    const response = await signUpUserService(body);

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
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
}
