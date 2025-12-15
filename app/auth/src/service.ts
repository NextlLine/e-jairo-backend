import z from "zod";
import {
  CognitoIdentityProviderClient,
  CognitoIdentityProviderClientConfig,
  SignUpCommand
} from "@aws-sdk/client-cognito-identity-provider";


const config: CognitoIdentityProviderClientConfig = {
  region: process.env.AWS_REGION || "us-east-1",

};
const client = new CognitoIdentityProviderClient(config);

const SignUpUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export async function signUpUserService(userData: z.infer<typeof SignUpUserSchema>) {
  const validatedData = SignUpUserSchema.parse(userData);

  if (!process.env.COGNITO_CLIENT_ID) {
    throw new Error("COGNITO_CLIENT_ID not configured");
  }

  const signUpCommand = new SignUpCommand({
    ClientId: process.env.COGNITO_CLIENT_ID!,
    Username: validatedData.email,
    Password: validatedData.password,
    UserAttributes: [{ Name: "email", Value: validatedData.email },],
  });

  const response = await client.send(signUpCommand);

  return {
    userSub: response.UserSub,
    userConfirmed: response.UserConfirmed,
  };

}