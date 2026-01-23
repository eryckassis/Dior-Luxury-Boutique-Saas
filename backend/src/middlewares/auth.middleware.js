import { verifyUserToken, getUserProfile } from "../config/supabase.js";
import { ApiResponse } from "../utils/response.js";
import { CookieUtil } from "../utils/cookies.js";

export class AuthMiddleware {
  static async authenticate(req, res, next) {
    try {
      const token = CookieUtil.getAccessToken(req);

      if (!token) {
        return ApiResponse.unauthorized(
          res,
          "Token de autenticação não fornecido. Por favor, faça login.",
        );
      }

      const user = await verifyUserToken(token);

      req.user = {
        userId: user.id,
        email: user.email,
        emailConfirmed: user.email_confirmed_at !== null,
        metadata: user.user_metadata,
      };

      next();
    } catch (error) {
      console.error(" Erro na autenticação:", error.message);

      CookieUtil.clearAuthCookies(res);

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

  static async optionalAuth(req, res, next) {
    try {
      const token = CookieUtil.getAccessToken(req);

      if (!token) {
        req.user = null;
        return next();
      }

      const user = await verifyUserToken(token);
      req.user = {
        userId: user.id,
        email: user.email,
        emailConfirmed: user.email_confirmed_at !== null,
        metadata: user.user_metadata,
      };

      next();
    } catch (error) {
      req.user = null;
      next();
    }
  }

  static async validateCSRF(req, res, next) {
    try {
      if (req.method === "GET" || req.method === "OPTIONS") {
        return next();
      }

      CookieUtil.validateCSRF(req);
      next();
    } catch (error) {
      console.error(" CSRF validations failed:", error.message);
      return ApiResponse.forbidden(
        res,
        "Requisição inválida. Tente Novamente.",
      );
    }
  }

  static requireEmailVerified(req, res, next) {
    if (!req.user?.emailConfirmed) {
      return ApiResponse.emailNotVerified(
        res,
        "Por favor, verifique seu email antes de continuar",
      );
    }
    next();
  }

  static authorize(...allowedRoles) {
    return (req, res, next) => {
      const userRole = req.user?.metadata?.role || "user";

      if (!allowedRoles.includes(userRole)) {
        return ApiResponse.forbidden(
          res,
          "Voce nao tem permissai para acessar este recurso",
        );
      }

      next();
    };
  }

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
      req.user.profile = null;
      next();
    }
  }
}
