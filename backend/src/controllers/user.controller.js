import { UserService } from "../services/user.service.js";
import { ApiResponse } from "../utils/response.js";

export class UserController {
  /**
   * GET /api/user/profile
   */
  static async getProfile(req, res) {
    try {
      const userId = req.user.userId;
      const profile = await UserService.getProfile(userId);

      return ApiResponse.success(
        res,
        { user: profile },
        "Dados do perfil obtidos com sucesso",
      );
    } catch (error) {
      console.error("❌ Erro ao buscar perfil:", error);

      if (error.message.includes("não encontrado")) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.internalError(
        res,
        "Erro ao buscar dados do perfil",
        error,
      );
    }
  }

  /**
   * PUT /api/user/profile
   */
  static async updateProfile(req, res) {
    try {
      const userId = req.user.userId;
      const updateData = req.body;

      const updatedUser = await UserService.updateProfile(userId, updateData);

      return ApiResponse.success(
        res,
        { user: updatedUser },
        "Dados atualizados com sucesso!",
      );
    } catch (error) {
      console.error("❌ Erro ao atualizar perfil:", error);

      if (error.message.includes("não encontrado")) {
        return ApiResponse.notFound(res, error.message);
      }
      if (error.message.includes("CPF já cadastrado")) {
        return ApiResponse.conflict(res, error.message);
      }

      return ApiResponse.internalError(res, "Erro ao atualizar perfil", error);
    }
  }
}
