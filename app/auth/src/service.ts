import z from "zod";
import {
  CognitoIdentityProviderClient,
  CognitoIdentityProviderClientConfig,
  SignUpCommand,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  AuthFlowType,
} from "@aws-sdk/client-cognito-identity-provider";
import { UserRepository } from "../../../domain/user/user.repository";
import { TeamRepository } from "../../../domain/team/team.repository";
import { User } from "../../../domain/user/user.entity";
import { UserRoles } from "../../../domain/types/UserRoles";
import { HttpError } from "../../../shared/errors/http-error";
import { mapToHttpError } from "../../../shared/errors/map-http-error";

const SignUpUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  name: z.string(),
  teamId: z.string(),
});

const SignInUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

const ConfirmCodeSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

const config: CognitoIdentityProviderClientConfig = {
  region: process.env.AWS_REGION || "us-east-1",
};
const client = new CognitoIdentityProviderClient(config);

export class AuthService {
  constructor(private readonly userRepository: UserRepository, private readonly teamRepository: TeamRepository) { }

  async signUp(userData: z.infer<typeof SignUpUserSchema>) {
    const validatedData = SignUpUserSchema.parse(userData);
    const team = await this.teamRepository.findById(validatedData.teamId);

    if (!team) {
      throw new HttpError(404, "Time não encontrado");
    }

    if (!process.env.COGNITO_CLIENT_ID) {
      throw new HttpError(500, "COGNITO_CLIENT_ID não configurado");
    }

    try {
      const input = new SignUpCommand({
        ClientId: process.env.COGNITO_CLIENT_ID!,
        Username: validatedData.email,
        Password: validatedData.password,
        UserAttributes: [{ Name: "email", Value: validatedData.email },],
      });

      const response = await client.send(input);

      if (!response.UserSub || response.UserConfirmed === undefined) {
        throw new HttpError(500, "Falha ao registrar usuário");
      }

      await this.userRepository.create(
        new User(
          response.UserSub,
          validatedData.email,
          validatedData.name,
          UserRoles.USER,
          validatedData.teamId,
        )
      );

      return {
        userSub: response.UserSub,
        userConfirmed: response.UserConfirmed,
        session: response.Session,
      };

    } catch (err: any) {
      return mapToHttpError(err, "registrar usuário");
    }
  }

  async confirmCode(codeData: z.infer<typeof ConfirmCodeSchema>) {
    const validatedData = ConfirmCodeSchema.parse(codeData);

    if (!process.env.COGNITO_CLIENT_ID || !process.env.COGNITO_USER_POOL_ID) {
      throw new HttpError(500, "Cognito env not configured");
    }

    const input = {
      ClientId: process.env.COGNITO_CLIENT_ID!,
      Username: validatedData.email,
      ConfirmationCode: validatedData.code,
    };

    try {
      const command = new ConfirmSignUpCommand(input);
      const response = await client.send(command);

      return {
        session: response.Session,
      };
    } catch (err: any) {
      return mapToHttpError(err, "confirmar código de verificação");
    }
  }

  async signIn(userData: z.infer<typeof SignInUserSchema>) {
    const validatedData = SignInUserSchema.parse(userData);

    if (!process.env.COGNITO_CLIENT_ID) {
      throw new HttpError(500, "COGNITO_CLIENT_ID não configurado");
    }

    const input = {
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      AuthParameters: {
        USERNAME: validatedData.email,
        PASSWORD: validatedData.password,
      },
      ClientId: process.env.COGNITO_CLIENT_ID!,
    };

    const command = new InitiateAuthCommand(input);

    try {
      const response = await client.send(command);

      return {
        authenticationResult: response.AuthenticationResult,
        session: response.Session,
      };

    } catch (err: any) {
      return mapToHttpError(err, "login");
    }
  }
}