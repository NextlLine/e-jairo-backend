import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { helloWorld } from "./service";

export async function testHelloWorld(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    const message = await helloWorld();
    return {
      statusCode: 200,
      body: JSON.stringify({ message }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : String(error),
      }),
    };
  }
}