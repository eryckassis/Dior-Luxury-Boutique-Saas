import "./style.css";
import "./styles/app-navigation.css";
import "./styles/fragrances-modal.css";
import "./styles/miss-dior.css";
import "./styles/compras-miss-dior.css";
import "./styles/miss-dior-essence.css";
import "./styles/profile-menu.css";
import "./styles/finalizar-compra.css";
import "./styles/dior-verao.css";
import "./styles/moda-acessorios.css";
import "./styles/presente-para-ela.css";
import "./styles/product-detail.css";
import "./styles/register.css";
import { router } from "./router/router.js";
import "./pages/HomePage.js";
import "./pages/DiorHolidayPage.js";
import "./pages/ArteDePresentearPage.js";
import "./pages/MissDiorPage.js";
import "./pages/ComprasMissDiorParfumPage.js";
import "./pages/MissDiorEssencePage.js";
import "./pages/LoginPage.js";
import "./pages/RegisterPage.js";
import "./pages/FinalizarCompraPage.js";
import "./pages/DiorVeraoPage.js";
import "./pages/ModaEAcessoriosPage.js";
import "./pages/PresenteParaElaPage.js";
import "./pages/ColecaoPage.js";
import "./pages/ProductDetailPage.js";
import "./components/ProfileMenu.js";
import "./components/FragrancesModal.js";
import "./components/AppNavigation.js";
import "./components/FooterSection.js";
import "./components/ModaAcessoriosContent.js";

// ============================================================================
// ROUTER CONFIGURATION
// ============================================================================

// Registra as rotas
router.register("/", "home-page");
router.register("/dior-holiday", "dior-holiday-page");
router.register("/arte-de-presentear", "arte-de-presentear-page");
router.register("/miss-dior", "miss-dior-page");
router.register("/compras-miss-dior-parfum", "compras-miss-dior-parfum-page");
router.register("/miss-dior-essence", "miss-dior-essence-page");
router.register("/login", "login-page");
router.register("/register", "register-page");
router.register("/finalizar-compra", "finalizar-compra-page");
router.register("/dior-verao", "dior-verao-page");
router.register("/moda-acessorios", "moda-acessorios-page");
router.register("/para-ela", "presente-para-ela-page");
router.register("/colecao", "colecao-page");
router.register("/produto/:id", "product-detail-page");

// ============================================================================
// BUTTON ANIMATION - Efeito Hover com Flair
// ============================================================================

class Button {
  constructor(buttonElement) {
    this.block = buttonElement;
    this.init();
    this.initEvents();
  }

  init() {
    const el = gsap.utils.selector(this.block);

    this.DOM = {
      button: this.block,
      flair: el(".button__flair"),
    };

    this.xSet = gsap.quickSetter(this.DOM.flair, "xPercent");
    this.ySet = gsap.quickSetter(this.DOM.flair, "yPercent");
  }

  getXY(e) {
    const { left, top, width, height } =
      this.DOM.button.getBoundingClientRect();

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
  }

  initEvents() {
    this.DOM.button.addEventListener("mouseenter", (e) => {
      const { x, y } = this.getXY(e);

      this.xSet(x);
      this.ySet(y);

      gsap.to(this.DOM.flair, {
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
      });
    });

    this.DOM.button.addEventListener("mouseleave", (e) => {
      const { x, y } = this.getXY(e);

      gsap.killTweensOf(this.DOM.flair);

      gsap.to(this.DOM.flair, {
        xPercent: x > 90 ? x + 20 : x < 10 ? x - 20 : x,
        yPercent: y > 90 ? y + 20 : y < 10 ? y - 20 : y,
        scale: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    this.DOM.button.addEventListener("mousemove", (e) => {
      const { x, y } = this.getXY(e);

      gsap.to(this.DOM.flair, {
        xPercent: x,
        yPercent: y,
        duration: 0.4,
        ease: "power2",
      });
    });
  }
}

// Torna a classe Button globalmente disponível
window.Button = Button;

// ============================================================================
// VIDEO HOVER CONTROLLER - Play/Pause ao passar o mouse
// ============================================================================

class VideoHoverController {
  constructor(videoElement) {
    this.video = videoElement;
    this.isHovered = false;
    this.init();
  }

  init() {
    if (!this.video) {
      return;
    }

    // Pausa o vídeo inicialmente se ele estiver com autoplay
    // Mas mantém o loop configurado
    this.video.pause();

    this.addEventListeners();
  }

  addEventListeners() {
    // Mouse entra - inicia o vídeo
    this.video.addEventListener("mouseenter", () => {
      this.isHovered = true;
      this.playVideo();
    });

    // Mouse sai - pausa e volta ao início
    this.video.addEventListener("mouseleave", () => {
      this.isHovered = false;
      this.resetVideo();
    });
  }

  playVideo() {
    if (this.video.paused) {
      const playPromise = this.video.play();

      // Tratamento de erro para navegadores que bloqueiam autoplay
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Autoplay foi bloqueado:", error);
        });
      }
    }
  }

  resetVideo() {
    if (!this.video.paused) {
      this.video.pause();
    }
    // Volta o vídeo para o início
    this.video.currentTime = 0;
  }
}

// ============================================================================
// SPLASH SCREEN - Navegação com Duas Opções
// ============================================================================

class SplashScreen {
  constructor() {
    this.splashElement = document.getElementById("splash-screen");
    this.options = document.querySelectorAll(".splash-option");
    this.init();
  }

  init() {
    if (!this.splashElement || !this.options.length) {
      return;
    }

    this.addEventListeners();
    this.initHoverEffects();
  }

  initHoverEffects() {
    this.options.forEach((option) => {
      const darkening = option.querySelector(".splash-option-darkening");
      const bg = option.querySelector(".splash-option-bg");

      if (!darkening || !bg) {
        return;
      }

      // Mouse enter - clareia a imagem e aumenta
      option.addEventListener("mouseenter", () => {
        gsap.to(darkening, {
          duration: 0.6,
          opacity: 0,
          ease: "power2.out",
        });

        gsap.to(bg, {
          duration: 0.8,
          scale: 1.05,
          ease: "power2.out",
        });

        gsap.to(option, {
          duration: 0.5,
          flex: 1.1,
          ease: "power2.out",
        });
      });

      // Mouse leave - escurece a imagem e volta ao normal
      option.addEventListener("mouseleave", () => {
        gsap.to(darkening, {
          duration: 0.6,
          opacity: 1,
          ease: "power2.out",
        });

        gsap.to(bg, {
          duration: 0.8,
          scale: 1,
          ease: "power2.out",
        });

        gsap.to(option, {
          duration: 0.5,
          flex: 1,
          ease: "power2.out",
        });
      });
    });
  }

  addEventListeners() {
    this.options.forEach((option) => {
      const button = option.querySelector(".splash-option-button");
      const category = option.getAttribute("data-category");

      if (button) {
        button.addEventListener("click", (e) => {
          e.preventDefault();
          this.handleOptionClick(category);
        });
      }
    });
  }

  handleOptionClick(category) {
    // Anima saída do splash screen
    gsap.to(this.splashElement, {
      duration: 0.8,
      opacity: 0,
      ease: "power2.inOut",
      onComplete: () => {
        this.splashElement.classList.add("hidden");
        this.startPreloader(category);
      },
    });
  }

  startPreloader(category) {
    // Aguarda um frame para garantir que splash foi escondido
    requestAnimationFrame(() => {
      initPreloader(category);
    });
  }
}

// ============================================================================
// PRELOADER ANIMATION (Layer sobe sem animar logo)
// ============================================================================

function initPreloader(category) {
  // Inicia o router ANTES da animação
  router.init();

  const tl = gsap.timeline();

  tl
    // Torna o container e logo visíveis imediatamente
    .to(".preloader .text-container", {
      duration: 0,
      visibility: "visible",
      ease: "Power3.easeOut",
    })
    .to(".preloader .imagem-logo img", {
      duration: 0,
      opacity: 1,
      ease: "Power3.easeOut",
    })

    // Pausa mostrando a logo estática
    .to(
      {},
      {
        duration: 2,
      }
    )

    // Preloader sobe (layer subindo)
    .to(".preloader", {
      duration: 1.5,
      height: "0vh",
      ease: "Power3.easeOut",
      onComplete: () => {
        // Navega para a rota APÓS o preloader subir completamente
        if (category === "fashion") {
          router.navigateFromSplash("/moda-acessorios");
        } else if (category === "beauty") {
          router.navigateFromSplash("/");
        } else {
          router.navigateFromSplash("/");
        }
      },
    })

    // Libera scroll do body
    .to(
      "body",
      {
        overflow: "auto",
      },
      "-=1.5"
    )

    // Esconde preloader
    .to(".preloader", {
      display: "none",
    });
}

// ============================================================================
// MENU CONSTANTS & CONFIGURATION
// ============================================================================

const duration = {
  fast: 0.15,
  medium: 0.2,
  slow: 0.25,
  verySlow: 0.3,
};

const easing = {
  out: "power2.out",
  in: "power2.in",
};

const stagger = {
  buttonsOpen: 0.03,
  buttonsClose: 0.02,
};

const blur = {
  initial: "blur(10px)",
  none: "blur(0px)",
};

const transform = {
  buttonsY: 20,
  imageY: 20,
  imageYClose: 10,
  menuRotationOpen: 45,
  menuRotationClose: 0,
  navLeftX: 20,
  navRightX: -20,
};

const layout = {
  padding: "20px",
  maxHeight: "50vh",
  noPadding: "0",
  noMargin: "0",
};

const timing = {
  overlap: 0.1,
  delay: 0.05,
  closeStartOffset: -0.2,
  dropdownOffset: -0.15,
};

class DOMElements {
  constructor() {
    console.log("DOMElements: Looking for menu elements...");
    this.menuBtn = this.getElement("#menu-btn");
    this.dropdown = this.getElement("#dropdown");
    this.dropdownContent = this.getElement(".dropdown__content");
    this.dropdownImage = this.getElement(".dropdown__image");
    this.allContent = this.getElement("#all-content");
    this.navigation = this.getElement("#navigation");
    this.navLogo = this.getElement(".navigation__logo");
    this.navRight = this.getElement(".navigation__right");
    this.menuButtons = this.getAllElements(".dropdown__button");
    console.log("DOMElements: menuBtn found?", !!this.menuBtn);
    console.log("DOMElements: dropdown found?", !!this.dropdown);
  }

  getElement(selector) {
    const element = document.querySelector(selector);
    if (!element) {
      console.warn(`Element not found: ${selector}`);
    }
    return element;
  }

  getAllElements(selector) {
    return document.querySelectorAll(selector);
  }

  get navElements() {
    return [this.navLogo, this.navRight];
  }

  get reversedButtons() {
    return Array.from(this.menuButtons).reverse();
  }

  hasRequiredElements() {
    return !!(this.menuBtn && this.dropdown && this.allContent);
  }
}

class GSAPAnimationBuilder {
  static setInitialButtonState(buttons) {
    gsap.set(buttons, {
      opacity: 0,
      y: transform.buttonsY,
      filter: blur.initial,
    });
  }

  static setInitialImageState(image) {
    gsap.set(image, {
      opacity: 0,
      y: transform.imageY,
    });
  }

  static createTimeline(config = {}) {
    return gsap.timeline(config);
  }

  static animateProperty(element, properties, position) {
    return gsap.to(element, {
      ...properties,
      force3D: true,
    });
  }
}

class OpenAnimationSequence {
  constructor(elements) {
    this.elements = elements;
  }

  execute() {
    const timeline = GSAPAnimationBuilder.createTimeline();

    this.addBodyPaddingAnimation(timeline);
    this.addNavigationAnimation(timeline);
    this.addDropdownMarginAnimation(timeline);
    this.addDropdownExpansionAnimation(timeline);
    this.addMenuButtonRotationAnimation(timeline);
    this.addMenuButtonsAnimation(timeline);
    this.addImageAnimation(timeline);

    return timeline;
  }

  addBodyPaddingAnimation(timeline) {
    timeline.to(document.body, {
      paddingTop: layout.padding,
      paddingLeft: layout.padding,
      paddingRight: layout.padding,
      duration: duration.medium,
      ease: easing.out,
    });
  }

  addNavigationAnimation(timeline) {
    timeline.to(
      this.elements.navElements,
      {
        x: (index) => (index === 0 ? transform.navLeftX : transform.navRightX),
        duration: duration.medium,
        ease: easing.out,
        force3D: true,
      },
      "<"
    );
  }

  addDropdownMarginAnimation(timeline) {
    timeline.to(
      this.elements.dropdown,
      {
        marginTop: layout.padding,
        duration: duration.medium,
        ease: easing.out,
      },
      "<"
    );
  }

  addDropdownExpansionAnimation(timeline) {
    timeline.fromTo(
      this.elements.dropdown,
      {
        opacity: 0,
        scaleY: 0,
        maxHeight: 0,
      },
      {
        opacity: 1,
        scaleY: 1,
        maxHeight: layout.maxHeight,
        duration: duration.slow,
        ease: easing.out,
        force3D: true,
      },
      timing.dropdownOffset
    );
  }

  addMenuButtonRotationAnimation(timeline) {
    timeline.to(
      this.elements.menuBtn,
      {
        rotation: transform.menuRotationOpen,
        duration: duration.medium,
        ease: easing.out,
        force3D: true,
      },
      "<"
    );
  }

  addMenuButtonsAnimation(timeline) {
    timeline.to(
      this.elements.menuButtons,
      {
        opacity: 1,
        y: 0,
        filter: blur.none,
        stagger: stagger.buttonsOpen,
        duration: duration.medium,
        ease: easing.out,
        force3D: true,
      },
      `-=${timing.overlap}`
    );
  }

  addImageAnimation(timeline) {
    timeline.to(
      this.elements.dropdownImage,
      {
        opacity: 1,
        y: 0,
        duration: duration.medium,
        ease: easing.out,
        force3D: true,
      },
      `-=${timing.overlap}`
    );
  }
}

class CloseAnimationSequence {
  constructor(elements, onComplete) {
    this.elements = elements;
    this.onComplete = onComplete;
  }

  execute() {
    const timeline = GSAPAnimationBuilder.createTimeline({
      onComplete: this.onComplete,
    });

    this.addImageAnimation(timeline);
    this.addMenuButtonsAnimation(timeline);
    this.addMenuButtonRotationAnimation(timeline);
    this.addDropdownCollapseAnimation(timeline);
    this.addDropdownMarginAnimation(timeline);
    this.addBodyPaddingAnimation(timeline);
    this.addNavigationAnimation(timeline);

    return timeline;
  }

  addImageAnimation(timeline) {
    timeline.to(this.elements.dropdownImage, {
      opacity: 0,
      y: transform.imageYClose,
      duration: duration.fast,
      ease: easing.in,
      force3D: true,
    });
  }

  addMenuButtonsAnimation(timeline) {
    timeline.to(
      this.elements.reversedButtons,
      {
        opacity: 0,
        y: transform.buttonsY,
        filter: blur.initial,
        stagger: stagger.buttonsClose,
        duration: duration.fast,
        ease: easing.in,
        force3D: true,
      },
      `+=${timing.delay}`
    );
  }

  addMenuButtonRotationAnimation(timeline) {
    timeline.to(
      this.elements.menuBtn,
      {
        rotation: transform.menuRotationClose,
        duration: duration.medium,
        ease: easing.in,
        force3D: true,
      },
      "<"
    );
  }

  addDropdownCollapseAnimation(timeline) {
    timeline.to(
      this.elements.dropdown,
      {
        opacity: 0,
        scaleY: 0,
        maxHeight: 0,
        duration: duration.verySlow,
        ease: easing.in,
        force3D: true,
      },
      `+=${timing.delay}`
    );
  }

  addDropdownMarginAnimation(timeline) {
    timeline.to(
      this.elements.dropdown,
      {
        marginTop: layout.noMargin,
        duration: duration.verySlow,
        ease: easing.in,
      },
      "<"
    );
  }

  addBodyPaddingAnimation(timeline) {
    timeline.to(
      document.body,
      {
        paddingTop: layout.noPadding,
        paddingLeft: layout.noPadding,
        paddingRight: layout.noPadding,
        duration: duration.slow,
        ease: easing.in,
      },
      timing.closeStartOffset
    );
  }

  addNavigationAnimation(timeline) {
    timeline.to(
      this.elements.navElements,
      {
        x: 0,
        duration: duration.slow,
        ease: easing.in,
        force3D: true,
      },
      "<"
    );
  }
}

class MenuStateManager {
  constructor() {
    this.isOpen = false;
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  get state() {
    return this.isOpen;
  }
}

class MenuController {
  constructor(elements) {
    this.elements = elements;
    this.state = new MenuStateManager();
  }

  init() {
    if (!this.elements.hasRequiredElements()) {
      console.error(
        "Required DOM elements not found. Menu initialization aborted."
      );
      return false;
    }

    this.attachEventListeners();
    return true;
  }

  attachEventListeners() {
    this.elements.menuBtn.addEventListener("click", () => this.toggle());

    // Escuta evento de navegação para fechar o menu
    window.addEventListener("close-menu-for-navigation", () => {
      if (this.state.state) {
        this.close();
      }
    });
  }

  toggle() {
    if (this.state.state) {
      this.close();
      return;
    }

    this.open();
  }

  open() {
    this.updateDOMClasses(true);
    this.prepareAnimationState();
    this.executeOpenAnimation();
    this.state.open();
  }

  close() {
    this.executeCloseAnimation();
    this.state.close();
  }

  updateDOMClasses(isOpening) {
    const action = isOpening ? "add" : "remove";
    this.elements.dropdown.classList[action]("open");
    this.elements.allContent.classList[action]("menu-open");
  }

  prepareAnimationState() {
    GSAPAnimationBuilder.setInitialButtonState(this.elements.menuButtons);
    GSAPAnimationBuilder.setInitialImageState(this.elements.dropdownImage);
  }

  executeOpenAnimation() {
    const sequence = new OpenAnimationSequence(this.elements);
    sequence.execute();
  }

  executeCloseAnimation() {
    const sequence = new CloseAnimationSequence(this.elements, () =>
      this.onCloseComplete()
    );
    sequence.execute();
  }

  onCloseComplete() {
    this.updateDOMClasses(false);
  }
}

class Application {
  static initialize() {
    const elements = new DOMElements();
    const menuController = new MenuController(elements);

    const initialized = menuController.init();

    if (!initialized) {
      console.error("Application failed to initialize");
      return null;
    }

    console.log("✓ Menu system initialized successfully");
    return menuController;
  }
}

// ============================================================================
// SCROLL TRIGGER ANIMATIONS (Keyhole Effect)
// ============================================================================

function initScrollAnimations() {
  // Registra os plugins ScrollTrigger e ScrollToPlugin
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  // ====== KEYHOLE REVEAL EFFECT ======
  const keyholeImage = document.querySelector(".keyhole-image img");
  const keyholeOverlay = document.querySelector(".keyhole-overlay");

  if (keyholeImage) {
    // Animação da imagem - expande o retângulo do centro até preencher tela
    gsap.to(keyholeImage, {
      clipPath: "inset(0% 0% 0% 0% round 0px)", // Expande até cobrir tela toda
      ease: "none",
      scrollTrigger: {
        trigger: ".keyhole-section",
        start: "top top",
        end: "bottom center",
        scrub: 1.5,
        pin: ".keyhole-container",
        // markers: true, // Descomente para debug
      },
    });

    // Animação do overlay - desaparece conforme expande
    gsap.to(keyholeOverlay, {
      opacity: 0,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".keyhole-section",
        start: "top top",
        end: "center center",
        scrub: 1,
      },
    });

    // Animação do conteúdo de texto - APARECE ao fazer scroll
    const keyholeSubtitle = document.querySelector(".keyhole-subtitle");
    const keyholeTitle = document.querySelector(".keyhole-title");
    const keyholeButton = document.querySelector(".keyhole-button");

    // Anima o subtitle
    if (keyholeSubtitle) {
      gsap.to(keyholeSubtitle, {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: ".keyhole-section",
          start: "top center",
          end: "center center",
          scrub: 1,
        },
      });
    }

    // Anima o título
    if (keyholeTitle) {
      gsap.to(keyholeTitle, {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: ".keyhole-section",
          start: "top center",
          end: "center center",
          scrub: 1,
        },
      });
    }

    // Anima o botão
    if (keyholeButton) {
      gsap.to(keyholeButton, {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: ".keyhole-section",
          start: "20% center",
          end: "center center",
          scrub: 1,
        },
      });
    }
  }

  // Seleciona todos os wrappers da galeria (para aplicar clip-path no container)
  const galleryWrappers = document.querySelectorAll(".grid-item__wrapper");

  galleryWrappers.forEach((wrapper, index) => {
    // Verifica se tem vídeo ou imagem dentro
    const hasMedia = wrapper.querySelector("img, video");

    if (hasMedia) {
      // Adiciona clip-path inicial no wrapper - começa mostrando tudo sem cortar
      gsap.set(wrapper, {
        clipPath: "inset(0% 0% 0% -90%)", // -10% para dar espaço à esquerda e não cortar
      });

      // Animação com ScrollTrigger no wrapper
      gsap.to(wrapper, {
        clipPath: "inset(0% 0% 0% 100%)", // Esconde completamente da direita para esquerda
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top center",
          end: "bottom center",
          scrub: 1, // Sincroniza com o scroll
          // markers: true, // Descomente para ver os marcadores de debug
        },
      });
    }
  });

  // Animação suave de fade out para o texto ao fazer scroll
  const textContent = document.querySelectorAll(".grid-content");

  textContent.forEach((content) => {
    // Animação de entrada (aparece)
    gsap.from(content, {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: content,
        start: "top 100%",
        end: "top 50%",
        scrub: 1,
      },
    });

    // Animação de saída (desaparece suavemente)
    gsap.to(content, {
      opacity: 0,
      y: -30,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: content,
        start: "top 10%",
        end: "top top",
        scrub: 2, // Scrub mais lento = mais suave
        // markers: true, // Descomente para debug
      },
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Verifica se existe splash screen
  const splashScreen = document.getElementById("splash-screen");

  if (splashScreen) {
    // Inicializa splash screen primeiro (usuário escolhe a categoria)
    new SplashScreen();
  } else {
    // Se não tem splash, inicia preloader direto e router
    initPreloader();
    router.init();
  }

  // Função para inicializar features após cada mudança de página
  const initializePageFeatures = () => {
    // Inicializa animação dos botões
    const buttonElements = document.querySelectorAll('[data-block="button"]');
    buttonElements.forEach((buttonElement) => {
      new Button(buttonElement);
    });

    // Inicializa controle de hover nos vídeos da galeria
    // Excluindo os vídeos com classe hero-video-hover que são controlados pelo HomePage
    const galleryVideos = document.querySelectorAll(
      ".grid-item__wrapper video:not(.hero-video-hover)"
    );
    galleryVideos.forEach((video) => {
      new VideoHoverController(video);
    });

    // Inicializa menu após preloader
    Application.initialize();

    // Inicializa animações de scroll
    initScrollAnimations();

    // Inicializa seções animadas
    initAnimatedSections();

    // Inicializa controles de vídeo
    initVideoControls();
  };

  // Inicializa features na primeira carga
  initializePageFeatures();

  // Reinicializa features quando a página mudar via SPA
  window.addEventListener("page-loaded", () => {
    console.log("Page loaded event - reinitializing menu");
    // Aguarda o DOM ser atualizado
    setTimeout(() => {
      Application.initialize();
    }, 200);
  });
});

// ============================================================================
// ANIMATED SECTIONS - Wheel Navigation (Only in section area)
// ============================================================================

function initAnimatedSections() {
  const wrapper = document.querySelector(".animated-sections-wrapper");

  if (!wrapper) {
    return;
  }

  const sections = wrapper.querySelectorAll("section");
  const images = wrapper.querySelectorAll(".bg");
  const headings = gsap.utils.toArray(
    ".animated-sections-wrapper .section-heading"
  );
  const outerWrappers = gsap.utils.toArray(".animated-sections-wrapper .outer");
  const innerWrappers = gsap.utils.toArray(".animated-sections-wrapper .inner");
  const clamp = gsap.utils.clamp(0, sections.length - 1);

  let animating = false;
  let currentIndex = -1;
  let isInSection = false; // Controla se está na área das seções

  const touch = {
    startX: 0,
    startY: 0,
    dx: 0,
    dy: 0,
    startTime: 0,
    dt: 0,
  };

  // Split text
  let splitHeadings = [];
  if (typeof SplitText !== "undefined") {
    splitHeadings = headings.map((heading) => {
      return new SplitText(heading, {
        type: "chars, words, lines",
        linesClass: "clip-text",
      });
    });
  }

  gsap.set(outerWrappers, { yPercent: 100 });
  gsap.set(innerWrappers, { yPercent: -100 });

  // Detecta quando o usuário entra na área das seções
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isInSection = true;
          if (currentIndex === -1) {
            gotoSection(0, 1); // Inicia primeira seção
          }
        } else {
          isInSection = false;
          // Quando sair, reseta para poder entrar de novo
          if (currentIndex !== -1) {
            gsap.set(sections[currentIndex], { autoAlpha: 0 });
            currentIndex = -1;
          }
        }
      });
    },
    { threshold: 0.3 }
  ); // Diminui threshold para detectar saída mais cedo

  observer.observe(wrapper);

  function gotoSection(index, direction) {
    index = clamp(index);

    if (currentIndex === index) {
      return;
    }

    animating = true;
    let fromTop = direction === -1;
    let dFactor = fromTop ? -1 : 1;
    let tl = gsap.timeline({
      defaults: { duration: 1.25, ease: "power1.inOut" },
      onComplete: () => (animating = false),
    });

    if (currentIndex >= 0) {
      gsap.set(sections[currentIndex], { zIndex: 0 });
      tl.to(images[currentIndex], { yPercent: -15 * dFactor }).set(
        sections[currentIndex],
        { autoAlpha: 0 }
      );
    }

    gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });
    tl.fromTo(
      [outerWrappers[index], innerWrappers[index]],
      { yPercent: (i) => (i ? -100 * dFactor : 100 * dFactor) },
      { yPercent: 0 },
      0
    ).fromTo(images[index], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0);

    // Anima texto se disponível
    if (splitHeadings.length > 0 && splitHeadings[index]) {
      tl.fromTo(
        splitHeadings[index].chars,
        { autoAlpha: 0, yPercent: 150 * dFactor },
        {
          autoAlpha: 1,
          yPercent: 0,
          duration: 1,
          ease: "power2",
          stagger: {
            each: 0.02,
            from: "random",
          },
        },
        0.2
      );
    }

    // Anima conteúdo da segunda seção (reutilizando classes do keyhole)
    if (index === 1) {
      const subtitle = sections[index].querySelector(".keyhole-subtitle");
      const title = sections[index].querySelector(".keyhole-title");
      const button = sections[index].querySelector(".keyhole-button");

      if (subtitle && title && button) {
        tl.fromTo(
          [subtitle, title, button],
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.15,
          },
          0.3
        );
      }
    } else {
      // Esconde conteúdo da segunda seção quando sair dela
      const prevSection = sections[1];
      if (prevSection && currentIndex === 1) {
        const subtitle = prevSection.querySelector(".keyhole-subtitle");
        const title = prevSection.querySelector(".keyhole-title");
        const button = prevSection.querySelector(".keyhole-button");

        if (subtitle && title && button) {
          gsap.set([subtitle, title, button], { opacity: 0, y: 20 });
        }
      }
    }

    currentIndex = index;
  }

  function handleWheel(e) {
    if (!isInSection || animating) return;

    // Se está na primeira seção E rola para CIMA = quer SAIR
    if (currentIndex === 0 && e.wheelDeltaY > 0) {
      // Scroll suave para FORA da seção
      const wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: wrapperTop - window.innerHeight,
        behavior: "smooth",
      });
      return;
    }

    e.preventDefault();

    e.wheelDeltaY < 0
      ? gotoSection(currentIndex + 1, 1)
      : gotoSection(currentIndex - 1, -1);
  }

  function handleTouchStart(e) {
    if (!isInSection) return;
    const t = e.changedTouches[0];
    touch.startX = t.pageX;
    touch.startY = t.pageY;
  }

  function handleTouchMove(e) {
    if (!isInSection) return;
    e.preventDefault();
  }

  function handleTouchEnd(e) {
    if (!isInSection || animating) return;
    const t = e.changedTouches[0];
    touch.dx = t.pageX - touch.startX;
    touch.dy = t.pageY - touch.startY;
    if (touch.dy > 10) gotoSection(currentIndex - 1, -1);
    if (touch.dy < -10) gotoSection(currentIndex + 1, 1);
  }

  document.addEventListener("wheel", handleWheel, { passive: false });
  document.addEventListener("touchstart", handleTouchStart, { passive: true });
  document.addEventListener("touchmove", handleTouchMove, { passive: false });
  document.addEventListener("touchend", handleTouchEnd, { passive: true });
}

// ============================================================================
// VIDEO CONTROLS - PLAY/PAUSE & MUTE/UNMUTE
// ============================================================================

function initVideoControls() {
  const video = document.getElementById("section-video");
  const playPauseBtn = document.getElementById("play-pause-btn");
  const muteUnmuteBtn = document.getElementById("mute-unmute-btn");

  if (!video || !playPauseBtn || !muteUnmuteBtn) return;

  const iconPlay = playPauseBtn.querySelector(".icon-play");
  const iconPause = playPauseBtn.querySelector(".icon-pause");
  const iconMute = muteUnmuteBtn.querySelector(".icon-mute");
  const iconUnmute = muteUnmuteBtn.querySelector(".icon-unmute");

  // Play/Pause Toggle
  playPauseBtn.addEventListener("click", () => {
    if (video.paused) {
      video.play();
      iconPlay.style.display = "none";
      iconPause.style.display = "block";
    } else {
      video.pause();
      iconPlay.style.display = "block";
      iconPause.style.display = "none";
    }
  });

  // Mute/Unmute Toggle
  muteUnmuteBtn.addEventListener("click", () => {
    if (video.muted) {
      video.muted = false;
      iconMute.style.display = "none";
      iconUnmute.style.display = "block";
    } else {
      video.muted = true;
      iconMute.style.display = "block";
      iconUnmute.style.display = "none";
    }
  });

  // Sincroniza estado inicial (video começa pausado mostra play, video tocando mostra pause)
  if (!video.paused) {
    iconPlay.style.display = "none";
    iconPause.style.display = "block";
  }
}

// Inicializa controles após página carregar
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initVideoControls);
} else {
  initVideoControls();
}
