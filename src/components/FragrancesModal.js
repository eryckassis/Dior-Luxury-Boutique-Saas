// ============================================================================
// FRAGRANCES MODAL - Modal de navegação de fragrâncias
// ============================================================================

import { router } from "../router/router.js";

export class FragrancesModal extends HTMLElement {
  constructor() {
    super();
    this.isOpen = false;
    this.currentView = "main"; // 'main' or 'feminine'
  }

  connectedCallback() {
    console.log("FragrancesModal connected to DOM");
    this.render();
    this.initEventListeners();
    console.log("FragrancesModal initialized");
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  initEventListeners() {
    // Close button
    this.closeBtn = this.querySelector(".fragrances-modal-close");
    this.closeHandler = () => this.close();
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", this.closeHandler);
    }

    // Backdrop click
    this.backdrop = this.querySelector(".fragrances-modal-backdrop");
    this.backdropHandler = (e) => {
      if (e.target === this.backdrop) {
        this.close();
      }
    };
    if (this.backdrop) {
      this.backdrop.addEventListener("click", this.backdropHandler);
    }

    // ESC key
    this.escHandler = (e) => {
      if (e.key === "Escape" && this.isOpen) {
        if (this.currentView === "feminine") {
          this.showMainView();
        } else {
          this.close();
        }
      }
    };
    document.addEventListener("keydown", this.escHandler);

    // Back button (voltar ao menu principal)
    this.backBtn = this.querySelector(".fragrances-back-btn");
    if (this.backBtn) {
      this.backBtn.addEventListener("click", () => this.showMainView());
    }

    // Fragrância Feminina link
    const feminineLink = this.querySelector('[data-view="feminine"]');
    if (feminineLink) {
      feminineLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.showFeminineView();
      });
    }

    // Menu links with routes (tanto da view principal quanto da feminina)
    this.menuLinks = this.querySelectorAll(
      ".fragrances-menu-link[data-route], .feminine-menu-link[data-route], .feminine-featured-link[data-route]",
    );
    this.menuLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const route = link.getAttribute("data-route");
        if (route) {
          e.preventDefault();
          console.log(`Navegando para: ${route}`);
          this.close();
          // Aguarda o modal fechar completamente antes de navegar
          setTimeout(() => {
            router.navigate(route);
          }, 500); // Aumentado para garantir que o modal fecha completamente
        }
      });
    });

    // Listen for navigation events to close modal
    this.navigationHandler = () => {
      if (this.isOpen) {
        this.close();
      }
    };
    window.addEventListener("popstate", this.navigationHandler);
    window.addEventListener("hashchange", this.navigationHandler);
  }

  removeEventListeners() {
    if (this.closeBtn && this.closeHandler) {
      this.closeBtn.removeEventListener("click", this.closeHandler);
    }
    if (this.backdrop && this.backdropHandler) {
      this.backdrop.removeEventListener("click", this.backdropHandler);
    }
    if (this.escHandler) {
      document.removeEventListener("keydown", this.escHandler);
    }
    if (this.navigationHandler) {
      window.removeEventListener("popstate", this.navigationHandler);
      window.removeEventListener("hashchange", this.navigationHandler);
    }
  }

  showMainView() {
    this.currentView = "main";
    const mainView = this.querySelector(".fragrances-main-view");
    const feminineView = this.querySelector(".fragrances-feminine-view");
    const title = this.querySelector(".fragrances-modal-title");
    const backBtn = this.querySelector(".fragrances-back-btn");

    if (window.gsap) {
      const tl = window.gsap.timeline({
        defaults: { ease: "power3.inOut" },
      });

      // Animate out feminine view
      tl.to(feminineView, {
        x: "100%",
        opacity: 0,
        duration: 0.4,
      })
        .set(feminineView, { display: "none" })

        // Prepare main view
        .set(mainView, {
          display: "block",
          x: "-30%",
          opacity: 0,
        })

        // Animate in main view
        .to(mainView, {
          x: 0,
          opacity: 1,
          duration: 0.5,
        })

        // Update header
        .to(
          title,
          {
            opacity: 0,
            duration: 0.15,
            onComplete: () => {
              title.textContent = "Início";
            },
          },
          0,
        )
        .to(
          title,
          {
            opacity: 1,
            duration: 0.15,
          },
          0.15,
        )

        // Hide back button
        .to(
          backBtn,
          {
            opacity: 0,
            scale: 0.8,
            duration: 0.2,
            onComplete: () => {
              backBtn.classList.remove("visible");
            },
          },
          0,
        );
    } else {
      feminineView.style.display = "none";
      mainView.style.display = "block";
      title.textContent = "Início";
      backBtn.classList.remove("visible");
    }
  }

  showFeminineView() {
    this.currentView = "feminine";
    const mainView = this.querySelector(".fragrances-main-view");
    const feminineView = this.querySelector(".fragrances-feminine-view");
    const title = this.querySelector(".fragrances-modal-title");
    const backBtn = this.querySelector(".fragrances-back-btn");

    if (window.gsap) {
      const tl = window.gsap.timeline({
        defaults: { ease: "power3.inOut" },
      });

      // Animate out main view
      tl.to(mainView, {
        x: "-100%",
        opacity: 0,
        duration: 0.4,
      })
        .set(mainView, { display: "none" })

        // Prepare feminine view
        .set(feminineView, {
          display: "block",
          x: "30%",
          opacity: 0,
        })

        // Animate in feminine view
        .to(feminineView, {
          x: 0,
          opacity: 1,
          duration: 0.5,
        })

        // Update header
        .to(
          title,
          {
            opacity: 0,
            duration: 0.15,
            onComplete: () => {
              title.textContent = "Fragrância Feminina";
            },
          },
          0,
        )
        .to(
          title,
          {
            opacity: 1,
            duration: 0.15,
          },
          0.15,
        )

        // Show back button
        .call(() => {
          backBtn.classList.add("visible");
        })
        .to(
          backBtn,
          {
            opacity: 1,
            scale: 1,
            duration: 0.3,
          },
          0.2,
        );

      // Stagger animate feminine content
      const iconItems = feminineView.querySelectorAll(".feminine-icon-item");
      const menuItems = feminineView.querySelectorAll(".feminine-menu-item");
      const featuredCards = feminineView.querySelectorAll(".feminine-featured-card");

      tl.fromTo(
        iconItems,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.08,
          ease: "back.out(1.2)",
        },
        0.3,
      )
        .fromTo(
          menuItems,
          { x: -20, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out",
          },
          0.4,
        )
        .fromTo(
          featuredCards,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
          },
          0.5,
        );
    } else {
      mainView.style.display = "none";
      feminineView.style.display = "block";
      title.textContent = "Fragrância Feminina";
      backBtn.classList.add("visible");
    }
  }

  open() {
    console.log("FragrancesModal.open() called");
    this.isOpen = true;
    this.currentView = "main";
    const modal = this.querySelector(".fragrances-modal");
    const container = this.querySelector(".fragrances-modal-container");

    if (!modal || !container) {
      console.error("Modal elements not found", { modal, container });
      return;
    }

    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    // Reset to main view
    const mainView = this.querySelector(".fragrances-main-view");
    const feminineView = this.querySelector(".fragrances-feminine-view");
    const title = this.querySelector(".fragrances-modal-title");
    const backBtn = this.querySelector(".fragrances-back-btn");

    if (mainView && feminineView) {
      mainView.style.display = "block";
      feminineView.style.display = "none";
      title.textContent = "Início";
      backBtn.classList.remove("visible");
    }

    // Animate with GSAP
    if (window.gsap) {
      // Kill any existing animations
      window.gsap.killTweensOf([
        container,
        ".fragrances-modal-backdrop",
        ".fragrances-modal-header > *",
        ".fragrances-main-view .fragrances-menu-item",
        ".fragrances-bottom-item",
      ]);

      const tl = window.gsap.timeline({
        defaults: { ease: "power4.out" },
      });

      // Backdrop fade in
      tl.fromTo(".fragrances-modal-backdrop", { opacity: 0 }, { opacity: 1, duration: 0.4 })

        // Container slide in with bounce
        .fromTo(
          container,
          { x: "-100%", opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            ease: "back.out(1.4)",
          },
          0.1,
        )

        // Header elements animate in
        .fromTo(
          ".fragrances-modal-header > *",
          { y: -10, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out",
          },
          0.3,
        )

        // Menu items stagger
        .fromTo(
          ".fragrances-main-view .fragrances-menu-item",
          { x: -30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.04,
            ease: "power2.out",
          },
          0.4,
        )

        // Bottom links
        .fromTo(
          ".fragrances-bottom-item",
          { y: 10, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out",
          },
          0.6,
        );
    }
  }

  close() {
    console.log("FragrancesModal.close() called");
    this.isOpen = false;
    const modal = this.querySelector(".fragrances-modal");
    const container = this.querySelector(".fragrances-modal-container");

    if (!modal || !container) {
      console.error("Modal elements not found for closing");
      return;
    }

    // Animate with GSAP
    if (window.gsap) {
      const tl = window.gsap.timeline({
        defaults: { ease: "power3.in" },
      });

      // Slide out container
      tl.to(container, {
        x: "-100%",
        duration: 0.5,
        ease: "back.in(1.2)",
      })

        // Fade out backdrop
        .to(
          ".fragrances-modal-backdrop",
          {
            opacity: 0,
            duration: 0.3,
          },
          0.2,
        )

        .call(() => {
          modal.classList.remove("active");
          // Restaurar overflow seguindo o padrão do projeto
          document.body.style.overflow = "auto";
          document.body.style.overflowX = "hidden";

          // Reset to main view WITHOUT destroying elements
          this.currentView = "main";
          const mainView = this.querySelector(".fragrances-main-view");
          const feminineView = this.querySelector(".fragrances-feminine-view");
          const title = this.querySelector(".fragrances-modal-title");
          const backBtn = this.querySelector(".fragrances-back-btn");

          if (mainView && feminineView) {
            // Reset visibility
            mainView.style.display = "block";
            feminineView.style.display = "none";

            // Reset transforms
            window.gsap.set(mainView, { x: 0, opacity: 1 });
            window.gsap.set(feminineView, { x: 0, opacity: 1 });

            // Reset header
            title.textContent = "Início";
            backBtn.classList.remove("visible");
            window.gsap.set(backBtn, { opacity: 0, scale: 1 });

            // Reset container position
            window.gsap.set(container, { x: 0 });

            // Reset backdrop
            window.gsap.set(".fragrances-modal-backdrop", { opacity: 1 });
          }
        });
    } else {
      modal.classList.remove("active");
      // Restaurar overflow seguindo o padrão do projeto
      document.body.style.overflow = "auto";
      document.body.style.overflowX = "hidden";

      // Reset to main view
      this.currentView = "main";
      const mainView = this.querySelector(".fragrances-main-view");
      const feminineView = this.querySelector(".fragrances-feminine-view");
      const title = this.querySelector(".fragrances-modal-title");
      const backBtn = this.querySelector(".fragrances-back-btn");

      if (mainView && feminineView) {
        mainView.style.display = "block";
        mainView.style.transform = "translateX(0)";
        feminineView.style.display = "none";
        title.textContent = "Início";
        backBtn.classList.remove("visible");
        backBtn.style.opacity = "0";
      }
    }
  }

  render() {
    this.innerHTML = `
      <div class="fragrances-modal">
        <div class="fragrances-modal-backdrop"></div>
        
        <div class="fragrances-modal-container">
          <!-- Header -->
          <div class="fragrances-modal-header">
            <button class="fragrances-back-btn" aria-label="Voltar">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <h2 class="fragrances-modal-title">Início</h2>
            <button class="fragrances-modal-close" aria-label="Fechar menu">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <!-- Content Wrapper -->
          <div class="fragrances-views-wrapper">
            
            <!-- MAIN VIEW -->
            <div class="fragrances-main-view">
              <nav class="fragrances-modal-section">
                <ul class="fragrances-menu-list">
                  <li class="fragrances-menu-item">
                    <a href="/" class="fragrances-menu-link" data-route="/">
                      <span>Início</span>
                      <svg class="fragrances-menu-arrow" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </a>
                  </li>
                  <li class="fragrances-menu-item">
                    <a href="/dior-holiday" class="fragrances-menu-link gold" data-route="/dior-holiday">
                      <span>Dior Holiday</span>
                      <svg class="fragrances-menu-arrow" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </a>
                  </li>
                  <li class="fragrances-menu-item">
                    <a href="#" class="fragrances-menu-link" data-view="feminine">
                      <span>Fragrância Feminina</span>
                      <svg class="fragrances-menu-arrow" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </a>
                  </li>
                  <li class="fragrances-menu-item">
                    <a href="#" class="fragrances-menu-link">
                      <span>Fragrância Masculina</span>
                      <svg class="fragrances-menu-arrow" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </a>
                  </li>
                  <li class="fragrances-menu-item">
                    <a href="#" class="fragrances-menu-link">
                      <span>La Collection Privée</span>
                      <svg class="fragrances-menu-arrow" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </a>
                  </li>
                  <li class="fragrances-menu-item">
                    <a href="#" class="fragrances-menu-link">
                      <span>Maquiagem</span>
                      <svg class="fragrances-menu-arrow" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </a>
                  </li>
                  <li class="fragrances-menu-item">
                    <a href="#" class="fragrances-menu-link">
                      <span>Tratamento</span>
                      <svg class="fragrances-menu-arrow" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </a>
                  </li>
                  <li class="fragrances-menu-item">
                    <a href="#" class="fragrances-menu-link">
                      <span>Presentes</span>
                      <svg class="fragrances-menu-arrow" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </a>
                  </li>
                  <li class="fragrances-menu-item">
                    <a href="#" class="fragrances-menu-link">
                      <span>Serviços</span>
                      <svg class="fragrances-menu-arrow" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </a>
                  </li>
                  <li class="fragrances-menu-item">
                    <a href="#" class="fragrances-menu-link">
                      <span>Sobre Dior</span>
                      <svg class="fragrances-menu-arrow" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </a>
                  </li>
                </ul>
              </nav>

              <!-- Bottom Links -->
              <div class="fragrances-modal-bottom">
                <ul class="fragrances-bottom-list">
                  <li class="fragrances-bottom-item">
                    <a href="#" class="fragrances-bottom-link">Minha Conta</a>
                  </li>
                  <li class="fragrances-bottom-item">
                    <a href="#" class="fragrances-bottom-link">Contato</a>
                  </li>
                  <li class="fragrances-bottom-item">
                    <a href="#" class="fragrances-bottom-link">Entrega e Devoluções</a>
                  </li>
                  <li class="fragrances-bottom-item">
                    <a href="#" class="fragrances-bottom-link">FAQ</a>
                  </li>
                </ul>
              </div>
            </div>

            <!-- FEMININE VIEW -->
            <div class="fragrances-feminine-view" style="display: none;">
              <!-- Iconics Section -->
              <div class="feminine-section">
                <h3 class="feminine-section-title">ICONICS</h3>
                <div class="feminine-icons-grid">
                  <div class="feminine-icon-item">
                    <img src="/images/dioressence1.webp" alt="Miss Dior" class="feminine-icon-image">
                    <p class="feminine-icon-label">Miss Dior</p>
                  </div>
                  <div class="feminine-icon-item">
                    <img src="/images/dioressence2.webp" alt="J'adore" class="feminine-icon-image">
                    <p class="feminine-icon-label">J'adore</p>
                  </div>
                  <div class="feminine-icon-item">
                    <img src="/images/dioressence3.webp" alt="Poison" class="feminine-icon-image">
                    <p class="feminine-icon-label">Poison</p>
                  </div>
                </div>
              </div>

              <!-- Menu Items -->
              <nav class="feminine-menu-section">
                <ul class="feminine-menu-list">
                  <li class="feminine-menu-item">
                    <a href="#" class="feminine-menu-link">
                      <span>Novidades</span>
                      <svg class="fragrances-menu-arrow" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </a>
                  </li>
                  <li class="feminine-menu-item">
                    <a href="/dior-verao" class="feminine-menu-link" data-route="/dior-verao">
                      <span>Descubra</span>
                      <svg class="fragrances-menu-arrow" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </a>
                  </li>
                  <li class="feminine-menu-item">
                    <a href="#" class="feminine-menu-link">
                      <span>Linhas</span>
                      <svg class="fragrances-menu-arrow" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </a>
                  </li>
                  <li class="feminine-menu-item">
                    <a href="/miss-dior-essence" class="feminine-menu-link" data-route="/miss-dior-essence">
                      <span>Todas as Fragâncias Femininas</span>
                    </a>
                  </li>
                  <li class="feminine-menu-item">
                    <a href="#" class="feminine-menu-link">
                      <span>Expertise de Fragâncias</span>
                      <svg class="fragrances-menu-arrow" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </a>
                  </li>
                  <li class="feminine-menu-item">
                    <a href="#" class="feminine-menu-link">
                      <span>Criações Exclusivas</span>
                    </a>
                  </li>
                </ul>
              </nav>

              <!-- Featured Images -->
              <div class="feminine-featured-section">
                <div class="feminine-featured-card">
                  <img src="/images/produto3d.jpg" alt="Dior Holiday" class="feminine-featured-image">
                  <div class="feminine-featured-content">
                    <h4 class="feminine-featured-title">Dior Holiday: o Circo dos Sonhos</h4>
                    <a href="/dior-holiday" class="feminine-featured-link" data-route="/dior-holiday">Cheque mais perto</a>
                  </div>
                </div>
                <div class="feminine-featured-card">
                  <img src="/images/produto3d2.jpg" alt="Presentes Dior" class="feminine-featured-image">
                  <div class="feminine-featured-content">
                    <h4 class="feminine-featured-title">O desfile de presentes encantados da Dior</h4>
                    <a href="#" class="feminine-featured-link">Inspire-se</a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("fragrances-modal", FragrancesModal);
