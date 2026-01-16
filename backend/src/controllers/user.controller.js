import { UserService } from "../services/user.service";
import { ApiResponse } from "../utils/response";

export class UserController {
  static async getProfile(req, res) {
    try {
      const userId = req.user.userId;
      const user = await UserService.getProfile(userId);

      return ApiResponse.success(
        res,
        { user },
        "Dados do perfil obtidos com sucesso"
      );
    } catch (error) {
      console.error("X erro ao buscar perfil:", error);

      if (error.message.includes("não encontrado")) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.internalError(
        res,
        "Erro ao buscar dados do perfil",
        error
      );
    }
  }

  // PUT atualiza os dados do perfil do usuario autenticado

  static async updateProfile(req, res) {
    try {
      const userId = req.user.userId;
      const updateData = req.body;

      const updateUser = await UserService.updateProfile(userId, updateData);
      return ApiResponse.success(
        res,
        { user: updateUser },
        "Dados atualizados com sucesso!"
      );
    } catch (error) {
      console.error("X Erro ao atualizar perfil:", error);

      if (error.message.includes("não encontrado")) {
        return ApiResponse.notFound(res, error.message);
      }
      if (error.message.includes("CPF já cadastrado")) {
        return ApiResponse.conflict(res, error.message);
      }

      return ApiResponse.internalError(error);
    }
  }
}
