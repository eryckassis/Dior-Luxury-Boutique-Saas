// ============================================================================
// APP NAVIGATION COMPONENT - Navegação principal com menu multinível
// ============================================================================
import { cartService } from "../services/CartService.js";
import { router } from "../router/router.js";

export class AppNavigation extends HTMLElement {
  constructor() {
    super();
    this.menuOpen = false;
    this.currentSubmenu = null;
    this.spaExpanded = false;
    this.fragranceExpanded = false;

    // Listener para atualizar o badge quando o carrinho mudar
    this.cartListener = () => {
      this.updateBagBadge();
    };
  }

  connectedCallback() {
    this.render();
    this.initEventListeners();
    this.initMenuLinksAnimation();
    this.initScrollBehavior();
    this.initSearchIconAnimation();
    this.initProfileMenu();
    this.updateBagBadge();

    // Adiciona listener para mudanças no carrinho
    cartService.addListener(this.cartListener);
  }

  disconnectedCallback() {
    // Remove listener do carrinho
    cartService.removeListener(this.cartListener);

    // Remove listener do scroll
    if (this._scrollCleanup) {
      this._scrollCleanup();
    }

    // Cleanup do painel Spa
    if (this.spaExpanded) {
      this.closeSpaPanel();
    }
  }

  initScrollBehavior() {
    const nav = this.querySelector(".moda-navigation");
    if (!nav) return;

    // Perfume e Cosméticos sempre com fundo branco
    nav.classList.add("scrolled");

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
        lastScrollY = currentScrollY;
        ticking = false;
        return;
      }

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

  initMenuLinksAnimation() {
    requestAnimationFrame(() => {
      if (!window.gsap) return;

      // Todos os links do menu principal (com e sem submenu)
      const menuLinks = this.querySelectorAll(".moda-menu-link");

      menuLinks.forEach((link) => {
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

      // Links dos submenus também
      const submenuLinks = this.querySelectorAll(".submenu-link");

      submenuLinks.forEach((link) => {
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

      // Animação hover para cards de fragrância
      const fragranceCards = this.querySelectorAll(".fragrance-card");

      fragranceCards.forEach((card) => {
        const subtitle = card.querySelector(".fragrance-card-subtitle");
        const img = card.querySelector("img");

        if (subtitle) {
          card.addEventListener("mouseenter", () => {
            // Anima underline do subtítulo
            window.gsap.to(subtitle, {
              "--underline-width": "100%",
              duration: 0.4,
              ease: "power2.out",
            });
            // Scale na imagem
            if (img) {
              window.gsap.to(img, {
                scale: 1.05,
                duration: 0.6,
                ease: "power2.out",
              });
            }
          });

          card.addEventListener("mouseleave", () => {
            // Remove underline
            window.gsap.to(subtitle, {
              "--underline-width": "0%",
              duration: 0.4,
              ease: "power2.out",
            });
            // Reset scale
            if (img) {
              window.gsap.to(img, {
                scale: 1,
                duration: 0.6,
                ease: "power2.out",
              });
            }
          });
        }
      });

      // Animação hover para cards de Alta Perfumaria
      const altaPerfumariaCards = this.querySelectorAll(
        ".alta-perfumaria-card",
      );

      altaPerfumariaCards.forEach((card) => {
        const cta = card.querySelector(".alta-perfumaria-card-cta");
        const img = card.querySelector("img");

        if (cta) {
          card.addEventListener("mouseenter", () => {
            // Anima underline do CTA
            window.gsap.to(cta, {
              "--underline-width": "100%",
              duration: 0.4,
              ease: "power2.out",
            });
            // Scale na imagem
            if (img) {
              window.gsap.to(img, {
                scale: 1.05,
                duration: 0.6,
                ease: "power2.out",
              });
            }
          });

          card.addEventListener("mouseleave", () => {
            // Remove underline
            window.gsap.to(cta, {
              "--underline-width": "0%",
              duration: 0.4,
              ease: "power2.out",
            });
            // Reset scale
            if (img) {
              window.gsap.to(img, {
                scale: 1,
                duration: 0.6,
                ease: "power2.out",
              });
            }
          });
        }
      });
    });
  }

  initSearchIconAnimation() {
    requestAnimationFrame(() => {
      const searchContainer = this.querySelector(".search-container");
      const searchInput = this.querySelector(".search-input");
      const searchBtn = this.querySelector(".search-icon-btn");

      if (!searchContainer || !searchInput || !searchBtn || !window.gsap)
        return;

      // Estado inicial - input escondido
      window.gsap.set(searchInput, {
        width: 0,
        opacity: 0,
        paddingLeft: 0,
        paddingRight: 0,
      });

      // Hover enter no container
      searchContainer.addEventListener("mouseenter", () => {
        window.gsap.to(searchInput, {
          width: 200,
          opacity: 1,
          paddingLeft: 16,
          paddingRight: 16,
          duration: 0.4,
          ease: "power2.out",
        });
      });

      // Hover leave no container
      searchContainer.addEventListener("mouseleave", () => {
        if (document.activeElement !== searchInput) {
          window.gsap.to(searchInput, {
            width: 0,
            opacity: 0,
            paddingLeft: 0,
            paddingRight: 0,
            duration: 0.3,
            ease: "power2.in",
          });
        }
      });

      // Mantém aberto quando input está focado
      searchInput.addEventListener("blur", () => {
        window.gsap.to(searchInput, {
          width: 0,
          opacity: 0,
          paddingLeft: 0,
          paddingRight: 0,
          duration: 0.3,
          ease: "power2.in",
        });
      });
    });
  }

  initProfileMenu() {
    requestAnimationFrame(() => {
      const profileBtn = this.querySelector(".nav-icon-btn.profile-btn");
      const bagBtn = this.querySelector(".bag-btn-container");
      const profileMenu = document.querySelector("profile-menu");

      if (!profileMenu) return;

      // Botão de perfil abre na aba "account"
      if (profileBtn) {
        profileBtn.addEventListener("click", () => {
          profileMenu.open("account");
        });
      }

      // Botão de sacola abre na aba "bag"
      if (bagBtn) {
        bagBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          profileMenu.open("bag");
        });
      }
    });
  }

  initEventListeners() {
    const hamburger = this.querySelector(".moda-nav-hamburger");
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

    // Botões de voltar nos submenus (exceto o botão Spa)
    const backButtons = this.querySelectorAll(
      ".submenu-back-btn[data-tratamento-back], .submenu-back-btn:not([data-spa-back]):not([data-tratamento-back])",
    );
    backButtons.forEach((btn) => {
      btn.addEventListener("click", () => this.closeSubmenu());
    });

    // Botão de voltar do Spa (fecha apenas o painel Spa)
    const spaBackBtn = this.querySelector("[data-spa-back]");
    if (spaBackBtn) {
      spaBackBtn.addEventListener("click", () => this.closeSpaPanel());
    }

    // Navegação dos links do menu (sem submenu)
    const menuLinks = this.querySelectorAll(
      ".moda-menu-link[data-route]:not(.has-submenu), .submenu-link[data-route]",
    );
    menuLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const route = link.getAttribute("data-route");
        this.closeMenu();
        setTimeout(() => {
          router.navigate(route);
        }, 400);
      });
    });

    // Dior Spa expansion trigger
    const spaTrigger = this.querySelector("[data-spa-trigger]");
    if (spaTrigger) {
      spaTrigger.addEventListener("click", (e) => {
        e.preventDefault();
        this.openSpaPanel();
      });
    }

    // Alta Perfumaria expansion trigger
    const altaPerfumariaTrigger = this.querySelector(
      "[data-alta-perfumaria-trigger]",
    );
    if (altaPerfumariaTrigger) {
      altaPerfumariaTrigger.addEventListener("click", (e) => {
        e.preventDefault();
        this.openAltaPerfumariaPanel();
      });
    }

    // Botão de voltar do Alta Perfumaria - volta ao menu principal
    const altaPerfumariaBackBtn = this.querySelector(
      "[data-alta-perfumaria-back]",
    );
    if (altaPerfumariaBackBtn) {
      altaPerfumariaBackBtn.addEventListener("click", () => {
        // Fecha Alta Perfumaria e volta direto ao menu principal
        this.closeSubmenu();
      });
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

    // Toggle Button - Moda & Acessórios / Perfume & Cosméticos
    this.setupToggleTabs();
  }

  // ============================================================================
  // TOGGLE TABS - Alternância entre Moda & Acessórios e Perfume & Cosméticos
  // ============================================================================
  setupToggleTabs() {
    const tabs = this.querySelectorAll(".moda-menu-tab");

    tabs.forEach((tab) => {
      tab.addEventListener("click", (e) => {
        e.preventDefault();

        // Remove active de todos
        tabs.forEach((t) => t.classList.remove("moda-menu-tab-active"));

        // Adiciona active no clicado
        tab.classList.add("moda-menu-tab-active");

        // Navega para a rota após animação
        const route = tab.getAttribute("data-route");
        this.closeMenu();
        setTimeout(() => {
          router.navigate(route);
        }, 400);
      });
    });

    // Atualiza o tab ativo baseado na rota atual
    this.updateActiveTab();
  }

  updateActiveTab() {
    const currentPath = window.location.pathname;
    const tabs = this.querySelectorAll(".moda-menu-tab");

    tabs.forEach((tab) => {
      const route = tab.getAttribute("data-route");
      tab.classList.remove("moda-menu-tab-active");

      // Verifica se a rota atual corresponde ao tab
      if (
        route === currentPath ||
        (route === "/moda-acessorios" && currentPath.startsWith("/moda")) ||
        (route === "/" && !currentPath.startsWith("/moda"))
      ) {
        tab.classList.add("moda-menu-tab-active");
      }
    });
  }

  // ============================================================================
  // DIOR SPA PANEL - Expansão do painel dentro do menu
  // ============================================================================
  openSpaPanel() {
    const sideMenu = this.querySelector(".moda-side-menu");
    const spaPanel = this.querySelector("[data-spa-panel]");
    const tratamentoPanel = this.querySelector(
      '[data-submenu-id="tratamento"]',
    );
    const spaBackBtn = this.querySelector("[data-spa-back]");
    const tratamentoBackBtn = this.querySelector("[data-tratamento-back]");

    if (!sideMenu || !spaPanel) return;

    this.spaExpanded = true;

    // Atualiza os botões de voltar
    if (spaBackBtn) spaBackBtn.style.display = "flex";
    if (tratamentoBackBtn) tratamentoBackBtn.style.display = "none";

    if (window.gsap) {
      // Expande o menu lateral
      sideMenu.classList.add("spa-expanded");
      if (tratamentoPanel) tratamentoPanel.classList.add("spa-open");

      // Anima o painel Spa entrando da direita
      window.gsap.to(spaPanel, {
        left: "380px",
        opacity: 1,
        visibility: "visible",
        duration: 0.4,
        ease: "power2.out",
        onStart: () => {
          spaPanel.classList.add("active");
        },
      });

      // Anima os links do Spa com stagger
      const spaLinks = spaPanel.querySelectorAll(".spa-location-link");
      window.gsap.fromTo(
        spaLinks,
        { opacity: 0, x: 20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.3,
          stagger: 0.05,
          delay: 0.2,
          ease: "power2.out",
        },
      );
    }
  }

  closeSpaPanel() {
    const sideMenu = this.querySelector(".moda-side-menu");
    const spaPanel = this.querySelector("[data-spa-panel]");
    const tratamentoPanel = this.querySelector(
      '[data-submenu-id="tratamento"]',
    );
    const spaBackBtn = this.querySelector("[data-spa-back]");
    const tratamentoBackBtn = this.querySelector("[data-tratamento-back]");

    if (!spaPanel) return;

    this.spaExpanded = false;

    // Restaura os botões de voltar
    if (spaBackBtn) spaBackBtn.style.display = "none";
    if (tratamentoBackBtn) tratamentoBackBtn.style.display = "flex";

    if (window.gsap) {
      // Anima o painel Spa saindo
      window.gsap.to(spaPanel, {
        left: "100%",
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          spaPanel.style.visibility = "hidden";
          spaPanel.classList.remove("active");
          if (sideMenu) {
            sideMenu.classList.remove("spa-expanded");
          }
          if (tratamentoPanel) {
            tratamentoPanel.classList.remove("spa-open");
          }
        },
      });
    }
  }

  // ============================================================================
  // ALTA PERFUMARIA PANEL - Painel de terceiro nível expandido
  // ============================================================================
  openAltaPerfumariaPanel() {
    const sideMenu = this.querySelector(".moda-side-menu");
    const altaPerfumariaPanel = this.querySelector(
      "[data-alta-perfumaria-panel]",
    );
    const fragranciaPanel = this.querySelector(
      '[data-submenu-id="fragrancia-feminina"]',
    );
    const fragranciaBackBtn = this.querySelector(
      '.submenu-panel[data-submenu-id="fragrancia-feminina"] > .submenu-header .submenu-back-btn',
    );
    const altaPerfumariaBackBtn = this.querySelector(
      "[data-alta-perfumaria-back]",
    );

    if (!altaPerfumariaPanel) return;

    this.altaPerfumariaExpanded = true;

    // Mostra botão de voltar do Alta Perfumaria, esconde o de Fragrância
    if (fragranciaBackBtn) fragranciaBackBtn.style.display = "none";
    if (altaPerfumariaBackBtn) altaPerfumariaBackBtn.style.display = "flex";

    // Detecta se é mobile
    const isMobile = window.innerWidth <= 768;

    // Mostra o painel - em mobile usa block, em desktop usa flex
    altaPerfumariaPanel.style.visibility = "visible";
    altaPerfumariaPanel.style.display = isMobile ? "block" : "flex";

    if (isMobile) {
      // Em mobile, usar transição CSS simples
      sideMenu.classList.add("alta-perfumaria-expanded");

      // Força reflow para garantir que a transição funcione
      altaPerfumariaPanel.offsetHeight;

      altaPerfumariaPanel.classList.add("active");
      altaPerfumariaPanel.style.transform = "translateX(0)";
      altaPerfumariaPanel.style.opacity = "1";
    } else if (window.gsap) {
      // Em desktop, usar GSAP
      window.gsap.to(sideMenu, {
        width: "900px",
        duration: 0.5,
        ease: "power2.out",
        onStart: () => {
          sideMenu.classList.add("alta-perfumaria-expanded");
        },
      });

      window.gsap.fromTo(
        altaPerfumariaPanel,
        { x: "100%", opacity: 0 },
        {
          x: "0%",
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
          onComplete: () => {
            altaPerfumariaPanel.classList.add("active");

            // Anima os cards com reveal
            const cardImages = altaPerfumariaPanel.querySelectorAll(
              ".alta-perfumaria-card img",
            );

            if (cardImages.length) {
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
                  duration: 1,
                  stagger: 0.15,
                  ease: "power3.out",
                },
              );
            }
          },
        },
      );
    }
  }

  closeAltaPerfumariaPanel() {
    const sideMenu = this.querySelector(".moda-side-menu");
    const altaPerfumariaPanel = this.querySelector(
      "[data-alta-perfumaria-panel]",
    );
    const fragranciaBackBtn = this.querySelector(
      '.submenu-panel[data-submenu-id="fragrancia-feminina"] > .submenu-header .submenu-back-btn',
    );
    const altaPerfumariaBackBtn = this.querySelector(
      "[data-alta-perfumaria-back]",
    );

    if (!altaPerfumariaPanel) return;

    this.altaPerfumariaExpanded = false;

    // Restaura os botões de voltar
    if (fragranciaBackBtn) fragranciaBackBtn.style.display = "flex";
    if (altaPerfumariaBackBtn) altaPerfumariaBackBtn.style.display = "none";

    // Detecta se é mobile
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      // Em mobile, usar transição CSS simples
      altaPerfumariaPanel.classList.remove("active");
      altaPerfumariaPanel.style.transform = "translateX(100%)";
      altaPerfumariaPanel.style.opacity = "0";

      setTimeout(() => {
        altaPerfumariaPanel.style.visibility = "hidden";
        altaPerfumariaPanel.style.display = "none";
        sideMenu.classList.remove("alta-perfumaria-expanded");
      }, 300);
    } else if (window.gsap) {
      // Em desktop, usar GSAP
      window.gsap.to(sideMenu, {
        width: "650px",
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          sideMenu.classList.remove("alta-perfumaria-expanded");
        },
      });

      window.gsap.to(altaPerfumariaPanel, {
        x: "100%",
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          altaPerfumariaPanel.style.visibility = "hidden";
          altaPerfumariaPanel.style.display = "none";
          altaPerfumariaPanel.classList.remove("active");
        },
      });
    }
  }

  openSubmenu(submenuId) {
    const mainMenu = this.querySelector(".main-menu-content");
    const submenu = this.querySelector(`[data-submenu-id="${submenuId}"]`);
    const sideMenu = this.querySelector(".moda-side-menu");

    if (!mainMenu || !submenu) return;

    this.currentSubmenu = submenuId;

    // Verifica se é fragrância feminina para expandir o menu
    const isFragranceFeminina = submenuId === "fragrancia-feminina";

    if (window.gsap) {
      // Se for fragrância feminina, expande o menu com animação
      if (isFragranceFeminina && sideMenu) {
        this.fragranceExpanded = true;

        // Adiciona classe e anima a largura
        window.gsap.to(sideMenu, {
          width: "650px",
          duration: 0.5,
          ease: "power2.out",
          onStart: () => {
            sideMenu.classList.add("fragrance-expanded");
            submenu.classList.add("submenu-expanded");
          },
        });

        // Anima os cards com stagger após o menu expandir
        setTimeout(() => {
          const cards = submenu.querySelectorAll(".fragrance-card");
          if (cards.length) {
            window.gsap.fromTo(
              cards,
              { opacity: 0, y: 30, scale: 0.95 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.4,
                stagger: 0.08,
                ease: "power2.out",
              },
            );
          }
        }, 300);
      }

      // Desliza menu principal para esquerda
      window.gsap.to(mainMenu, {
        x: "-100%",
        duration: 0.4,
        ease: "power2.inOut",
      });

      // Desliza submenu da direita
      window.gsap.fromTo(
        submenu,
        { x: "100%", display: "block" },
        { x: "0%", duration: 0.4, ease: "power2.inOut" },
      );
    }
  }

  closeSubmenu() {
    if (!this.currentSubmenu) return;

    const sideMenu = this.querySelector(".moda-side-menu");
    const isMobile = window.innerWidth <= 768;

    // Fecha painel Alta Perfumaria se estiver aberto
    if (this.altaPerfumariaExpanded) {
      this.closeAltaPerfumariaPanel();
    }

    // Fecha expansão de fragrância se estiver aberta
    if (this.fragranceExpanded && sideMenu) {
      this.fragranceExpanded = false;

      if (isMobile) {
        // Em mobile, apenas remove as classes
        sideMenu.classList.remove("fragrance-expanded");
        sideMenu.classList.remove("alta-perfumaria-expanded");
        const submenu = this.querySelector(
          `[data-submenu-id="${this.currentSubmenu}"]`,
        );
        if (submenu) submenu.classList.remove("submenu-expanded");
      } else if (window.gsap) {
        window.gsap.to(sideMenu, {
          width: "460px",
          duration: 0.4,
          ease: "power2.inOut",
          onComplete: () => {
            sideMenu.classList.remove("fragrance-expanded");
            sideMenu.classList.remove("alta-perfumaria-expanded");
            const submenu = this.querySelector(
              `[data-submenu-id="${this.currentSubmenu}"]`,
            );
            if (submenu) submenu.classList.remove("submenu-expanded");
          },
        });
      }
    }

    // Fecha o painel Spa se estiver aberto
    if (this.spaExpanded) {
      this.closeSpaPanel();
    }

    const mainMenu = this.querySelector(".main-menu-content");
    const submenu = this.querySelector(
      `[data-submenu-id="${this.currentSubmenu}"]`,
    );

    if (!mainMenu || !submenu) return;

    if (isMobile) {
      // Em mobile, usar transições CSS simples
      mainMenu.style.transform = "translateX(0)";
      submenu.style.transform = "translateX(100%)";
      setTimeout(() => {
        submenu.style.display = "none";
      }, 300);
    } else if (window.gsap) {
      // Volta menu principal
      window.gsap.to(mainMenu, {
        x: "0%",
        duration: 0.4,
        ease: "power2.inOut",
      });

      // Esconde submenu para direita
      window.gsap.to(submenu, {
        x: "100%",
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          submenu.style.display = "none";
        },
      });
    }

    this.currentSubmenu = null;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    const sideMenu = this.querySelector(".moda-side-menu");
    const backdrop = this.querySelector(".moda-side-menu-backdrop");
    const hamburger = this.querySelector(".moda-nav-hamburger");
    const lines = hamburger.querySelectorAll("line");
    const menuLinks = this.querySelectorAll(".moda-menu-link");

    if (this.menuOpen) {
      backdrop.classList.add("active");
      sideMenu.classList.add("active");

      // Anima hamburguer para X com GSAP (2 linhas)
      if (window.gsap) {
        window.gsap.to(lines[0], {
          attr: { y1: 12, y2: 12, x1: 3, x2: 21 },
          rotation: 45,
          transformOrigin: "center",
          duration: 0.3,
          ease: "power2.inOut",
        });

        window.gsap.to(lines[1], {
          attr: { y1: 12, y2: 12, x1: 3, x2: 21 },
          rotation: -45,
          transformOrigin: "center",
          duration: 0.3,
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
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out",
            delay: 0.2,
          },
        );
      }
    } else {
      backdrop.classList.remove("active");
      sideMenu.classList.remove("active");

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
  }

  closeMenu() {
    this.menuOpen = false;
    const sideMenu = this.querySelector(".moda-side-menu");
    const backdrop = this.querySelector(".moda-side-menu-backdrop");
    const hamburger = this.querySelector(".moda-nav-hamburger");
    const lines = hamburger.querySelectorAll("line");
    const mainMenu = this.querySelector(".main-menu-content");

    // Fecha o painel Alta Perfumaria se estiver aberto
    if (this.altaPerfumariaExpanded) {
      const altaPerfumariaPanel = this.querySelector(
        "[data-alta-perfumaria-panel]",
      );
      if (altaPerfumariaPanel) {
        altaPerfumariaPanel.classList.remove("active");
        altaPerfumariaPanel.style.transform = "";
        altaPerfumariaPanel.style.opacity = "";
        altaPerfumariaPanel.style.visibility = "hidden";
        altaPerfumariaPanel.style.display = "none";
      }
      this.altaPerfumariaExpanded = false;
    }

    // Fecha o painel Spa se estiver aberto
    if (this.spaExpanded) {
      const spaPanel = this.querySelector("[data-spa-panel]");
      if (spaPanel) {
        spaPanel.classList.remove("active");
        spaPanel.style.transform = "";
        spaPanel.style.opacity = "";
      }
      this.spaExpanded = false;
    }

    // Fecha submenu se estiver aberto
    if (this.currentSubmenu) {
      const submenu = this.querySelector(
        `[data-submenu-id="${this.currentSubmenu}"]`,
      );
      if (submenu) {
        submenu.style.display = "none";
        submenu.style.transform = "";
        submenu.classList.remove("submenu-expanded");
      }
      this.currentSubmenu = null;
    }

    // Reset do menu principal
    if (mainMenu) {
      mainMenu.style.transform = "";
    }

    // Reset expansões
    this.fragranceExpanded = false;

    // Remove todas as classes de expansão do sideMenu
    sideMenu.classList.remove("active");
    sideMenu.classList.remove("fragrance-expanded");
    sideMenu.classList.remove("spa-expanded");
    sideMenu.classList.remove("alta-perfumaria-expanded");
    sideMenu.classList.remove("submenu-expanded");

    // Reset inline styles do sideMenu
    sideMenu.style.width = "";

    backdrop.classList.remove("active");

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

  updateBagBadge() {
    const badge = this.querySelector(".bag-badge");
    if (badge) {
      const totalItems = cartService.getTotalItems();
      badge.textContent = totalItems;
      badge.style.display = totalItems > 0 ? "flex" : "none";
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
              class="logo-raster"
              src="/images/Design sem nome (6).svg"
              alt="Dior Logo"
              width="140"
              height="32"
            />
            <img
              class="logo-vector"
              src="/images/dior-logo-vector.svg"
              alt="Dior Logo"
              width="100"
              height="30"
            />
          </a>
        </div>

        <!-- Ações (Direita) -->
        <div class="moda-nav-actions">
          <div class="app-nav-icons-container">
            <div class="search-container">
              <input 
                type="text" 
                class="search-input" 
                placeholder="Encontre em dior.com"
                aria-label="Campo de pesquisa"
              />
              <button class="nav-icon-btn search-icon-btn" aria-label="Pesquisar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
            </div>

            <button class="nav-icon-btn profile-btn" aria-label="Perfil">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>

            <button class="nav-icon-btn bag-btn-container" aria-label="Sacola de compras">
              <svg width="21" height="21" viewBox="0 0 21 21" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.5 6.5H4.5L3.5 17.5H16.5L15.5 6.5Z"/>
                <path d="M7 6.5V5.5C7 4.83696 7.26339 4.20107 7.73223 3.73223C8.20107 3.26339 8.83696 3 9.5 3H10.5C11.163 3 11.7989 3.26339 12.2678 3.73223C12.7366 4.20107 13 4.83696 13 5.5V6.5"/>
              </svg>
              <span class="bag-badge">0</span>
            </button>
          </div>
        </div>
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

        <div class="moda-menu-container">
          <!-- Menu Principal -->
          <div class="main-menu-content">
            <nav class="moda-menu-nav">
              <a href="/" class="moda-menu-link" data-route="/">Início</a>
              <a href="/dior-holiday" class="moda-menu-link" data-route="/dior-holiday">Dior Holiday</a>
              <a href="#" class="moda-menu-link has-submenu" data-submenu="fragrancia-feminina">Fragrância Feminina</a>
              <a href="#" class="moda-menu-link has-submenu" data-submenu="fragrancia-masculina">Fragrância Masculina</a>
              <a href="#" class="moda-menu-link has-submenu" data-submenu="la-collection-privee">La Collection Privée</a>
              <a href="#" class="moda-menu-link has-submenu" data-submenu="maquiagem">Maquiagem</a>
              <a href="#" class="moda-menu-link has-submenu" data-submenu="tratamento">Tratamento</a>
              <a href="#" class="moda-menu-link has-submenu" data-submenu="presentes">Presentes</a>
              <a href="#" class="moda-menu-link has-submenu" data-submenu="servicos">Serviços</a>
              <a href="#" class="moda-menu-link has-submenu" data-submenu="sobre-dior">Sobre Dior</a>
            </nav>

            <div class="moda-menu-contact">
              <h3 class="moda-menu-contact-title">CONTATO</h3>
              <a href="/boutiques" class="moda-menu-contact-link" data-route="/boutiques">Encontrar uma boutique</a>
              <a href="#pais-regiao" class="moda-menu-contact-link">País/Região: Brasil (Português)</a>
            </div>

            <div class="moda-menu-footer">
              <label class="moda-menu-accessibility">
                <span>Acessibilidade: melhorar o contraste</span>
                <input type="checkbox" class="moda-menu-checkbox" />
              </label>

              <div class="moda-menu-tabs">
                <a href="/moda-acessorios" class="moda-menu-tab" data-route="/moda-acessorios">Moda & Acessórios</a>
                <a href="/" class="moda-menu-tab moda-menu-tab-active" data-route="/">Perfume & Cosméticos</a>
              </div>
            </div>
          </div>

          <!-- Submenu: Fragrância Feminina (Expandido) -->
          <div class="submenu-panel" data-submenu-id="fragrancia-feminina" style="display: none;">
            <div class="submenu-header">
              <button class="submenu-back-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
                <span>Fragrâncias</span>
              </button>
              <!-- Botão de voltar do Alta Perfumaria (inicialmente escondido) -->
              <button class="submenu-back-btn" data-alta-perfumaria-back style="display: none;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
                <span>Alta Perfumaria</span>
              </button>
            </div>

            <div class="submenu-expanded-content">
              <!-- Coluna Esquerda - Links -->
              <div class="submenu-expanded-left">
                <div class="submenu-icons">
                  <p class="submenu-icons-title">ICÔNICOS</p>
                  <div class="submenu-icons-grid">
                    <a href="/miss-dior" class="submenu-icon-item" data-route="/miss-dior">
                      <img src="/images/missdiorpng.png" alt="Miss Dior" />
                      <span>Miss Dior</span>
                    </a>
                    <a href="/miss-dior-essence" class="submenu-icon-item" data-route="/miss-dior-essence">
                      <img src="/images/jadorepng.png" alt="J'adore" />
                      <span>J'adore</span>
                    </a>
                    <a href="/compras-miss-dior-parfum" class="submenu-icon-item" data-route="/compras-miss-dior-parfum">
                      <img src="/images/poison.webp" alt="Poison" />
                      <span>Poison</span>
                    </a>
                  </div>
                </div>

                <nav class="submenu-links">
                  <a href="#novidades" class="submenu-link">Novidades</a>
                  <a href="#descubra" class="submenu-link">Descubra</a>
                  <a href="#" class="submenu-link has-alta-perfumaria" data-alta-perfumaria-trigger>Alta Perfumaria <span class="chevron">›</span></a>
                  <a href="/miss-dior" class="submenu-link submenu-link-bold" data-route="/miss-dior">Miss Dior</a>
                  <a href="/miss-dior-essence" class="submenu-link" data-route="/miss-dior-essence">Miss Dior Essence</a>
                  <a href="/compras-miss-dior-parfum" class="submenu-link" data-route="/compras-miss-dior-parfum">Miss Dior Parfum</a>
                  <a href="/dior-verao" class="submenu-link" data-route="/dior-verao">Dior Verão</a>
                  <a href="#expertise" class="submenu-link">Expertise de Fragrâncias</a>
                  <a href="#exclusivas" class="submenu-link">Criações Exclusivas</a>
                </nav>

                <div class="submenu-footer-cta">
                  <a href="/la-collection-privee" class="submenu-footer-link" data-route="/la-collection-privee">
                    Como escolher meu perfume da<br>La Collection Privée
                  </a>
                </div>
              </div>

              <!-- Coluna Direita - Cards de Imagens -->
              <div class="submenu-expanded-right">
                <a href="/la-collection-privee" class="fragrance-card" data-route="/la-collection-privee">
                  <img src="/images/perfumes/roseStart.jpg" alt="La Collection Privée" />
                  <div class="fragrance-card-overlay">
                    <h4 class="fragrance-card-title">La Collection Privée</h4>
                    <p class="fragrance-card-subtitle">Descubra</p>
                  </div>
                </a>
                <a href="/miss-dior" class="fragrance-card" data-route="/miss-dior">
                  <img src="/images/perfumes/missdior.webp" alt="Miss Dior" />
                  <div class="fragrance-card-overlay">
                    <h4 class="fragrance-card-title">Miss Dior</h4>
                    <p class="fragrance-card-subtitle">A nova essência de Miss Dior</p>
                  </div>
                </a>
              </div>

              <!-- Painel de Alta Perfumaria (3º nível) -->
              <div class="alta-perfumaria-panel" data-alta-perfumaria-panel style="display: none;">
                <!-- Coluna Esquerda - Links Alta Perfumaria -->
                <div class="alta-perfumaria-left">
                  <nav class="submenu-links alta-perfumaria-links">
                    <a href="#exceptional" class="submenu-link">Exceptional Pieces</a>
                    <a href="#anforas" class="submenu-link">Ânforas personalizáveis</a>
                  </nav>

                  <div class="alta-perfumaria-divider"></div>

                  <nav class="submenu-links alta-perfumaria-links-main">
                    <span class="alta-perfumaria-section-title">La Collection Privée</span>
                    <a href="#mais-vendidos" class="submenu-link">Mais Vendidos</a>
                    <a href="#fragrancias" class="submenu-link">Fragrâncias</a>
                    <a href="#esprits" class="submenu-link">Esprits de Parfum e Elixires</a>
                    <a href="#kit" class="submenu-link">Kit do Perfumista</a>
                    <a href="#couture" class="submenu-link">Couture Pieces</a>
                    <a href="#banho" class="submenu-link">Banho e Corpo</a>
                    <a href="#casa" class="submenu-link">Casa</a>
                    <a href="#ver-tudo" class="submenu-link">Ver tudo</a>
                  </nav>

                  
                </div>

                <!-- Coluna Direita - Cards Alta Perfumaria -->
                <div class="alta-perfumaria-right">
                  <a href="/la-collection-privee" class="alta-perfumaria-card" data-route="/la-collection-privee">
                    <img src="/images/perfumes/roseStart.jpg" alt="Rose Star" />
                    <div class="alta-perfumaria-card-overlay">
                      <span class="alta-perfumaria-card-label">La Collection Privée</span>
                      <span class="alta-perfumaria-card-cta">Descubra</span>
                    </div>
                  </a>
                  <a href="/la-collection-privee" class="alta-perfumaria-card" data-route="/la-collection-privee">
                    <img src="/images/perfumes/Esprits.webp" alt="Bois D'Argent" />
                    <div class="alta-perfumaria-card-overlay">
                      <span class="alta-perfumaria-card-label">La Collection Privée</span>
                      <span class="alta-perfumaria-card-cta">Bois d'Argent, the new Esprit de Parfum</span>
                    </div>
                  </a>
                  
                  <!-- Footer CTA dentro dos cards para mobile -->
                  <div class="alta-perfumaria-footer-mobile">
                    <a href="/la-collection-privee" class="submenu-footer-link" data-route="/la-collection-privee">
                      Como escolher meu perfume da<br>La Collection Privée
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Submenu: Fragrância Masculina -->
          <div class="submenu-panel" data-submenu-id="fragrancia-masculina" style="display: none;">
            <div class="submenu-header">
              <button class="submenu-back-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
                <span>Fragrância Masculina</span>
              </button>
            </div>
            <div class="submenu-content">
              <nav class="submenu-links">
                <a href="#novidades" class="submenu-link">Novidades</a>
                <a href="#descubra" class="submenu-link">Descubra</a>
                <a href="#sauvage" class="submenu-link submenu-link-bold">Sauvage</a>
                <a href="#dior-homme" class="submenu-link">Dior Homme</a>
                <a href="#todas" class="submenu-link">Todas as Fragrâncias Masculinas</a>
              </nav>
            </div>
          </div>

          <!-- Submenu: La Collection Privée -->
          <div class="submenu-panel" data-submenu-id="la-collection-privee" style="display: none;">
            <div class="submenu-header">
              <button class="submenu-back-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
                <span>La Collection Privée</span>
              </button>
            </div>
            <div class="submenu-content">
              <nav class="submenu-links">
                <a href="#colecao" class="submenu-link submenu-link-bold">Toda a Coleção</a>
                <a href="#femininas" class="submenu-link">Fragrâncias Femininas</a>
                <a href="#masculinas" class="submenu-link">Fragrâncias Masculinas</a>
                <a href="#unissex" class="submenu-link">Fragrâncias Unissex</a>
              </nav>
            </div>
          </div>

          <!-- Submenu: Maquiagem -->
          <div class="submenu-panel" data-submenu-id="maquiagem" style="display: none;">
            <div class="submenu-header">
              <button class="submenu-back-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
                <span>Maquiagem</span>
              </button>
            </div>
            <div class="submenu-content">
              <nav class="submenu-links">
                <a href="#novidades" class="submenu-link">Novidades</a>
                <a href="#labios" class="submenu-link">Lábios</a>
                <a href="#olhos" class="submenu-link">Olhos</a>
                <a href="#rosto" class="submenu-link">Rosto</a>
                <a href="#unhas" class="submenu-link">Unhas</a>
              </nav>
            </div>
          </div>

          <!-- Submenu: Tratamento -->
          <div class="submenu-panel" data-submenu-id="tratamento" style="display: none;">
            <div class="submenu-header">
              <button class="submenu-back-btn" data-spa-back style="display: none;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
                <span>Spa</span>
              </button>
              <button class="submenu-back-btn" data-tratamento-back>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
                <span>Tratamento</span>
              </button>
            </div>
            <div class="submenu-content-wrapper">
              <!-- Lado esquerdo: Menu Tratamento/Spa -->
              <div class="submenu-left-content">
                <nav class="submenu-links">
                  <a href="#novidades" class="submenu-link">O que há de novo</a>
                  <a href="#spa" class="submenu-link has-spa-submenu" data-spa-trigger>Dior Spa</a>
                </nav>
              </div>
              
              <!-- Lado direito: Locais do Spa (aparece ao clicar em Dior Spa) -->
              <div class="spa-locations-panel" data-spa-panel>
                <nav class="spa-locations-list">
                  <a href="#spa-new-york" class="spa-location-link">Dior Spa New York</a>
                  <a href="#spa-cheval-blanc" class="spa-location-link">Dior Spa Cheval Blanc - Paris</a>
                  <a href="#spa-harrods" class="spa-location-link">Dior la Suite At Harrods - London</a>
                  <a href="#spa-plaza" class="spa-location-link">Dior Spa Plaza Athénée - Paris</a>
                  <a href="#spa-lana" class="spa-location-link">Dior Spa The Lana - Dubaï</a>
                  <a href="#spa-timeo" class="spa-location-link">Dior Spa Timeo - Sicily</a>
                  <a href="#spa-doha" class="spa-location-link">Dior Luxury Beauty Retreat - Doha</a>
                  <a href="#spa-scotsman" class="spa-location-link">Dior Spa Royal Scotsman</a>
                  <a href="/dior-spa" class="spa-location-link spa-view-all" data-route="/dior-spa">Ver tudo</a>
                </nav>
              </div>
            </div>
          </div>

          <!-- Submenu: Presentes -->
          <div class="submenu-panel" data-submenu-id="presentes" style="display: none;">
            <div class="submenu-header">
              <button class="submenu-back-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
                <span>Presentes</span>
              </button>
            </div>
            <div class="submenu-content">
              <nav class="submenu-links">
                <a href="/dior-holiday" class="submenu-link submenu-link-bold" data-route="/dior-holiday">Dior Holiday</a>
                <a href="/para-ela" class="submenu-link" data-route="/para-ela">Presentes Para Ela</a>
                <a href="/arte-de-presentear" class="submenu-link" data-route="/arte-de-presentear">A Arte de Presentear</a>
                <a href="/moda-acessorios" class="submenu-link" data-route="/moda-acessorios">Moda & Acessórios</a>
                <a href="#para-ele" class="submenu-link">Presentes Para Ele</a>
              </nav>
            </div>
          </div>

          <!-- Submenu: Serviços -->
          <div class="submenu-panel" data-submenu-id="servicos" style="display: none;">
            <div class="submenu-header">
              <button class="submenu-back-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
                <span>Serviços</span>
              </button>
            </div>
            <div class="submenu-content">
              <nav class="submenu-links">
                <a href="#personalizacao" class="submenu-link">Personalização</a>
                <a href="#embrulho" class="submenu-link">Embrulho Para Presente</a>
                <a href="#consultoria" class="submenu-link">Consultoria Beauty</a>
                <a href="#entrega" class="submenu-link">Entrega Express</a>
              </nav>
            </div>
          </div>

          <!-- Submenu: Sobre Dior -->
          <div class="submenu-panel" data-submenu-id="sobre-dior" style="display: none;">
            <div class="submenu-header">
              <button class="submenu-back-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
                <span>Sobre Dior</span>
              </button>
            </div>
            <div class="submenu-content">
              <nav class="submenu-links">
                <a href="#historia" class="submenu-link">História da Maison</a>
                <a href="#savoir-faire" class="submenu-link">Savoir-Faire</a>
                <a href="#compromissos" class="submenu-link">Nossos Compromissos</a>
                <a href="/boutiques" class="submenu-link" data-route="/boutiques">Encontrar uma Boutique</a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("app-navigation", AppNavigation);
