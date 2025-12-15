import z, { email } from "zod";
import {
  CognitoIdentityProviderClient,
  CognitoIdentityProviderClientConfig,
  SignUpCommand,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  AuthFlowType,
} from "@aws-sdk/client-cognito-identity-provider";

const SignUpUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

const SignInUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

const ConfirmCodeSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

// AWS Cognito Client Configuration
const config: CognitoIdentityProviderClientConfig = {
  region: process.env.AWS_REGION || "us-east-1",
};
const client = new CognitoIdentityProviderClient(config);

export async function signUpUserService(userData: z.infer<typeof SignUpUserSchema>) {
  const validatedData = SignUpUserSchema.parse(userData);

  if (!process.env.COGNITO_CLIENT_ID) {
    throw new Error("COGNITO_CLIENT_ID not configured");
  }

  const input = new SignUpCommand({
    ClientId: process.env.COGNITO_CLIENT_ID!,
    Username: validatedData.email,
    Password: validatedData.password,
    UserAttributes: [{ Name: "email", Value: validatedData.email },],
  });

  const response = await client.send(input);

  return {
    userSub: response.UserSub,
    userConfirmed: response.UserConfirmed,
    session: response.Session,
  };
}

export async function confirmCodeService(codeData: z.infer<typeof ConfirmCodeSchema>) {
  const validatedData = ConfirmCodeSchema.parse(codeData);

  if (!process.env.COGNITO_CLIENT_ID) {
    throw new Error("COGNITO_CLIENT_ID not configured");
  }

  const input = {
    ClientId: process.env.COGNITO_CLIENT_ID!,
    Username: validatedData.email,
    ConfirmationCode: validatedData.code,
  };

  const command = new ConfirmSignUpCommand(input);
  const response = await client.send(command);

  return {
    session: response.Session,
  };
}

export async function signInService(userData: z.infer<typeof SignInUserSchema>) {
  const validatedData = SignInUserSchema.parse(userData);

  if (!process.env.COGNITO_CLIENT_ID) {
    throw new Error("COGNITO_CLIENT_ID not configured");
  }

  const input = {
    AuthFlow: AuthFlowType.USER_AUTH,
    AuthParameters: {
      "USERNAME": validatedData.email,
      "PASSWORD": validatedData.password,
    },
    ClientId: process.env.COGNITO_CLIENT_ID!,
  };

  const command = new InitiateAuthCommand(input);
  const response = await client.send(command);

  return {
    authenticationResult: response.AuthenticationResult,
    session: response.Session,
  };
}

