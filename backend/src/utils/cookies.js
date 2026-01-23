import { config } from "../config/env.js";

export class CookieUtil {
  static getCookieConfig(options = {}) {
    const isProduction = config.nodeEnv === "production";

    return {
      httpOnly: options.httpOnly !== false,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      path: options.path || "/",
      maxAge: options.maxAge || 7 * 24 * 60 * 60 * 1000,
      domain: options.domain || undefined,
      ...options,
    };
  }

  static setAccessToken(res, token) {
    const config = this.getCookieConfig({
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
    });

    res.cookie("access_token", token, config);
  }

  static setRefreshToken(res, token) {
    const config = this.getCookieConfig({
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      path: "/api/auth",
    });

    res.cookie("refresh_token", token, config);
  }

  static async setSupabaseSession(res, session) {
    const config = this.getCookieConfig({
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
    });

    res.cookie("sb_session", JSON.stringify(session), config);
  }

  static setCSRFToken(res, token) {
    const config = this.getCookieConfig({
      httpOnly: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie("csrf_token", token, config);
  }

  static clearAuthCookies(res) {
    const cookieOptions = {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: config.nodeEnv === "production" ? "strict" : "lax",
      path: "/",
    };

    res.clearCookie("access_token", cookieOptions);
    res.clearCookie("refresh_token", { ...cookieOptions, path: "/api/auth" });
    res.clearCookie("sb_session", cookieOptions);
    res.clearCookie("csrf_token", { ...cookieOptions, httpOnly: false });
  }

  static getAccessToken(req) {
    return req.cookies?.access_token || this.extractBearerToken(req);
  }

  static extractBearerToken(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;

    const parts = authHeader.split(" ");

    if (parts.length === 2 && parts[0] === "Bearer") {
      return parts[1];
    }

    return null;
  }

  static validateCSRF(req) {
    const cookieToken = req.cookies?.csrf_token;
    const headerToken = req.headers["x-csrf-token"];

    if (!cookieToken || !headerToken) {
      throw new Error("CSRF token ausente");
    }

    if (cookieToken !== headerToken) {
      throw new Error("CSRF token inválido");
    }

    return true;
  }
}
