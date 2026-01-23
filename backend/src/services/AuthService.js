// ============================================================================
// AUTH SERVICE - Gerenciamento de Autenticação com Supabase
// ============================================================================

import { supabase } from "./supabaseClient.js";

class AuthService {
  constructor() {
    this.listeners = [];
    this.currentUser = null;
    this.currentSession = null;

    // Escuta mudanças de autenticação do Supabase
    this.initAuthListener();
  }

  // ========================================================================
  // INICIALIZAÇÃO - Listener de Auth State
  // ========================================================================

  initAuthListener() {
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔐 Auth Event:", event);

      this.currentSession = session;
      this.currentUser = session?.user || null;

      // Eventos específicos
      switch (event) {
        case "SIGNED_IN":
          console.log("✅ Usuário logado:", this.currentUser?.email);
          break;
        case "SIGNED_OUT":
          console.log("👋 Usuário deslogado");
          break;
        case "TOKEN_REFRESHED":
          console.log("🔄 Token renovado automaticamente");
          break;
        case "USER_UPDATED":
          console.log("📝 Dados do usuário atualizados");
          break;
      }

      // Notifica todos os listeners
      this.notifyListeners();

      // Dispara evento de sessão expirada se necessário
      if (event === "SIGNED_OUT" && !this._manualLogout) {
        window.dispatchEvent(new CustomEvent("session-expired"));
      }
      this._manualLogout = false;
    });
  }

  // ========================================================================
  // AUTENTICAÇÃO
  // ========================================================================

  /**
   * Registra novo usuário
   * @param {Object} userData - {name, email, password}
   * @returns {Promise<Object>}
   */
  async register({ name, email, password }) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name, // Metadata que será usado no trigger para criar profile
          },
          emailRedirectTo: `${window.location.origin}/verify-email`,
        },
      });

      if (error) {
        // Mapeia erros do Supabase para mensagens amigáveis
        if (error.message.includes("already registered")) {
          throw new Error(
            "Email já está cadastrado. Por favor, faça login ou use outro email.",
          );
        }
        throw new Error(error.message);
      }

      // Supabase pode retornar user mesmo sem confirmar email (depende das configurações)
      return {
        success: true,
        message:
          "Conta criada com sucesso! Verifique seu email para confirmar.",
        user: data.user,
        session: data.session,
      };
    } catch (error) {
      console.error("❌ Erro no registro:", error);
      throw error;
    }
  }

  /**
   * Faz login do usuário
   * @param {Object} credentials - {email, password}
   * @returns {Promise<Object>}
   */
  async login({ email, password }) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Mapeia erros para mensagens amigáveis em português
        if (error.message.includes("Invalid login credentials")) {
          throw new Error("Email ou senha incorretos.");
        }
        if (error.message.includes("Email not confirmed")) {
          throw new Error(
            "Por favor, confirme seu email antes de fazer login.",
          );
        }
        throw new Error(error.message);
      }

      // Busca perfil do usuário
      const profile = await this.getProfile();

      return {
        success: true,
        message: "Login realizado com sucesso!",
        user: {
          ...data.user,
          ...profile,
        },
        session: data.session,
      };
    } catch (error) {
      console.error("❌ Erro no login:", error);
      throw error;
    }
  }

  /**
   * Faz logout do usuário
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      this._manualLogout = true; // Flag para não disparar session-expired
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, message: "Logout realizado com sucesso!" };
    } catch (error) {
      console.error("❌ Erro no logout:", error);
      throw error;
    }
  }

  /**
   * Recuperação de senha
   * @param {string} email
   * @returns {Promise<Object>}
   */
  async forgotPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        message:
          "Se o email existir, você receberá instruções para redefinir a senha.",
      };
    } catch (error) {
      console.error("❌ Erro na recuperação de senha:", error);
      throw error;
    }
  }

  /**
   * Reset de senha com token (usuário clicou no link do email)
   * @param {string} newPassword
   * @returns {Promise<Object>}
   */
  async resetPassword(newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        message: "Senha redefinida com sucesso! Você já pode fazer login.",
      };
    } catch (error) {
      console.error("❌ Erro ao redefinir senha:", error);
      throw error;
    }
  }

  // ========================================================================
  // PERFIL DO USUÁRIO
  // ========================================================================

  /**
   * Busca perfil do usuário na tabela profiles
   * @returns {Promise<Object|null>}
   */
  async getProfile() {
    try {
      const user = await this.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = not found
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error("❌ Erro ao buscar perfil:", error);
      throw error;
    }
  }

  /**
   * Atualiza perfil do usuário
   * @param {Object} profileData
   * @returns {Promise<Object>}
   */
  async updateProfile(profileData) {
    try {
      const user = await this.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("profiles")
        .update(profileData)
        .eq("id", user.id)
        .select()
        .single();

      if (error) {
        if (
          error.message.includes("duplicate key") &&
          error.message.includes("cpf")
        ) {
          throw new Error("CPF já cadastrado em outra conta");
        }
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error("❌ Erro ao atualizar perfil:", error);
      throw error;
    }
  }

  // ========================================================================
  // GETTERS DE SESSÃO
  // ========================================================================

  /**
   * Obtém usuário atual
   * @returns {Promise<Object|null>}
   */
  async getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  }

  /**
   * Obtém sessão atual
   * @returns {Promise<Object|null>}
   */
  async getSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  }

  /**
   * Obtém access token atual
   * @returns {Promise<string|null>}
   */
  async getAccessToken() {
    const session = await this.getSession();
    return session?.access_token || null;
  }

  /**
   * Verifica se está autenticado (síncrono, usa cache)
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!this.currentSession;
  }

  /**
   * Obtém usuário do cache (síncrono)
   * @returns {Object|null}
   */
  getCachedUser() {
    return this.currentUser;
  }

  /**
   * Verifica autenticação e retorna status
   * @returns {Promise<boolean>}
   */
  async checkAuth() {
    try {
      const session = await this.getSession();
      return !!session;
    } catch (error) {
      return false;
    }
  }

  // ========================================================================
  // LISTENERS (Observer Pattern) - Mantém compatibilidade
  // ========================================================================

  addListener(callback) {
    this.listeners.push(callback);
    // Notifica imediatamente com estado atual
    callback({
      user: this.currentUser,
      isAuthenticated: this.isAuthenticated(),
    });
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter((listener) => listener !== callback);
  }

  notifyListeners() {
    const user = this.currentUser;
    const isAuthenticated = this.isAuthenticated();
    this.listeners.forEach((callback) => callback({ user, isAuthenticated }));
  }

  // ========================================================================
  // MÉTODOS DE COMPATIBILIDADE (para transição gradual)
  // ========================================================================

  /**
   * @deprecated Use getProfile() ao invés
   */
  getStoredUser() {
    console.warn("⚠️ getStoredUser() está deprecated. Use getProfile()");
    return this.currentUser;
  }

  /**
   * @deprecated Supabase gerencia tokens automaticamente
   */
  setTokens() {
    console.warn(
      "⚠️ setTokens() está deprecated. Supabase gerencia tokens automaticamente.",
    );
  }

  /**
   * @deprecated Supabase gerencia tokens automaticamente
   */
  clearAuth() {
    console.warn("⚠️ clearAuth() está deprecated. Use logout()");
    return this.logout();
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const authService = new AuthService();
