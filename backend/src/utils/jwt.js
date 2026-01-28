import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

export class JwtUtil {
  static generateAccessToken(payload) {
    try {
      return jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
        issuer: "dior-api",
        audience: "dior-client",
      });
    } catch (error) {
      console.error("X Erro ao gerar access token:", error);
      throw new Error("Falha ao gerar token de autenticação");
    }
  }

  static generateRefreshToken(payload) {
    try {
      return jwt.sign(payload, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshExpiresIn,
        issuer: "dior-api",
        audience: "dior-client",
      });
    } catch (error) {
      console.error(" Erro ao gerar refresh token:", error);
      throw new Error("Falha ao gerar token de atualização");
    }
  }

  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, config.jwt.secret, {
        issuer: "dior-api",
        audience: "dior-client",
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new Error("Token expirado. Por favor, faça login novamente.");
      }
      if (error.name === "JsonWebTokenError") {
        throw new Error("Token inválido. Autenticação necessária.");
      }
      if (error.name === "NotBeforeError") {
        throw new Error("Token ainda não é válido.");
      }
      throw new Error("Falha na verificação do token");
    }
  }

  static verifyRefreshToken(token) {
    try {
      return jwt.verify(token, config.jwt.refreshSecret, {
        issuer: "dior-api",
        audience: "dior-client",
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new Error("Refresh token expirado. Por favor, faça login novamente.");
      }
      if (error.name === "JsonWebTokenError") {
        throw new Error("Refresh token inválido.");
      }
      throw new Error("Falha na verificação do refresh token");
    }
  }

  static generateTokenPair(userId, email) {
    const payload = {
      userId,
      email,
      type: "user",
    };

    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
      expiresIn: config.jwt.expiresIn,
    };
  }

  static decode(token) {
    try {
      return jwt.decode(token, { complete: true });
    } catch (error) {
      throw new Error("Falha ao decodificar token");
    }
  }
}
