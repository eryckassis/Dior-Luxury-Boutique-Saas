import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import { validateUpdateProfile } from "../validators/user.validator.js";

const router = Router();

router.use(AuthMiddleware.authenticate);

//GET aqui obtem dados do perfil do usuario autenticado
router.get("/profile", UserController.getProfile);

//PUT atualiza dados do perfil do usuario autenticado
router.put("/profile", validateUpdateProfile, UserController.updateProfile);

export default router;
