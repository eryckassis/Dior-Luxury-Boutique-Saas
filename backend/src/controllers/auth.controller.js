import { AuthService } from "../services/auth.service.js";
import { ApiResponse } from "../utils/response.js";
import { CookieUtil } from "../utils/cookies.js";
import crypto from "crypto";
export class AuthController {
  static async register(req, res) {
    try {
      const { name, email, password } = req.body;
      const result = await AuthService.register({ name, email, password });

      if (result.session?.access_token) {
        CookieUtil.setAccessToken(res, result.session.access_token);
        CookieUtil.setRefreshToken(res, result.session.refresh_token);
        CookieUtil.setSupabaseSession(res, result.session);

        const csrfToken = crypto.randomBytes(32).toString("hex");
        CookieUtil.setCSRFToken(res, csrfToken);
      }

      const sanitizedResult = {
        user: result.user,
        message: "Conta criada com sucesso",
      };

      return ApiResponse.created(
        res,
        sanitizedResult,
        "Conta criada com sucesso! Bem vindo(a) ao Dior.",
      );
    } catch (error) {
      console.error(" Erro de registro:", error);

      if (error.message.includes("Já cadastrado")) {
        return ApiResponse.conflict(res, error.message);
      }
      return ApiResponse.internalError(
        res,
        "Erro ao criar conta. Tente Novamente.",
        error,
      );
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);

      if (result.session?.access_token) {
        CookieUtil.setAccessToken(res, result.session.access_token);
        CookieUtil.setRefreshToken(res, result.session.refresh_token);
        CookieUtil.setSupabaseSession(res, result.session);

        const csrfToken = crypto.randomBytes(32).toString("hex");
        CookieUtil.setCSRFToken(res, csrfToken);
      }

      const sanitizedResult = {
        user: result.user,
        message: "Login realizado com sucesso",
      };

      return ApiResponse.success(
        res,
        sanitizedResult,
        "Login realizado com sucesso! Bem vindo(a) de volta.",
      );
    } catch (error) {
      console.error(" Erro no login:", error);

      if (
        error.message.includes("incorretos") ||
        error.message.includes("tentativa")
      ) {
        return ApiResponse.unauthorized(res, error.message);
      }
      if (error.message.includes("bloqueada")) {
        return ApiResponse.accountLocked(res);
      }
      if (error.message.includes("verifique seu e-mail")) {
        return ApiResponse.emailNotVerified(res, error.message);
      }

      return ApiResponse.internalError(
        res,
        "Erro ao fazer login. Tente novamente.",
        error,
      );
    }
  }

  static async logout(req, res) {
    try {
      const userId = req.user.userId;
      await AuthService.logout(userId);

      CookieUtil.clearAuthCookies(res);

      return ApiResponse.success(
        res,
        null,
        "logout realizado com sucesso. Até logo!",
      );
    } catch (error) {
      console.error("Erro no logout:", error);
      return ApiResponse.internalError(res, "Erro ao fazer Logout.", error);
    }
  }

  static async refreshToken(req, res) {
    try {
      const refreshToken = req.cookies?.refresh_token || req.body.refreshToken;
      if (!refreshToken) {
        return ApiResponse.unauthorized(
          res,
          "Refresh token não fornecido. faça login novamente.",
        );
      }

      const result = await AuthService.refreshToken(refreshToken);

      if (result.session?.access_token) {
        CookieUtil.setAccessToken(res, result.session.access_token);
        CookieUtil.setRefreshToken(res, result.session.refresh_token);
        CookieUtil.setSupabaseSession(res, result.session);
      }

      return ApiResponse.success(res, {
        message: "Token atualizado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao atualizar token:", error);

      CookieUtil.clearAuthCookies(res);

      if (
        error.message.includes("inválido") ||
        error.message.includes("expirado")
      ) {
        return ApiResponse.unauthorized(res, error.message);
      }

      return ApiResponse.internalError(res, "Erro ao atualizar token", error);
    }
  }

  static async verifyEmail(req, res) {
    try {
      const { token } = req.params;
      const result = await AuthService.verifyEmail(token);
      return ApiResponse.success(res, null, result.message);
    } catch (error) {
      console.error("Erro ao verificar email:", error);
      if (
        error.message.includes("inválido") ||
        error.message.includes("expirado")
      ) {
        return ApiResponse.badRequest(res, error.message);
      }
      return ApiResponse.internalError(res, "Erro ao verificar e-mail.", error);
    }
  }

  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const result = await AuthService.forgotPassword(email);
      return ApiResponse.success(res, null, result.message);
    } catch (error) {
      console.error("Erro ao solicitar reset de senha:", error);
      return ApiResponse.internalError(
        res,
        "Erro ao processar solicitação",
        error,
      );
    }
  }

  static async resetPassword(req, res) {
    try {
      const { token, password } = req.body;
      const result = await AuthService.resetPassword(token, password);
      return ApiResponse.success(res, null, result.message);
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      if (
        error.message.includes("inválido") ||
        error.message.includes("Expirado")
      ) {
        return ApiResponse.badRequest(res, error.message);
      }
      return ApiResponse.internalError(res, "Erro ao  redefinir senha", error);
    }
  }

  static async getMe(req, res) {
    try {
      const userId = req.user.userId;
      const user = await AuthService.getUserById(userId);
      return ApiResponse.success(res, { user });
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      return ApiResponse.internalError(res, "Erro ao buscar usuário", error);
    }
  }
}
