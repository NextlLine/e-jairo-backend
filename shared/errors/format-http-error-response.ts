import { APIGatewayProxyResult } from "aws-lambda";
import { ZodError } from "zod";
import { HttpError } from "./http-error";

export function formatHttpErrorResponse(err: any, fallbackMessage = "Erro interno do servidor"): APIGatewayProxyResult {
  console.error("HTTP Error:", err);

  if (err instanceof ZodError) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Erro de validação",
        errors: err.issues,
      }),
    };
  }

  if (err instanceof HttpError) {
    return {
      statusCode: err.statusCode,
      body: JSON.stringify({ message: err.message }),
    };
  }

  return {
    statusCode: 500,
    body: JSON.stringify({ message: fallbackMessage }),
  };
} 
