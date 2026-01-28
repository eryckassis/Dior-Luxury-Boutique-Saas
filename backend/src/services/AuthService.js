import { supabase } from "./supabaseClient.js";

class AuthService {
  constructor() {
    this.listeners = [];
    this.currentUser = null;
    this.currentSession = null;

    this.initAuthListener();
  }

  initAuthListener() {
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔐 Auth Event:", event);

      this.currentSession = session;
      this.currentUser = session?.user || null;

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

      this.notifyListeners();

      if (event === "SIGNED_OUT" && !this._manualLogout) {
        window.dispatchEvent(new CustomEvent("session-expired"));
      }
      this._manualLogout = false;
    });
  }

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
        if (error.message.includes("already registered")) {
          throw new Error("Email já está cadastrado. Por favor, faça login ou use outro email.");
        }
        throw new Error(error.message);
      }

      return {
        success: true,
        message: "Conta criada com sucesso! Verifique seu email para confirmar.",
        user: data.user,
        session: data.session,
      };
    } catch (error) {
      console.error("❌ Erro no registro:", error);
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          throw new Error("Email ou senha incorretos.");
        }
        if (error.message.includes("Email not confirmed")) {
          throw new Error("Por favor, confirme seu email antes de fazer login.");
        }
        throw new Error(error.message);
      }

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
        message: "Se o email existir, você receberá instruções para redefinir a senha.",
      };
    } catch (error) {
      console.error("❌ Erro na recuperação de senha:", error);
      throw error;
    }
  }

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
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error("❌ Erro ao buscar perfil:", error);
      throw error;
    }
  }

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
        if (error.message.includes("duplicate key") && error.message.includes("cpf")) {
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

  async getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  }

  async getSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  }

  async getAccessToken() {
    const session = await this.getSession();
    return session?.access_token || null;
  }

  isAuthenticated() {
    return !!this.currentSession;
  }

  getCachedUser() {
    return this.currentUser;
  }

  async checkAuth() {
    try {
      const session = await this.getSession();
      return !!session;
    } catch (error) {
      return false;
    }
  }

  addListener(callback) {
    this.listeners.push(callback);

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

  getStoredUser() {
    console.warn("⚠️ getStoredUser() está deprecated. Use getProfile()");
    return this.currentUser;
  }

  setTokens() {
    console.warn("⚠️ setTokens() está deprecated. Supabase gerencia tokens automaticamente.");
  }

  clearAuth() {
    console.warn("⚠️ clearAuth() está deprecated. Use logout()");
    return this.logout();
  }
}

export const authService = new AuthService();
