import rateLimit from "express-rate-limit";

import { config } from "../config/env.js";
import { ApiResponse } from "../utils/response.js";

export const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests, // 100 requisições por windowMs
  message: "Muitas requisições. Por favor, aguarde alguns minutos e tente novamente.",
  standardHeaders: true, // Retorna info no `RateLimit-*` headers
  legacyHeaders: false, // Desabilita `X-RateLimit-*` headers
  handler: (req, res) => {
    return ApiResponse.tooManyRequests(
      res,
      "Muitas requisições. Por favor, aguarde alguns minutos e tente novamente.",
    );
  },
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas por windowMs
  skipSuccessfulRequests: true, // Não conta requisições bem-sucedidas
  message: "Muitas tentativas de login. Por favor, aguarde 15 minutos.",
  handler: (req, res) => {
    return ApiResponse.tooManyRequests(
      res,
      "Muitas tentativas de login. Por favor, aguarde 15 minutos e tente novamente.",
    );
  },
});

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 100, // 100 registros por hora (aumentado para testes)
  message: "Muitas tentativas de registro. Por favor, aguarde uma hora.",
  handler: (req, res) => {
    return ApiResponse.tooManyRequests(
      res,
      "Muitas tentativas de registro. Por favor, aguarde uma hora e tente novamente.",
    );
  },
});

export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // 3 tentativas por hora
  message: "Muitas solicitações de reset de senha. Por favor, aguarde uma hora.",
  handler: (req, res) => {
    return ApiResponse.tooManyRequests(
      res,
      "Muitas solicitações de reset de senha. Por favor, aguarde uma hora.",
    );
  },
});
