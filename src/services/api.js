const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

class ApiService {
  constructor() {
    this.csrfToken = null;
  }

  async request(endpoint, options = {}) {
    const config = {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    if (["POST", "PUT", "DELETE", "PATCH"].includes(options.method)) {
      config.headers["X-CSRF-Token"] = this.getCSRFToken();
    }

    const response = await fetch(`${API_URL}${endpoint}`, config);

    this.updateCSRFToken();

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro na requisição");
    }

    return response.json();
  }

  getCSRFToken() {
    if (this.csrfToken) return this.csrfToken;

    const match = document.cookie.match(/csrf_token=([^;]+)/);
    this.csrfToken = match ? match[1] : null;
    return this.csrfToken;
  }

  updateCSRFToken() {
    const match = document.cookie.match(/csrf_token=([^;]+)/);
    this.csrfToken = match ? match[1] : null;
  }

  async register(userData) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(email, password) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request("/auth/logout", {
      method: "POST",
    });
  }

  async getMe() {
    return this.request("/auth/me");
  }

  async refreshToken() {
    return this.request("/auth/refresh", {
      method: "POST",
    });
  }

  async getSession() {
    return this.request("/auth/session");
  }

  async getProfile() {
    return this.request("/user/profile");
  }

  async updateProfile(data) {
    return this.request("/user/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }
}

export default new ApiService();
