import { ApiResponse } from "../utils/response.js";

export class ErrorMiddleware {
  static handleError(err, req, res, next) {
    console.error("Erro não tratado:", err);

    if (err.code && err.code.startsWith("P")) {
      return ErrorMiddleware.handlePrismaError(err, res);
    }

    if (err.name === "ValidationError") {
      return ApiResponse.validationError(
        res,
        err.details,
        "Erro de validação. Verifique os dados Enviados.",
      );
    }

    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      return ApiResponse.badRequest(res, "JSON inválido. Verifique a sintaxe da requisição.");
    }

    return ApiResponse.internalError(
      res,
      "Ocorreu um erro inesperado. Nossa equipe foi notificada",
      process.env.NODE_ENV === "development" ? err : null,
    );
  }

  static handlePrismaError(err, res) {
    switch (err.code) {
      case "P2002":
        const field = err.meta?.target?.[0] || "campo";
        return ApiResponse.conflict(
          res,
          `${field.charAt(0).toUpperCase() + field.slice(1)} já está em uso.`,
        );

      case "P2025":
        return ApiResponse.notFound(res, "Registro não encontrado");

      case "P2003":
        return ApiResponse.badRequest(res, "Operação inválida. Registro relacionado não existe.");

      case "P2011":
        const nullField = err.meta?.column_name || "campo obrigatório";
        return ApiResponse.badRequest(res, `${nullField} é obrigatorio e não pode ser nulo.`);

      case "P2014":
        return ApiResponse.badRequest(res, "ID invalido fornecido");

      default:
        console.error("Erro Prisma não mapeado:", err.code);
        return ApiResponse.internalError(res, "Erro no banco de dados. Tente novamente.");
    }
  }

  /**
   * Handler para rotas não encontradas (404)
   */
  static handleNotFound(req, res) {
    return ApiResponse.notFound(res, `Rota não encontrada: ${req.method} ${req.path}`);
  }
}
