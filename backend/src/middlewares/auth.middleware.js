// ============================================================================
// AUTH MIDDLEWARE - Validação de Tokens Supabase
// ============================================================================

import { verifyUserToken, getUserProfile } from "../config/supabase.js";
import { ApiResponse } from "../utils/response.js";

export class AuthMiddleware {
  /**
   * Middleware principal de autenticação
   * Valida token Supabase e adiciona user ao req
   */
  static async authenticate(req, res, next) {
    try {
      // 1. Extrai o token do header
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return ApiResponse.unauthorized(
          res,
          "Token de autenticação não fornecido. Por favor, faça login.",
        );
      }

      // 2. Valida formato Bearer
      const parts = authHeader.split(" ");

      if (parts.length !== 2 || parts[0] !== "Bearer") {
        return ApiResponse.unauthorized(
          res,
          "Formato de token inválido. Use: Bearer <token>",
        );
      }

      const token = parts[1];

      // 3. Verifica token no Supabase
      const user = await verifyUserToken(token);

      // 4. Adiciona dados do usuário ao request
      req.user = {
        userId: user.id,
        email: user.email,
        emailConfirmed: user.email_confirmed_at !== null,
        metadata: user.user_metadata,
      };

      next();
    } catch (error) {
      console.error("❌ Erro na autenticação:", error.message);

      if (
        error.message.includes("expired") ||
        error.message.includes("expirado")
      ) {
        return ApiResponse.tokenExpired(res);
      }

      if (
        error.message.includes("invalid") ||
        error.message.includes("inválido")
      ) {
        return ApiResponse.tokenInvalid(res);
      }

      return ApiResponse.unauthorized(
        res,
        "Falha na autenticação. Por favor, faça login novamente.",
      );
    }
  }

  /**
   * Middleware opcional - permite acesso com ou sem autenticação
   * Útil para rotas que têm comportamento diferente para usuários logados
   */
  static async optionalAuth(req, res, next) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        req.user = null;
        return next();
      }

      const parts = authHeader.split(" ");

      if (parts.length === 2 && parts[0] === "Bearer") {
        const token = parts[1];
        const user = await verifyUserToken(token);

        req.user = {
          userId: user.id,
          email: user.email,
          emailConfirmed: user.email_confirmed_at !== null,
          metadata: user.user_metadata,
        };
      } else {
        req.user = null;
      }

      next();
    } catch (error) {
      // Em caso de erro, continua sem usuário
      req.user = null;
      next();
    }
  }

  /**
   * Middleware que requer email verificado
   * Use após authenticate()
   */
  static requireEmailVerified(req, res, next) {
    if (!req.user) {
      return ApiResponse.unauthorized(res, "Autenticação necessária.");
    }

    if (!req.user.emailConfirmed) {
      return ApiResponse.forbidden(
        res,
        "Por favor, confirme seu email antes de continuar.",
      );
    }

    next();
  }

  /**
   * Middleware que carrega perfil completo do usuário
   * Use após authenticate() quando precisar dos dados do perfil
   */
  static async loadProfile(req, res, next) {
    try {
      if (!req.user) {
        return next();
      }

      const profile = await getUserProfile(req.user.userId);
      req.user.profile = profile;

      next();
    } catch (error) {
      console.error("❌ Erro ao carregar perfil:", error.message);
      // Continua mesmo sem perfil
      req.user.profile = null;
      next();
    }
  }
}
