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

router.get("/session", (req, res) => {
  const session = req.cookies?.sb_session;

  if (!session) {
    return res.json({ session: null });
  }

  try {
    const parsed = JSON.parse(session);
    return res.json({ session: parsed });
  } catch {
    return res.json({ session: null });
  }
});

export default router;
