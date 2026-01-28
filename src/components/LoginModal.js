export class LoginModal extends HTMLElement {
  constructor() {
    super();
    this.isOpen = false;
  }

  connectedCallback() {
    this.render();
    this.initEventListeners();
  }

  initEventListeners() {
    const closeBtn = this.querySelector(".login-modal-close");
    const backdrop = this.querySelector(".login-modal-backdrop");
    const toggleLinks = this.querySelectorAll(".login-toggle-link");

    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.close());
    }

    if (backdrop) {
      backdrop.addEventListener("click", () => this.close());
    }

    toggleLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const loginView = this.querySelector(".login-modal-login-view");
        const signupView = this.querySelector(".login-modal-signup-view");

        if (loginView.style.display === "none") {
          loginView.style.display = "block";
          signupView.style.display = "none";
        } else {
          loginView.style.display = "none";
          signupView.style.display = "block";
        }
      });
    });

    const togglePasswordBtns = this.querySelectorAll(".toggle-password");
    togglePasswordBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const input = btn.previousElementSibling;
        const type = input.getAttribute("type") === "password" ? "text" : "password";
        input.setAttribute("type", type);

        const svg = btn.querySelector("svg");
        if (type === "password") {
          svg.innerHTML =
            '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
        } else {
          svg.innerHTML =
            '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
        }
      });
    });
  }

  open() {
    if (this.isOpen) return;

    this.isOpen = true;
    const modal = this.querySelector(".login-modal-container");
    const backdrop = this.querySelector(".login-modal-backdrop");

    if (!window.gsap) {
      modal.style.display = "flex";
      backdrop.style.display = "block";
      backdrop.style.opacity = "1";
      return;
    }

    document.body.style.overflow = "hidden";

    modal.style.display = "flex";
    backdrop.style.display = "block";

    const tl = window.gsap.timeline();

    tl.to(backdrop, {
      opacity: 1,
      duration: 0.3,
      ease: "power2.out",
    }).fromTo(
      modal,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" },
      "-=0.2",
    );
  }

  close() {
    if (!this.isOpen) return;

    this.isOpen = false;
    const modal = this.querySelector(".login-modal-container");
    const backdrop = this.querySelector(".login-modal-backdrop");

    if (!window.gsap) {
      modal.style.display = "none";
      backdrop.style.display = "none";
      backdrop.style.opacity = "0";
      document.body.style.overflow = "";
      return;
    }

    const tl = window.gsap.timeline({
      onComplete: () => {
        modal.style.display = "none";
        backdrop.style.display = "none";
        document.body.style.overflow = "";
      },
    });

    tl.to(modal, {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
    }).to(
      backdrop,
      {
        opacity: 0,
        duration: 0.2,
      },
      "-=0.2",
    );
  }

  render() {
    this.innerHTML = `
      <!-- Backdrop -->
      <div class="login-modal-backdrop"></div>

      <!-- Modal Container -->
      <div class="login-modal-container">
        <!-- Close Button -->
        <button class="login-modal-close" aria-label="Fechar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <!-- Login View -->
        <div class="login-modal-login-view" style="display: block;">
          <div class="login-modal-header">
            <p class="login-modal-subtitle">Não tem uma conta? <a href="#" class="login-toggle-link">Cadastre-se</a></p>
            <h2 class="login-modal-title">Login</h2>
          </div>

          <form class="login-modal-form">
            <div class="login-form-group">
              <label class="login-form-label">Entrar com email e senha</label>
              <p class="login-form-helper">Para acessar sua conta</p>
              <input 
                type="email" 
                class="login-form-input" 
                placeholder="Ex.: exemplo@mail.com"
                required
              />
            </div>

            <div class="login-form-group">
              <label class="login-form-label">Adicione sua senha</label>
              <div class="login-password-wrapper">
                <input 
                  type="password" 
                  class="login-form-input" 
                  placeholder="Senha"
                  required
                />
                <button type="button" class="toggle-password" aria-label="Mostrar senha">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
              <a href="#" class="login-forgot-link">Esqueci minha senha</a>
            </div>

            <button type="submit" class="login-submit-btn">Entrar</button>
          </form>

          <div class="login-modal-footer">
            <p class="login-footer-text">Não tem uma conta? <strong>Cadastre-se</strong></p>
            <a href="#" class="login-toggle-link login-footer-link">Login</a>
            <button type="button" class="login-email-btn">Receber código de acesso por email</button>
          </div>
        </div>

        <!-- Signup View (hidden by default) -->
        <div class="login-modal-signup-view" style="display: none;">
          <div class="login-modal-header">
            <p class="login-modal-subtitle">Já tem uma conta? <a href="#" class="login-toggle-link">Login</a></p>
            <h2 class="login-modal-title">Cadastre-se</h2>
          </div>

          <form class="login-modal-form">
            <div class="login-form-group">
              <label class="login-form-label">Nome completo</label>
              <input 
                type="text" 
                class="login-form-input" 
                placeholder="Digite seu nome"
                required
              />
            </div>

            <div class="login-form-group">
              <label class="login-form-label">Email</label>
              <input 
                type="email" 
                class="login-form-input" 
                placeholder="Ex.: exemplo@mail.com"
                required
              />
            </div>

            <div class="login-form-group">
              <label class="login-form-label">Criar senha</label>
              <div class="login-password-wrapper">
                <input 
                  type="password" 
                  class="login-form-input" 
                  placeholder="Senha"
                  required
                />
                <button type="button" class="toggle-password" aria-label="Mostrar senha">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
            </div>

            <button type="submit" class="login-submit-btn">Cadastrar</button>
          </form>
        </div>
      </div>
    `;
  }
}

customElements.define("login-modal", LoginModal);
