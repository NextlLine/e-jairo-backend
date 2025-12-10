import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import httpJsonBodyParser from "@middy/http-json-body-parser";

import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "OK" }),
  };
};

export const main = middy(handler)
  .use(httpJsonBodyParser())
  .use(httpErrorHandler());
