import { router } from "../router/router.js";
import { authService } from "../services/AuthService.js";

class SessionExpiredModal {
  constructor() {
    this.isVisible = false;
    this.modal = null;
    this.init();
  }

  init() {
    window.addEventListener("session-expired", () => this.show());
  }

  createModal() {
    const existing = document.querySelector(".session-expired-modal-backdrop");
    if (existing) existing.remove();

    const backdrop = document.createElement("div");
    backdrop.className = "session-expired-modal-backdrop";
    backdrop.innerHTML = `
      <div class="session-expired-modal">
        <div class="session-expired-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        
        <h2 class="session-expired-title">Sessão Expirada</h2>
        
        <p class="session-expired-message">
          Você foi desconectado por inatividade.<br>
          Por favor, faça login novamente.
        </p>
        
        <button class="session-expired-btn">
          <span class="session-expired-btn-flair"></span>
          <span class="session-expired-btn-label">Fazer Login</span>
        </button>
      </div>
    `;

    document.body.appendChild(backdrop);
    this.modal = backdrop;

    this.initEventListeners();
  }

  initEventListeners() {
    const btn = this.modal.querySelector(".session-expired-btn");

    if (btn) {
      btn.addEventListener("click", async () => {
        this.hide();
        await authService.logout();
        router.navigate("/login");
      });

      if (window.gsap) {
        const flair = btn.querySelector(".session-expired-btn-flair");

        if (flair) {
          const xSet = window.gsap.quickSetter(flair, "xPercent");
          const ySet = window.gsap.quickSetter(flair, "yPercent");

          const getXY = (e) => {
            const { left, top, width, height } = btn.getBoundingClientRect();

            const xTransformer = window.gsap.utils.pipe(
              window.gsap.utils.mapRange(0, width, 0, 100),
              window.gsap.utils.clamp(0, 100),
            );

            const yTransformer = window.gsap.utils.pipe(
              window.gsap.utils.mapRange(0, height, 0, 100),
              window.gsap.utils.clamp(0, 100),
            );

            return {
              x: xTransformer(e.clientX - left),
              y: yTransformer(e.clientY - top),
            };
          };

          btn.addEventListener("mouseenter", (e) => {
            const { x, y } = getXY(e);
            xSet(x);
            ySet(y);
            window.gsap.to(flair, {
              scale: 1,
              duration: 0.4,
              ease: "power2.out",
            });
          });

          btn.addEventListener("mouseleave", (e) => {
            const { x, y } = getXY(e);
            window.gsap.killTweensOf(flair);
            window.gsap.to(flair, {
              xPercent: x > 90 ? x + 20 : x < 10 ? x - 20 : x,
              yPercent: y > 90 ? y + 20 : y < 10 ? y - 20 : y,
              scale: 0,
              duration: 0.3,
              ease: "power2.out",
            });
          });

          btn.addEventListener("mousemove", (e) => {
            const { x, y } = getXY(e);

            window.gsap.to(flair, {
              xPercent: x,
              yPercent: y,
              duration: 0.4,
              ease: "power2",
              overwrite: "auto",
            });
          });
        }
      }
    }
  }

  show() {
    if (this.isVisible) return;

    this.isVisible = true;
    this.createModal();

    requestAnimationFrame(() => {
      this.modal.classList.add("visible");
    });

    document.body.style.overflow = "hidden";

    console.log("🔒 Modal de sessão expirada exibido");
  }

  hide() {
    if (!this.isVisible || !this.modal) return;

    this.isVisible = false;
    this.modal.classList.remove("visible");

    setTimeout(() => {
      this.modal.remove();
      this.modal = null;
    }, 300);

    document.body.style.overflow = "";
  }
}

export const sessionExpiredModal = new SessionExpiredModal();
