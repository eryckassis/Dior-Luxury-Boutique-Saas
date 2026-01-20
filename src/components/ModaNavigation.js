// ============================================================================
// MODA NAVIGATION COMPONENT - Menu exclusivo para página Moda & Acessórios
// ============================================================================

export class ModaNavigation extends HTMLElement {
  constructor() {
    super();
    this.menuOpen = false;
    this.currentSubmenu = null;
  }

  connectedCallback() {
    this.render();
    this.initEventListeners();
    this.initMenuLinksAnimation();
    this.initScrollBehavior();
  }

  disconnectedCallback() {
    // Remove listener do scroll
    if (this._scrollCleanup) {
      this._scrollCleanup();
    }
  }

  initScrollBehavior() {
    const nav = this.querySelector(".moda-navigation");
    if (!nav) return;

    // Verifica se está dentro da página PresenteParaEla
    const isInPresenteParaEla = this.closest("presente-para-ela-page");

    if (isInPresenteParaEla) {
      // Na página PresenteParaEla, força o estado "scrolled" (fundo branco)
      nav.classList.add("scrolled");
      return; // Não adiciona listener de scroll
    }

    // =========================================================================
    // SMART NAVBAR - Hide on Scroll Down, Show on Scroll Up
    // =========================================================================
    let lastScrollY = window.scrollY;
    let ticking = false;
    const scrollThreshold = 80; // Mínimo de scroll para ativar hide/show
    const topThreshold = 100; // Sempre visível quando próximo do topo

    const updateNavVisibility = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;

      // Sempre visível no topo da página
      if (currentScrollY < topThreshold) {
        nav.classList.remove("nav-hidden");
        nav.classList.remove("scrolled"); // Fundo transparente no topo
        lastScrollY = currentScrollY;
        ticking = false;
        return;
      }

      // Fundo branco quando scrollado
      nav.classList.add("scrolled");

      // Scroll para baixo - esconde (apenas se passou do threshold)
      if (scrollDelta > 0 && currentScrollY > scrollThreshold) {
        nav.classList.add("nav-hidden");
      }
      // Scroll para cima - mostra
      else if (scrollDelta < -5) {
        nav.classList.remove("nav-hidden");
      }

      lastScrollY = currentScrollY;
      ticking = false;
    };

    // Usar requestAnimationFrame para performance
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateNavVisibility);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    // Cleanup ao desconectar
    this._scrollCleanup = () => {
      window.removeEventListener("scroll", onScroll);
    };
  }

  // =========================================================================
  // SUBMENU FUNCTIONS - Dior World e Desfiles
  // =========================================================================
  openSubmenu(submenuId) {
    const mainMenu = this.querySelector(".moda-menu-content");
    const submenu = this.querySelector(`[data-submenu-id="${submenuId}"]`);
    const sideMenu = this.querySelector(".moda-side-menu");
    const cards = submenu ? submenu.querySelectorAll(".submenu-card") : [];
    const cardImages = submenu
      ? submenu.querySelectorAll(".submenu-card img")
      : [];

    if (!mainMenu || !submenu) return;

    this.currentSubmenu = submenuId;

    // Expande o menu lateral para mostrar os cards
    if (sideMenu) {
      sideMenu.classList.add("submenu-expanded");
    }

    if (window.gsap) {
      // Desliza menu principal para esquerda
      window.gsap.to(mainMenu, {
        x: "-100%",
        duration: 0.5,
        ease: "power3.inOut",
      });

      // Desliza submenu da direita
      window.gsap.fromTo(
        submenu,
        { x: "100%", display: "flex" },
        {
          x: "0%",
          duration: 0.5,
          ease: "power3.inOut",
          onComplete: () => {
            // Smooth Image Reveal com clipPath e scale
            window.gsap.fromTo(
              cardImages,
              {
                scale: 1.2,
                opacity: 0,
                clipPath: "inset(100% 0% 0% 0%)",
              },
              {
                scale: 1,
                opacity: 1,
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 1.2,
                stagger: {
                  amount: 0.3,
                  from: "start",
                },
                ease: "power3.out",
              },
            );

            // Anima labels dos cards
            const cardLabels = submenu.querySelectorAll(".submenu-card-label");
            window.gsap.fromTo(
              cardLabels,
              { y: 30, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.12,
                delay: 0.4,
                ease: "power3.out",
              },
            );
          },
        },
      );
    }
  }

  closeSubmenu() {
    if (!this.currentSubmenu) return;

    const mainMenu = this.querySelector(".moda-menu-content");
    const submenu = this.querySelector(
      `[data-submenu-id="${this.currentSubmenu}"]`,
    );
    const sideMenu = this.querySelector(".moda-side-menu");
    const cards = submenu ? submenu.querySelectorAll(".submenu-card") : [];

    if (!mainMenu || !submenu) return;

    if (window.gsap) {
      // Anima cards saindo primeiro
      window.gsap.to(cards, {
        opacity: 0,
        y: 30,
        duration: 0.3,
        stagger: 0.05,
        ease: "power2.in",
      });

      // Volta menu principal
      window.gsap.to(mainMenu, {
        x: "0%",
        duration: 0.6,
        delay: 0.2,
        ease: "power3.inOut",
      });

      // Esconde submenu para direita com animação suave
      window.gsap.to(submenu, {
        x: "100%",
        duration: 0.6,
        delay: 0.2,
        ease: "power3.inOut",
        onComplete: () => {
          // Cleanup tech lead: Remove do DOM e reseta estilos
          submenu.style.display = "none";
          submenu.style.transform = "";

          // Reseta cards para próxima abertura
          window.gsap.set(cards, {
            opacity: 1,
            y: 0,
            clearProps: "all",
          });

          // Recolhe o menu lateral após animação completa
          if (sideMenu) {
            sideMenu.classList.remove("submenu-expanded");
          }
        },
      });
    } else {
      // Fallback sem GSAP
      sideMenu.classList.remove("submenu-expanded");
      submenu.style.display = "none";
    }

    this.currentSubmenu = null;
  }

  initMenuLinksAnimation() {
    requestAnimationFrame(() => {
      if (!window.gsap) return;

      const menuLinks = this.querySelectorAll(".moda-menu-link");

      menuLinks.forEach((link) => {
        // Mouseenter - linha cresce de 0 para 100%
        link.addEventListener("mouseenter", () => {
          window.gsap.to(link, {
            "--underline-width": "100%",
            duration: 0.35,
            ease: "power2.inOut",
          });
        });

        // Mouseleave - linha volta para 0%
        link.addEventListener("mouseleave", () => {
          window.gsap.to(link, {
            "--underline-width": "0%",
            duration: 0.35,
            ease: "power2.inOut",
          });
        });
      });

      // Animação para links do submenu
      const submenuLinks = this.querySelectorAll(
        ".submenu-link, .submenu-sublink",
      );
      submenuLinks.forEach((link) => {
        // Não animar links ativos
        if (
          link.classList.contains("submenu-link-active") ||
          link.classList.contains("submenu-sublink-active")
        ) {
          return;
        }

        link.addEventListener("mouseenter", () => {
          window.gsap.to(link, {
            "--underline-width": "100%",
            duration: 0.35,
            ease: "power2.inOut",
          });
        });

        link.addEventListener("mouseleave", () => {
          window.gsap.to(link, {
            "--underline-width": "0%",
            duration: 0.35,
            ease: "power2.inOut",
          });
        });
      });

      // Animação para labels dos cards
      const cardLabels = this.querySelectorAll(".submenu-card-label");
      cardLabels.forEach((label) => {
        const card = label.closest(".submenu-card");

        if (card) {
          card.addEventListener("mouseenter", () => {
            window.gsap.to(label, {
              "--underline-width": "100%",
              duration: 0.35,
              ease: "power2.inOut",
            });
          });

          card.addEventListener("mouseleave", () => {
            window.gsap.to(label, {
              "--underline-width": "0%",
              duration: 0.35,
              ease: "power2.inOut",
            });
          });
        }
      });
    });
  }

  initEventListeners() {
    const hamburger = this.querySelector(".moda-nav-hamburger");
    const searchBtn = this.querySelector(".moda-nav-search");
    const sideMenu = this.querySelector(".moda-side-menu");
    const backdrop = this.querySelector(".moda-side-menu-backdrop");
    const closeBtn = this.querySelector(".moda-side-menu-close");

    // Toggle menu
    if (hamburger) {
      hamburger.addEventListener("click", () => this.toggleMenu());
    }

    // Close menu
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.closeMenu());
    }

    if (backdrop) {
      backdrop.addEventListener("click", () => this.closeMenu());
    }

    // Search (placeholder)
    if (searchBtn) {
      searchBtn.addEventListener("click", () => {
        console.log("Search clicked");
      });
    }

    // Links com submenu
    const submenuTriggers = this.querySelectorAll(
      ".moda-menu-link.has-submenu",
    );
    submenuTriggers.forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        const submenuId = trigger.getAttribute("data-submenu");
        this.openSubmenu(submenuId);
      });
    });

    // Botões de voltar nos submenus
    const backButtons = this.querySelectorAll(".submenu-back-btn");
    backButtons.forEach((btn) => {
      btn.addEventListener("click", () => this.closeSubmenu());
    });

    // Botão fechar do submenu (fecha menu inteiro)
    const submenuCloseBtn = this.querySelector(".submenu-close-btn");
    if (submenuCloseBtn) {
      submenuCloseBtn.addEventListener("click", () => this.closeMenu());
    }

    // Acessibilidade - Alto Contraste
    const accessibilityToggle = this.querySelector(".moda-menu-checkbox");
    if (accessibilityToggle) {
      // Restaura estado salvo
      const highContrast =
        localStorage.getItem("dior-high-contrast") === "true";
      accessibilityToggle.checked = highContrast;
      if (highContrast) {
        document.body.classList.add("high-contrast");
      }

      accessibilityToggle.addEventListener("change", (e) => {
        if (e.target.checked) {
          document.body.classList.add("high-contrast");
          localStorage.setItem("dior-high-contrast", "true");
        } else {
          document.body.classList.remove("high-contrast");
          localStorage.setItem("dior-high-contrast", "false");
        }
      });
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    const sideMenu = this.querySelector(".moda-side-menu");
    const backdrop = this.querySelector(".moda-side-menu-backdrop");
    const hamburger = this.querySelector(".moda-nav-hamburger");
    const lines = hamburger.querySelectorAll("line");
    const menuLinks = this.querySelectorAll(".moda-menu-link");

    if (this.menuOpen) {
      // Remove display none antes de abrir
      sideMenu.style.display = "block";
      backdrop.style.display = "block";

      // Anima backdrop e side menu com GSAP
      if (window.gsap) {
        // Backdrop fade in
        window.gsap.fromTo(
          backdrop,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
            onStart: () => backdrop.classList.add("active"),
          },
        );

        // Side menu slide in
        window.gsap.fromTo(
          sideMenu,
          { x: -400, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            onStart: () => sideMenu.classList.add("active"),
          },
        );

        // Anima hamburguer para X (2 linhas)
        window.gsap.to(lines[0], {
          attr: { y1: 12, y2: 12, x1: 3, x2: 21 },
          rotation: 45,
          transformOrigin: "center",
          duration: 0.4,
          ease: "power2.inOut",
        });

        window.gsap.to(lines[1], {
          attr: { y1: 12, y2: 12, x1: 3, x2: 21 },
          rotation: -45,
          transformOrigin: "center",
          duration: 0.4,
          ease: "power2.inOut",
        });

        // Anima os links do menu entrando
        window.gsap.fromTo(
          menuLinks,
          {
            x: -50,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.06,
            ease: "power2.out",
            delay: 0.3,
          },
        );
      }
    } else {
      // Anima saída com GSAP
      if (window.gsap) {
        window.gsap.to(backdrop, {
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
          onComplete: () => {
            backdrop.classList.remove("active");
            backdrop.style.display = "none";
          },
        });

        window.gsap.to(sideMenu, {
          x: -400,
          opacity: 0,
          duration: 0.5,
          ease: "power3.in",
          onComplete: () => {
            sideMenu.classList.remove("active");
            sideMenu.classList.remove("submenu-expanded");
            sideMenu.style.display = "none";
          },
        });
      } else {
        backdrop.classList.remove("active");
        sideMenu.classList.remove("active");
        sideMenu.classList.remove("submenu-expanded");

        // Fallback cleanup
        setTimeout(() => {
          if (!this.menuOpen) {
            sideMenu.style.display = "none";
            backdrop.style.display = "none";
          }
        }, 400);
      }

      // Volta hamburguer ao estado normal (2 linhas)
      if (window.gsap) {
        window.gsap.to(lines[0], {
          attr: { y1: 8, y2: 8, x1: 3, x2: 21 },
          rotation: 0,
          duration: 0.4,
          ease: "power2.inOut",
        });

        window.gsap.to(lines[1], {
          attr: { y1: 16, y2: 16, x1: 3, x2: 21 },
          rotation: 0,
          duration: 0.4,
          ease: "power2.inOut",
        });
      }
    }
  }

  closeMenu() {
    this.menuOpen = false;

    // Fecha submenu se aberto
    if (this.currentSubmenu) {
      this.closeSubmenu();
    }

    const sideMenu = this.querySelector(".moda-side-menu");
    const backdrop = this.querySelector(".moda-side-menu-backdrop");
    const hamburger = this.querySelector(".moda-nav-hamburger");
    const lines = hamburger.querySelectorAll("line");

    backdrop.classList.remove("active");
    sideMenu.classList.remove("active");
    sideMenu.classList.remove("submenu-expanded");

    // Cleanup: Remove do DOM após transição (tech lead best practice)
    setTimeout(() => {
      if (!this.menuOpen) {
        sideMenu.style.display = "none";
        backdrop.style.display = "none";
      }
    }, 400); // Match transition duration

    // Volta hamburguer ao estado normal (2 linhas)
    if (window.gsap) {
      window.gsap.to(lines[0], {
        attr: { y1: 8, y2: 8, x1: 3, x2: 21 },
        rotation: 0,
        duration: 0.3,
        ease: "power2.inOut",
      });

      window.gsap.to(lines[1], {
        attr: { y1: 16, y2: 16, x1: 3, x2: 21 },
        rotation: 0,
        duration: 0.3,
        ease: "power2.inOut",
      });
    }
  }

  render() {
    this.innerHTML = `
      <!-- Navigation Bar -->
      <nav class="moda-navigation">
        <!-- Hamburger Menu (Esquerda) -->
        <button class="moda-nav-hamburger" aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="8" x2="21" y2="8"></line>
            <line x1="3" y1="16" x2="21" y2="16"></line>
          </svg>
        </button>

        <!-- Logo Dior (Centro) -->
        <div class="moda-nav-logo">
          <a href="/" class="moda-logo-link" data-route="/">
            <img
              src="/images/Design sem nome (6).svg"
              alt="Dior Logo"
              width="140"
              height="32"
            />
          </a>
        </div>

        <!-- Search (Direita) -->
        <button class="moda-nav-search" aria-label="Search">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </button>
      </nav>

      <!-- Side Menu Backdrop -->
      <div class="moda-side-menu-backdrop"></div>

      <!-- Side Menu -->
      <div class="moda-side-menu">
        <div class="moda-side-menu-header">
          <button class="moda-side-menu-close" aria-label="Close Menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="moda-menu-content">
          <nav class="moda-menu-nav">
            <a href="#presentes" class="moda-menu-link">Presentes</a>
            <a href="#novidades" class="moda-menu-link">Novidades</a>
            <a href="#moda-feminina" class="moda-menu-link">Moda Feminina</a>
            <a href="#moda-masculina" class="moda-menu-link">Moda masculina</a>
            <a href="#bolsas" class="moda-menu-link">Bolsas</a>
            <a href="#joalheria" class="moda-menu-link">Joalheria e relojoaria</a>
            <a href="#alta-costura" class="moda-menu-link">Alta-costura</a>
            <a href="#dior-world" class="moda-menu-link has-submenu" data-submenu="dior-world">Dior World e desfiles</a>
          </nav>

          <div class="moda-menu-contact">
            <h3 class="moda-menu-contact-title">Contato</h3>
            <a href="#encontrar-boutique" class="moda-menu-contact-link">Encontrar uma boutique</a>
            <a href="#pais-regiao" class="moda-menu-contact-link">País/Região: Brasil (Português)</a>
          </div>

          <div class="moda-menu-footer">
            <label class="moda-menu-accessibility">
              <span>Acessibilidade: melhorar o contraste</span>
              <input type="checkbox" class="moda-menu-checkbox" />
            </label>

            <div class="moda-menu-tabs">
              <a href="/moda-acessorios" class="moda-menu-tab moda-menu-tab-active">Moda & Acessórios</a>
              <a href="/" class="moda-menu-tab">Perfume & Cosméticos</a>
            </div>
          </div>
        </div>

        <!-- Submenu: Dior World e Desfiles -->
        <div class="submenu-panel submenu-dior-world" data-submenu-id="dior-world" style="display: none;">
          <div class="submenu-dior-world-content">
            <!-- Coluna Esquerda: X Fechar + Breadcrumb + Links -->
            <div class="submenu-left-column">
              <!-- Header com X Fechar -->
              <div class="submenu-top-header">
                <button class="submenu-close-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  <span>Fechar</span>
                </button>
              </div>
              
              <!-- Breadcrumb -->
              <div class="submenu-breadcrumb">
                <button class="submenu-back-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                </button>
                <span class="breadcrumb-text">
                  <span class="breadcrumb-parent">Dior World e desfiles</span>
                  <span class="breadcrumb-separator">/</span>
                  <span class="breadcrumb-current">Desfiles</span>
                </span>
              </div>
              
              <nav class="submenu-links">
                <a href="#novidades-eventos" class="submenu-link">Novidades e eventos</a>
                <a href="#desfiles" class="submenu-link submenu-link-active">Desfiles</a>
                <a href="#historia" class="submenu-link">História</a>
                <a href="#compromissos" class="submenu-link">Nossos compromissos</a>
              </nav>
            </div>
            
            <!-- Coluna Centro: Sub-links -->
            <div class="submenu-center-column">
              <nav class="submenu-sublinks">
                <a href="/primavera-verao-2026" class="submenu-sublink submenu-sublink-active" data-route="/primavera-verao-2026">Primavera-Verão 2026</a>
                <a href="#verao-2026" class="submenu-sublink">Verão 2026</a>
                <a href="#croisiere-2026" class="submenu-sublink">Croisière 2026</a>
                <a href="#outono-2025" class="submenu-sublink">Outono 2025</a>
              </nav>
            </div>
            
            <!-- Coluna Direita: Cards Grid - Ocupa altura total -->
            <div class="submenu-right-column">
              <div class="submenu-cards-grid">
                <a href="/primavera-verao-2026" class="submenu-card" data-route="/primavera-verao-2026">
                  <img src="/images/2026.avif" alt="Primavera-Verão 2026" />
                  <span class="submenu-card-label">Primavera-Verão 2026</span>
                </a>
                <a href="#verao-2026" class="submenu-card">
                  <img src="/images/2026.2.avif" alt="Verão 2026" />
                  <span class="submenu-card-label">Verão 2026</span>
                </a>
                <a href="#croisiere-2026" class="submenu-card">
                  <img src="/images/2026.3.avif" alt="Croisière 2026" />
                  <span class="submenu-card-label">Croisière 2026</span>
                </a>
                <a href="#outono-2025" class="submenu-card">
                  <img src="/images/2026.4.avif" alt="Outono 2025" />
                  <span class="submenu-card-label">Outono 2025</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("moda-navigation", ModaNavigation);
