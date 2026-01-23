import express from "express";
import { UserController } from "../controllers/user.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import { ValidationMiddleware } from "../middlewares/validation.middleware.js";

const router = express.Router();

router.get("/profile", AuthMiddleware.authenticate, UserController.getProfile);

router.put(
  "/profile",
  AuthMiddleware.authenticate,
  ValidationMiddleware.validateProfileUpdate,
  UserController.updateProfile,
);

export default router;
