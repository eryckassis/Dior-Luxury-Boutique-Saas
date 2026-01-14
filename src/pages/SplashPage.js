// ============================================================================
// SPLASH PAGE - Página inicial de escolha de categoria (SPA)
// ============================================================================
// Splash screen convertido para Web Component seguindo arquitetura SPA
// Permite navegação via router e mantém histórico do browser
// ============================================================================

import "../styles/splash-page.css";
import { router } from "../router/router.js";

// ============================================================================
// CONSTANTS - Configurações de animação e rotas
// ============================================================================

const ANIMATION_CONFIG = {
  duration: {
    hover: 0.6,
    scale: 0.8,
    flex: 0.5,
    exit: 0.8,
    // Transição de saída elegante
    contentFade: 0.5,
    videoDarken: 0.8,
    logoHold: 0.6,
    preloaderFade: 0.4,
  },
  ease: {
    default: "power2.out",
    exit: "power2.inOut",
    smooth: "power3.inOut",
  },
  scale: {
    hover: 1.05,
    default: 1,
  },
  flex: {
    hover: 1.1,
    default: 1,
  },
};

const ROUTES = {
  fashion: "/moda-acessorios",
  beauty: "/home",
};

// ============================================================================
// GLOBAL FUNCTION - Esconde preloader após transição
// ============================================================================
// Função global para garantir que funcione mesmo após o componente ser removido

function hidePreloaderGlobal() {
  const preloader = document.querySelector(".preloader");
  if (!preloader) return;

  const tl = gsap.timeline({
    onComplete: () => {
      gsap.set(preloader, {
        display: "none",
        height: "100vh", // Reset para próximo uso
        opacity: 1,
      });
      // Libera o scroll do body após preloader sumir
      document.body.style.overflow = "visible";
      document.body.style.overflowX = "hidden";
      document.body.style.overflowY = "auto";
    },
  });

  tl.to(preloader, {
    duration: 1,
    height: "0vh",
    ease: "Power3.easeOut",
  }).to(
    ".preloader .imagem-logo img",
    {
      opacity: 0,
      duration: 0.3,
    },
    "<"
  );
}

// ============================================================================
// SPLASH PAGE COMPONENT
// ============================================================================

export class SplashPage extends HTMLElement {
  constructor() {
    super();
    this.options = null;
    this.buttons = [];
    this.isTransitioning = false;
  }

  // ============================================================================
  // LIFECYCLE METHODS
  // ============================================================================

  connectedCallback() {
    this.render();
    this.cacheElements();
    this.initButtonEffects();
    this.initHoverEffects();
    this.initClickHandlers();
    this.initVideos();
  }

  disconnectedCallback() {
    this.cleanup();
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  render() {
    this.innerHTML = /* html */ `
      <div class="splash-page">
        <!-- Logo Central -->
        <div class="splash-logo">
          <img src="/images/DiorWhite.png" alt="Dior Logo" />
        </div>

        <!-- Container das Opções -->
        <div class="splash-container">
          
          <!-- Opção 1: Moda & Acessórios -->
          <div class="splash-option splash-option-left" data-category="fashion">
            <div class="splash-option-darkening"></div>
            <div class="splash-option-overlay"></div>
            <video
              src="/videos/diorama.mp4"
              class="splash-option-bg"
              autoplay
              muted
              loop
              playsinline
            ></video>
            <div class="splash-option-content">
              <h2 class="splash-option-title">Moda & Acessórios</h2>
              <button class="splash-option-button" data-block="button" data-category="fashion">
                <span class="button__label">Descobrir</span>
                <span class="button__flair"></span>
              </button>
            </div>
          </div>

          <!-- Opção 2: Perfume & Cosméticos -->
          <div class="splash-option splash-option-right" data-category="beauty">
            <div class="splash-option-darkening"></div>
            <div class="splash-option-overlay"></div>
            <video
              src="/videos/diorRivera.mp4"
              class="splash-option-bg"
              autoplay
              muted
              loop
              playsinline
              preload="auto"
              poster="/images/diorImage.png"
            ></video>
            <div class="splash-option-content">
              <h2 class="splash-option-title">Perfume & Cosméticos</h2>
              <button class="splash-option-button" data-block="button" data-category="beauty">
                <span class="button__label">Descobrir</span>
                <span class="button__flair"></span>
              </button>
            </div>
          </div>

        </div>
      </div>
    `;
  }

  // ============================================================================
  // ELEMENT CACHING
  // ============================================================================

  cacheElements() {
    this.splashElement = this.querySelector(".splash-page");
    this.options = this.querySelectorAll(".splash-option");
    this.buttons = this.querySelectorAll(".splash-option-button");
    this.videos = this.querySelectorAll(".splash-option-bg");
  }

  // ============================================================================
  // BUTTON FLAIR EFFECT - Efeito de hover seguindo o mouse
  // ============================================================================

  initButtonEffects() {
    if (!window.gsap) return;

    this.buttons.forEach((button) => {
      const flair = button.querySelector(".button__flair");
      if (!flair) return;

      const xSet = gsap.quickSetter(flair, "xPercent");
      const ySet = gsap.quickSetter(flair, "yPercent");

      // Calcula posição relativa do mouse no botão
      const getXY = (e) => {
        const { left, top, width, height } = button.getBoundingClientRect();

        const xTransformer = gsap.utils.pipe(
          gsap.utils.mapRange(0, width, 0, 100),
          gsap.utils.clamp(0, 100)
        );

        const yTransformer = gsap.utils.pipe(
          gsap.utils.mapRange(0, height, 0, 100),
          gsap.utils.clamp(0, 100)
        );

        return {
          x: xTransformer(e.clientX - left),
          y: yTransformer(e.clientY - top),
        };
      };

      // Mouse Enter - Flair aparece
      button.addEventListener("mouseenter", (e) => {
        const { x, y } = getXY(e);
        xSet(x);
        ySet(y);

        gsap.to(flair, {
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
        });
      });

      // Mouse Leave - Flair desaparece
      button.addEventListener("mouseleave", (e) => {
        const { x, y } = getXY(e);

        gsap.killTweensOf(flair);

        gsap.to(flair, {
          xPercent: x > 90 ? x + 20 : x < 10 ? x - 20 : x,
          yPercent: y > 90 ? y + 20 : y < 10 ? y - 20 : y,
          scale: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      });

      // Mouse Move - Flair segue o mouse
      button.addEventListener("mousemove", (e) => {
        const { x, y } = getXY(e);

        gsap.to(flair, {
          xPercent: x,
          yPercent: y,
          duration: 0.4,
          ease: "power2",
        });
      });
    });
  }

  // ============================================================================
  // HOVER EFFECTS - Clarear/escurecer e zoom nas opções
  // ============================================================================

  initHoverEffects() {
    if (!window.gsap) return;

    this.options.forEach((option) => {
      const darkening = option.querySelector(".splash-option-darkening");
      const bg = option.querySelector(".splash-option-bg");

      if (!darkening || !bg) return;

      // Mouse Enter - Clareia e aumenta
      option.addEventListener("mouseenter", () => {
        if (this.isTransitioning) return;

        gsap.to(darkening, {
          duration: ANIMATION_CONFIG.duration.hover,
          opacity: 0,
          ease: ANIMATION_CONFIG.ease.default,
        });

        gsap.to(bg, {
          duration: ANIMATION_CONFIG.duration.scale,
          scale: ANIMATION_CONFIG.scale.hover,
          ease: ANIMATION_CONFIG.ease.default,
        });

        gsap.to(option, {
          duration: ANIMATION_CONFIG.duration.flex,
          flex: ANIMATION_CONFIG.flex.hover,
          ease: ANIMATION_CONFIG.ease.default,
        });
      });

      // Mouse Leave - Escurece e volta ao normal
      option.addEventListener("mouseleave", () => {
        if (this.isTransitioning) return;

        gsap.to(darkening, {
          duration: ANIMATION_CONFIG.duration.hover,
          opacity: 1,
          ease: ANIMATION_CONFIG.ease.default,
        });

        gsap.to(bg, {
          duration: ANIMATION_CONFIG.duration.scale,
          scale: ANIMATION_CONFIG.scale.default,
          ease: ANIMATION_CONFIG.ease.default,
        });

        gsap.to(option, {
          duration: ANIMATION_CONFIG.duration.flex,
          flex: ANIMATION_CONFIG.flex.default,
          ease: ANIMATION_CONFIG.ease.default,
        });
      });
    });
  }

  // ============================================================================
  // CLICK HANDLERS - Navegação para categorias
  // ============================================================================

  initClickHandlers() {
    this.buttons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();

        if (this.isTransitioning) return;

        const category = button.getAttribute("data-category");
        this.handleCategoryClick(category);
      });
    });
  }

  /**
   * Processa o clique na categoria e inicia navegação
   * Transição elegante: escurece → logo permanece → preloader → navega
   * @param {string} category - 'fashion' ou 'beauty'
   */
  handleCategoryClick(category) {
    this.isTransitioning = true;

    const targetRoute = ROUTES[category] || ROUTES.beauty;

    // Elementos para animar
    const contents = this.querySelectorAll(".splash-option-content");
    const darkenings = this.querySelectorAll(".splash-option-darkening");
    const videos = this.querySelectorAll(".splash-option-bg");
    const logo = this.querySelector(".splash-logo");
    const preloader = document.querySelector(".preloader");

    // Timeline de transição elegante
    const tl = gsap.timeline();

    // FASE 1: Fade out dos conteúdos (títulos e botões)
    tl.to(contents, {
      opacity: 0,
      y: 20,
      duration: ANIMATION_CONFIG.duration.contentFade,
      ease: ANIMATION_CONFIG.ease.smooth,
      stagger: 0.1,
    });

    // FASE 2: Escurecer os vídeos completamente (em paralelo com fade dos conteúdos)
    tl.to(
      darkenings,
      {
        opacity: 1,
        duration: ANIMATION_CONFIG.duration.videoDarken,
        ease: ANIMATION_CONFIG.ease.smooth,
      },
      "<0.2"
    );

    // FASE 3: Fade out suave dos vídeos para preto total
    tl.to(
      videos,
      {
        opacity: 0,
        duration: ANIMATION_CONFIG.duration.videoDarken,
        ease: ANIMATION_CONFIG.ease.smooth,
      },
      "<0.3"
    );

    // FASE 4: Manter logo visível por um momento (já está centralizada)
    tl.to({}, { duration: ANIMATION_CONFIG.duration.logoHold });

    // FASE 5: Preparar e mostrar preloader (sincronizado)
    tl.call(() => {
      if (preloader) {
        // Prepara preloader invisível mas posicionado
        gsap.set(preloader, {
          display: "flex",
          height: "100vh",
          opacity: 0,
        });
        gsap.set(".preloader .text-container", { visibility: "visible" });
        gsap.set(".preloader .imagem-logo img", { opacity: 1 });
      }
    });

    // FASE 6: Crossfade - Splash some, Preloader aparece
    tl.to(
      logo,
      {
        opacity: 0,
        duration: ANIMATION_CONFIG.duration.preloaderFade,
        ease: ANIMATION_CONFIG.ease.smooth,
      },
      ">"
    );

    tl.to(
      preloader,
      {
        opacity: 1,
        duration: ANIMATION_CONFIG.duration.preloaderFade,
        ease: ANIMATION_CONFIG.ease.smooth,
      },
      "<"
    );

    // FASE 7: Após transição, navega usando o router
    tl.call(() => {
      // Navega para a rota (skipPreloader = true pois já mostramos)
      router.navigateFromSplash(targetRoute);

      // Aguarda a página carregar e então esconde o preloader
      // Usa função global para garantir que funcione mesmo após componente ser removido
      setTimeout(() => {
        hidePreloaderGlobal();
      }, 800);
    });
  }

  // ============================================================================
  // VIDEO MANAGEMENT
  // ============================================================================

  initVideos() {
    this.videos.forEach((video) => {
      // Garante autoplay
      video.play().catch((err) => {
        console.warn("Autoplay bloqueado:", err.message);
      });
    });
  }

  // ============================================================================
  // CLEANUP
  // ============================================================================

  cleanup() {
    // Para todos os vídeos
    if (this.videos) {
      this.videos.forEach((video) => {
        video.pause();
        video.src = "";
      });
    }

    // Kill animações GSAP pendentes
    if (window.gsap && this.splashElement) {
      gsap.killTweensOf(this.splashElement);
    }

    if (window.gsap && this.options) {
      this.options.forEach((option) => {
        gsap.killTweensOf(option);
        gsap.killTweensOf(option.querySelector(".splash-option-darkening"));
        gsap.killTweensOf(option.querySelector(".splash-option-bg"));
      });
    }
  }
}

// ============================================================================
// REGISTER CUSTOM ELEMENT
// ============================================================================

customElements.define("splash-page", SplashPage);
