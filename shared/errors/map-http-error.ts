import { HttpError } from "./http-error";

export function mapToHttpError(err: unknown, action: string): never {
  const error = err as any;

  const errorMap: Record<string, () => never> = {
    // Authentication Errors
    NotAuthorizedException: () => {
      throw new HttpError(401, "Email ou senha inválidos");
    },

    UserNotFoundException: () => {
      throw new HttpError(404, "Usuário não encontrado");
    },

    UserNotConfirmedException: () => {
      throw new HttpError(403, "Usuário ainda não confirmou a conta");
    },

    PasswordResetRequiredException: () => {
      throw new HttpError(403, "É necessário redefinir a senha");
    },

    // Registration Errors
    UsernameExistsException: () => {
      throw new HttpError(409, "Já existe uma conta com este email");
    },

    InvalidPasswordException: () => {
      throw new HttpError(400, "A senha não atende aos requisitos de segurança");
    },

    InvalidParameterException: () => {
      throw new HttpError(400, "Dados inválidos fornecidos");
    },

    // Confirmation Errors
    CodeMismatchException: () => {
      throw new HttpError(400, "Código de confirmação inválido");
    },

    ExpiredCodeException: () => {
      throw new HttpError(400, "O código de confirmação expirou");
    },

    LimitExceededException: () => {
      throw new HttpError(429, "Muitas tentativas. Tente novamente mais tarde");
    },

    TooManyRequestsException: () => {
      throw new HttpError(429, "Muitas requisições. Aguarde e tente novamente");
    },

    // Service Errors
    ResourceNotFoundException: () => {
      throw new HttpError(500, "Serviço não encontrado");
    },

    InternalErrorException: () => {
      throw new HttpError(500, "Erro interno");
    },

    // This one is way too generic and can lead to confusion, so it's better throw at service level (just a reminder)
    // TransactionCanceledException: () => {
    //   throw new HttpError(409, "Conflito ao salvar dados e " + action);
    // },

    ProvisionedThroughputExceededException: () => {
      throw new HttpError(503, "Banco de dados temporariamente sobrecarregado");
    },

    ThrottlingException: () => {
      throw new HttpError(429, "Muitas operações no banco. Aguarde e tente novamente");
    },

    ItemCollectionSizeLimitExceededException: () => {
      throw new HttpError(413, "Limite de dados excedido para esta coleção");
    },

    InternalServerError: () => {
      throw new HttpError(500, "Erro interno no banco de dados");
    },

    ConditionalCheckFailedException: () => {
      throw new HttpError(409, "Condição de escrita falhou no banco de dados");
    }
  };

  if (error?.name && errorMap[error.name]) {
    errorMap[error.name]();
  }

  console.error("Unmapped error:", err);
  throw new HttpError(500, `Erro ao realizar ${action}`);
}
