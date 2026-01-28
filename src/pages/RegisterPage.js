import "../components/AppNavigation.js";
import "../components/FooterSection.js";
import "../styles/register.css";
import { authService } from "../services/AuthService.js";
import { router } from "../router/router.js";

export class RegisterPage extends HTMLElement {
  constructor() {
    super();
    this.isLoading = false;
  }

  connectedCallback() {
    this.render();
    this.initRegisterForm();
    this.initPasswordToggles();
    this.initLoginButton();
  }

  initLoginButton() {
    const loginButton = this.querySelector(".login-button");
    if (loginButton) {
      loginButton.addEventListener("click", () => {
        router.navigate("/login");
      });
    }
  }

  initPasswordToggles() {
    const passwordToggles = this.querySelectorAll(".password-toggle");

    passwordToggles.forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const wrapper = toggle.closest(".register-input-wrapper");
        const input = wrapper.querySelector("input");

        if (input.type === "password") {
          input.type = "text";
          toggle.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          `;
        } else {
          input.type = "password";
          toggle.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          `;
        }
      });
    });
  }

  initRegisterForm() {
    const form = this.querySelector("#register-form");
    if (!form) return;

    // Real-time password strength indicator
    const passwordInput = form.querySelector('input[name="password"]');
    const strengthIndicator = this.querySelector(".password-strength");
    const strengthBar = this.querySelector(".strength-bar");
    const strengthText = this.querySelector(".strength-text");

    if (passwordInput && strengthIndicator) {
      passwordInput.addEventListener("input", (e) => {
        const password = e.target.value;
        const strength = this.calculatePasswordStrength(password);

        strengthBar.className = `strength-bar strength-${strength.level}`;
        strengthBar.style.width = `${strength.percentage}%`;
        strengthText.textContent = strength.text;
        strengthIndicator.style.display = password.length > 0 ? "block" : "none";
      });
    }

    // Form submission
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (this.isLoading) return;

      const nameInput = form.querySelector('input[name="name"]');
      const emailInput = form.querySelector('input[name="email"]');
      const passwordInput = form.querySelector('input[name="password"]');
      const confirmPasswordInput = form.querySelector('input[name="confirmPassword"]');
      const submitButton = form.querySelector('button[type="submit"]');

      const name = nameInput?.value.trim();
      const email = emailInput?.value.trim();
      const password = passwordInput?.value;
      const confirmPassword = confirmPasswordInput?.value;

      // Validações frontend
      if (!name || name.length < 3) {
        this.showError("O nome deve ter pelo menos 3 caracteres");
        return;
      }

      if (!email || !this.isValidEmail(email)) {
        this.showError("Por favor, insira um email válido");
        return;
      }

      if (!password || password.length < 8) {
        this.showError("A senha deve ter pelo menos 8 caracteres");
        return;
      }

      if (password !== confirmPassword) {
        this.showError("As senhas não coincidem");
        return;
      }

      try {
        this.isLoading = true;
        submitButton.disabled = true;
        submitButton.textContent = "Criando conta...";

        const response = await authService.register({
          name,
          email,
          password,
          confirmPassword,
        });

        this.showSuccess(response.message || "Conta criada com sucesso!");

        // Limpa o formulário
        form.reset();
        strengthIndicator.style.display = "none";

        // Aguarda 2 segundos e redireciona para home
        setTimeout(() => {
          router.navigate("/");
        }, 2000);
      } catch (error) {
        this.showError(error.message || "Erro ao criar conta. Tente novamente.");
      } finally {
        this.isLoading = false;
        submitButton.disabled = false;
        submitButton.textContent = "Criar Conta";
      }
    });
  }

  calculatePasswordStrength(password) {
    if (!password) {
      return { level: "weak", percentage: 0, text: "" };
    }

    let strength = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password),
    };

    strength += checks.length ? 20 : 0;
    strength += checks.lowercase ? 20 : 0;
    strength += checks.uppercase ? 20 : 0;
    strength += checks.number ? 20 : 0;
    strength += checks.special ? 20 : 0;

    if (strength <= 40) {
      return { level: "weak", percentage: strength, text: "Fraca" };
    } else if (strength <= 60) {
      return { level: "medium", percentage: strength, text: "Média" };
    } else if (strength <= 80) {
      return { level: "good", percentage: strength, text: "Boa" };
    } else {
      return { level: "strong", percentage: strength, text: "Forte" };
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showError(message) {
    const form = this.querySelector("#register-form");
    if (!form) return;

    const existingMessage = form.querySelector(".register-message");
    if (existingMessage) {
      existingMessage.remove();
    }

    const messageEl = document.createElement("div");
    messageEl.className = "register-message register-message-error";
    messageEl.textContent = message;

    const button = form.querySelector('button[type="submit"]');
    form.insertBefore(messageEl, button);

    setTimeout(() => {
      messageEl.remove();
    }, 5000);
  }

  showSuccess(message) {
    const form = this.querySelector("#register-form");
    if (!form) return;

    const existingMessage = form.querySelector(".register-message");
    if (existingMessage) {
      existingMessage.remove();
    }

    const messageEl = document.createElement("div");
    messageEl.className = "register-message register-message-success";
    messageEl.textContent = message;

    const button = form.querySelector('button[type="submit"]');
    form.insertBefore(messageEl, button);
  }

  render() {
    this.innerHTML = `
      <div class="register-page">
        <app-navigation></app-navigation>

        <div class="all-content">
          <main class="main">
            <div class="container register-container">
              <form id="register-form" class="form" method="" action="">
                <h2 class="form_title">Criar sua conta Dior</h2>
                <p class="form_subtitle">Junte-se à experiência de luxo</p>

                <div class="register-input-wrapper">
                  <input 
                    class="form__input" 
                    type="text" 
                    name="name"
                    placeholder="Nome completo"
                    required 
                    minlength="3"
                  />
                </div>

                <div class="register-input-wrapper">
                  <input 
                    class="form__input" 
                    type="email" 
                    name="email"
                    placeholder="Email (ex: exemplo@mail.com)"
                    required 
                  />
                </div>

                <div class="register-input-wrapper">
                  <input 
                    class="form__input" 
                    type="password" 
                    name="password"
                    placeholder="Senha (mínimo 8 caracteres)"
                    required 
                    minlength="8"
                  />
                  <button type="button" class="password-toggle" aria-label="Mostrar senha">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                </div>

                <div class="password-strength" style="display: none;">
                  <div class="strength-bar-container">
                    <div class="strength-bar"></div>
                  </div>
                  <span class="strength-text"></span>
                </div>

                <div class="register-input-wrapper">
                  <input 
                    class="form__input" 
                    type="password" 
                    name="confirmPassword"
                    placeholder="Confirme sua senha"
                    required 
                  />
                  <button type="button" class="password-toggle" aria-label="Mostrar senha">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                </div>

                <div class="password-requirements">
                  <p class="requirements-title">A senha deve conter:</p>
                  <ul class="requirements-list">
                    <li>Pelo menos 8 caracteres</li>
                    <li>Letra maiúscula (A-Z)</li>
                    <li>Letra minúscula (a-z)</li>
                    <li>Número (0-9)</li>
                    <li>Caractere especial (@$!%*?&)</li>
                  </ul>
                </div>

                <button class="form__button" type="submit">Criar Conta</button>

                <div class="register-footer">
                  <p class="register-footer-text">Já tem uma conta?</p>
                  <button type="button" class="login-button" data-route="/login">Fazer login</button>
                </div>
              </form>
            </div>

            <div class="switch">
              <div class="switch__video">
                <video autoplay muted loop playsinline>
                  <source src="/videos/Letter.mp4" type="video/mp4">
                </video>
              </div>

              
            </div>
          </main>
        </div>

        <footer-section></footer-section>
      </div>
    `;
  }
}

customElements.define("register-page", RegisterPage);
