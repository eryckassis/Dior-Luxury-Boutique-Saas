// ============================================================================
// AUTH SERVICE - Gerenciamento de Autenticação com Backend
// ============================================================================

class AuthService {
  constructor() {
    this.API_URL = "http://localhost:5000/api/auth";
    this.ACCESS_TOKEN_KEY = "dior_access_token";
    this.REFRESH_TOKEN_KEY = "dior_refresh_token";
    this.USER_KEY = "dior_user";
    this.listeners = [];
    this.expirationCheckInterval = null;

    // Só inicia verificação se já houver tokens (usuário já logado)
    if (this.getAccessToken() && this.getRefreshToken()) {
      this.startExpirationCheck();
    }
  }

  // ========================================================================
  // AUTENTICAÇÃO
  // ========================================================================

  /**
   * Registra novo usuário
   * @param {Object} userData - {name, email, password, confirmPassword}
   * @returns {Promise<Object>} - Resposta da API com dados do usuário
   */
  async register(userData) {
    try {
      const response = await fetch(`${this.API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao criar conta");
      }

      // Nota: O backend de register não retorna tokens automaticamente
      // O usuário precisará fazer login após registrar
      // Se o backend retornar tokens no futuro, descomentar as linhas abaixo:
      // this.setTokens(data.data.tokens.accessToken, data.data.tokens.refreshToken);
      // this.setUser(data.data.user);
      // this.notifyListeners();

      return data;
    } catch (error) {
      console.error("❌ Erro no registro:", error);
      throw error;
    }
  }

  /**
   * Faz login do usuário
   * @param {Object} credentials - {email, password}
   * @returns {Promise<Object>} - Resposta da API com tokens
   */
  async login(credentials) {
    try {
      const response = await fetch(`${this.API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao fazer login");
      }

      this.setTokens(
        data.data.tokens.accessToken,
        data.data.tokens.refreshToken,
      );
      this.setUser(data.data.user);
      this.notifyListeners();

      // Inicia verificação de expiração
      this.startExpirationCheck();

      return data;
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
      const refreshToken = this.getRefreshToken();

      if (refreshToken) {
        await fetch(`${this.API_URL}/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.getAccessToken()}`,
          },
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch (error) {
      console.error("❌ Erro no logout:", error);
    } finally {
      // Para o timer de verificação
      this.stopExpirationCheck();
      // Limpa dados locais independente do resultado da API
      this.clearAuth();
      this.notifyListeners();
    }
  }

  /**
   * Atualiza o access token usando o refresh token
   * @returns {Promise<string>} - Novo access token
   */
  async refreshAccessToken() {
    try {
      const refreshToken = this.getRefreshToken();

      if (!refreshToken) {
        throw new Error("Refresh token não encontrado");
      }

      console.log(
        "🔄 Tentando refresh com token:",
        refreshToken.substring(0, 30) + "...",
      );

      const response = await fetch(`${this.API_URL}/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      console.log("📡 Resposta do refresh:", response.status, data);

      if (!response.ok) {
        throw new Error(data.message || "Erro ao atualizar token");
      }

      // Atualiza os tokens (backend retorna data.tokens.accessToken)
      this.setTokens(
        data.data.tokens.accessToken,
        data.data.tokens.refreshToken,
      );

      console.log("✅ Tokens atualizados com sucesso!");
      console.log(
        "   Novo refresh token:",
        data.data.tokens.refreshToken.substring(0, 30) + "...",
      );

      this.notifyListeners();

      return data.data.tokens.accessToken;
    } catch (error) {
      console.error("❌ Erro ao atualizar token:", error);
      this.clearAuth();
      throw error;
    }
  }

  /**
   * Recuperação de senha
   * @param {string} email - Email do usuário
   * @returns {Promise<Object>}
   */
  async forgotPassword(email) {
    try {
      const response = await fetch(`${this.API_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao solicitar recuperação");
      }

      return data;
    } catch (error) {
      console.error("❌ Erro na recuperação de senha:", error);
      throw error;
    }
  }

  /**
   * Reset de senha com token
   * @param {Object} resetData - {token, password, confirmPassword}
   * @returns {Promise<Object>}
   */
  async resetPassword(resetData) {
    try {
      const response = await fetch(`${this.API_URL}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resetData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao redefinir senha");
      }

      return data;
    } catch (error) {
      console.error("❌ Erro ao redefinir senha:", error);
      throw error;
    }
  }

  /**
   * Obtém dados do usuário autenticado
   * @returns {Promise<Object>}
   */
  async getMe() {
    try {
      const response = await fetch(`${this.API_URL}/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // Se o token expirou, tenta renovar
        if (response.status === 401) {
          await this.refreshAccessToken();
          return this.getMe(); // Retry
        }
        throw new Error(data.message || "Erro ao buscar dados do usuário");
      }

      this.setUser(data.data.user);
      return data;
    } catch (error) {
      console.error("❌ Erro ao buscar dados do usuário:", error);
      throw error;
    }
  }

  // ========================================================================
  // GERENCIAMENTO DE TOKENS
  // ========================================================================

  setTokens(accessToken, refreshToken) {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  setAccessToken(accessToken) {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
  }

  getAccessToken() {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  setUser(user) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser() {
    try {
      const user = localStorage.getItem(this.USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("❌ Erro ao ler dados do usuário:", error);
      return null;
    }
  }

  clearAuth() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // ========================================================================
  // VERIFICAÇÕES
  // ========================================================================

  isAuthenticated() {
    return !!this.getAccessToken();
  }

  isTokenExpired(token) {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp * 1000; // Converte para milissegundos
      return Date.now() >= exp;
    } catch (error) {
      return true;
    }
  }

  async checkAuth() {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();

    if (!accessToken || !refreshToken) {
      return false;
    }

    // Se o access token expirou, tenta renovar
    if (this.isTokenExpired(accessToken)) {
      try {
        await this.refreshAccessToken();
        return true;
      } catch (error) {
        return false;
      }
    }

    return true;
  }

  // ========================================================================
  // LISTENERS (Observer Pattern)
  // ========================================================================

  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter((listener) => listener !== callback);
  }

  notifyListeners() {
    const user = this.getUser();
    const isAuthenticated = this.isAuthenticated();
    this.listeners.forEach((callback) => callback({ user, isAuthenticated }));
  }

  // ========================================================================
  // SESSION EXPIRATION MONITORING
  // ========================================================================

  /**
   * Inicia verificação periódica de expiração do token
   */
  startExpirationCheck() {
    // Limpa interval anterior se existir
    if (this.expirationCheckInterval) {
      clearInterval(this.expirationCheckInterval);
    }

    // Verifica a cada 30 segundos
    this.expirationCheckInterval = setInterval(() => {
      this.checkAndHandleExpiration();
    }, 30000);

    // Verifica imediatamente também
    this.checkAndHandleExpiration();
  }

  /**
   * Para a verificação de expiração
   */
  stopExpirationCheck() {
    if (this.expirationCheckInterval) {
      clearInterval(this.expirationCheckInterval);
      this.expirationCheckInterval = null;
    }
  }

  /**
   * Verifica se token expirou e tenta renovar ou dispara evento
   */
  async checkAndHandleExpiration() {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();

    // Se não há tokens, não precisa verificar
    if (!accessToken || !refreshToken) {
      this.stopExpirationCheck();
      return;
    }

    // Se access token expirou
    if (this.isTokenExpired(accessToken)) {
      console.log("⏰ Access token expirado, tentando renovar...");

      // Tenta renovar
      try {
        await this.refreshAccessToken();
        console.log("✅ Token renovado com sucesso");
      } catch (error) {
        console.log("❌ Falha ao renovar token, sessão expirada");
        this.handleSessionExpired();
      }
    } else {
      // Verifica se vai expirar em breve (1 minuto)
      try {
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        const exp = payload.exp * 1000;
        const timeUntilExpiry = exp - Date.now();

        // Se expira em menos de 1 minuto, tenta renovar preventivamente
        if (timeUntilExpiry < 60000 && timeUntilExpiry > 0) {
          console.log("⚠️ Token expira em breve, renovando preventivamente...");
          try {
            await this.refreshAccessToken();
          } catch (error) {
            // Ignora erro, tentará novamente na próxima verificação
          }
        }
      } catch (e) {
        // Erro ao decodificar token, ignora
      }
    }
  }

  /**
   * Dispara evento de sessão expirada e limpa dados
   */
  handleSessionExpired() {
    this.stopExpirationCheck();
    this.clearAuth();
    this.notifyListeners();

    // Dispara evento customizado para o modal
    window.dispatchEvent(new CustomEvent("session-expired"));
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const authService = new AuthService();
