import express from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import { ApiResponse } from "../utils/response.js";

const router = express.Router();

router.get("/me", AuthMiddleware.authenticate, async (req, res) => {
  return ApiResponse.success(res, { user: req.user }, "Usuário autenticado");
});

router.get("/verify", AuthMiddleware.authenticate, (req, res) => {
  return ApiResponse.success(res, null, "Token válido");
});

export default router;
