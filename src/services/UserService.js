// ============================================================================
// USER SERVICE - Gerenciamento de Dados do Usuário
// ============================================================================

import { authService } from "./AuthService";

class UserService {
  constructor() {
    this.API_URL = "http://localhost:5000/api/user";
  }

  // busca dados do perfil do usuario autenticado

  async getProfile() {
    try {
      const token = authService.getAccessToken();

      if (!token) {
        throw new Error("Usuário não autenticado");
      }
      const response = await fetch(`${this.API_URL}/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          await authService.refreshAccessToken();
          return this.getProfile();
        }
        throw new Error(data.message || "Erro ao buscar dados do perfil");
      }

      return data.data.user;
    } catch (error) {
      console.error("X Erro ao buscar perfil:", error);
      throw error;
    }
  }

  // atualiza dados do perfil do usuario

  async updateProfile(profileData) {
    try {
      const token = authService.getAccessToken();

      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      const response = await fetch(`${this.API_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          await authService.refreshAccessToken();
          return this.updateProfile(profileData);
        }
        throw new Error(
          data.message || "Erro nao foi possivel atualizar o perfil"
        );
      }
      // atualiza dados do usuario via localStorage
      authService.setUser(data.data.user);
      return data.data.user;
    } catch (error) {
      console.error("X Erro ao atualizar o perfil:", error);
      throw error;
    }
  }

  // formatação do cpf para exibição
  formatCPF(cpf) {
    if (!cpf) return "";
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  // remove formatacao do cpf
  unformatCPF(cpf) {
    if (!cpf) return "";
    return cpf.replace(/\D/g, "");
  }

  // formata telefone para exibição

  formatPhone(phone) {
    if (!phone) return "";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return phone;
  }

  // formata data para exibição (dd/mm/aa)

  formatDate(date) {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("pt-BR");
  }

  // formata data para input (yyy/mm/ddd)

  formatDateForInput(date) {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  }
}

export const userService = new UserService();
