export class ApiResponse {
  static success(
    res,
    data = null,
    message = "Operação realizada com sucesso",
    statusCode = 200,
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  static error(
    res,
    message = "Ocorreu um erro",
    statusCode = 500,
    errorCode = null,
    errors = null,
  ) {
    const response = {
      success: false,
      message,
      errorCode: errorCode || `ERR_${statusCode}`,
      timestamp: new Date().toISOString(),
    };

    if (errors) {
      response.errors = Array.isArray(errors) ? errors : [errors];
    }

    if (process.env.NODE_ENV === "development" && errors?.stack) {
      response.stack = errors.stack;
    }

    return res.status(statusCode).json(response);
  }

  static created(res, data, message = "Recurso criado com sucesso") {
    return this.success(res, data, message, 201);
  }

  static noContent(res) {
    return res.status(204).send();
  }

  static badRequest(res, message = "Requisição inválida", errors = null) {
    return this.error(res, message, 400, "ERR_BAD_REQUEST", errors);
  }

  static unauthorized(
    res,
    message = "Autenticação necessária. Por favor, faça login.",
  ) {
    return this.error(res, message, 401, "ERR_UNAUTHORIZED");
  }

  static forbidden(
    res,
    message = "Você não tem permissão para acessar este recurso.",
  ) {
    return this.error(res, message, 403, "ERR_FORBIDDEN");
  }

  static notFound(res, message = "Recurso não encontrado.", resource = null) {
    const errorMessage = resource ? `${resource} não encontrado(a).` : message;
    return this.error(res, errorMessage, 404, "ERR_NOT_FOUND");
  }

  static conflict(res, message = "Este recurso já existe.", field = null) {
    const errorMessage = field ? `${field} já está em uso.` : message;
    return this.error(res, errorMessage, 409, "ERR_CONFLICT");
  }

  static validationError(
    res,
    errors,
    message = "Erro de validação. Verifique os dados enviados.",
  ) {
    return this.error(res, message, 422, "ERR_VALIDATION", errors);
  }

  static tooManyRequests(
    res,
    message = "Muitas tentativas. Por favor, aguarde alguns minutos e tente novamente.",
  ) {
    return this.error(res, message, 429, "ERR_RATE_LIMIT");
  }

  static internalError(
    res,
    message = "Erro interno do servidor. Nossa equipe foi notificada.",
    error = null,
  ) {
    if (error) {
      console.error("X Internal Server Error:", error);
    }

    return this.error(
      res,
      message,
      500,
      "ERR_INTERNAL_SERVER",
      process.env.NODE_ENV === "development" ? error : null,
    );
  }

  static serviceUnavailable(
    res,
    message = "Serviço temporariamente indisponível. Tente novamente em instantes.",
  ) {
    return this.error(res, message, 503, "ERR_SERVICE_UNAVAILABLE");
  }

  static tokenExpired(
    res,
    message = "Sua sessão expirou. Por favor, faça login novamente.",
  ) {
    return this.error(res, message, 401, "ERR_TOKEN_EXPIRED");
  }

  static tokenInvalid(res, message = "Token de autenticação inválido.") {
    return this.error(res, message, 401, "ERR_TOKEN_INVALID");
  }

  static invalidCredentials(res, message = "E-mail ou senha incorretos.") {
    return this.error(res, message, 401, "ERR_INVALID_CREDENTIALS");
  }

  static accountLocked(res, unlockTime = null) {
    const message = unlockTime
      ? `Conta temporariamente bloqueada devido a múltiplas tentativas de login. Tente novamente após ${unlockTime}.`
      : "Conta temporariamente bloqueada. Entre em contato com o suporte.";

    return this.error(res, message, 423, "ERR_ACCOUNT_LOCKED");
  }

  static emailNotVerified(
    res,
    message = "Por favor, verifique seu e-mail antes de fazer login.",
  ) {
    return this.error(res, message, 403, "ERR_EMAIL_NOT_VERIFIED");
  }
}
