import "./style.css";
import "./styles/session-modal.css";
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
import "./styles/boutiques.css";
import "./styles/filter-sidebar.css";
import "./styles/dior-spa.css";
import "./styles/primavera-verao.css";
import "./styles/dados-pessoais.css";

import { authService } from "./services/AuthService.js";
import { cartService } from "./services/CartService.js";
console.log("🚀 Main.js: Serviços importados", { authService, cartService });

import { router } from "./router/router.js";
import "./pages/HomePage.js";
import "./pages/DiorHolidayPage.js";
import "./pages/ArteDePresentearPage.js";
import "./pages/MissDiorPage.js";
import "./pages/ComprasMissDiorParfumPage.js";
import "./pages/MissDiorEssencePage.js";
import "./pages/LoginPage.js";
import "./pages/RegisterPage.js";
import "./pages/DadosPessoaisPage.js";
import "./pages/FinalizarCompraPage.js";
import "./pages/DiorVeraoPage.js";
import "./pages/ModaEAcessoriosPage.js";
import "./pages/PresenteParaElaPage.js";
import "./pages/ColecaoPage.js";
import "./pages/ProductDetailPage.js";
import "./pages/ColecaoProductDetailPage.js";
import "./components/SessionExpiredModal.js";
import "./pages/BoutiquesPage.js";
import "./pages/SplashPage.js";
import "./pages/PerfumeProductDetailPage.js";
import "./pages/GrisDiorPage.js";
import "./pages/DiorivieraPage.js";
import "./pages/DiorRivieraPageDois.js";
import "./pages/DiorSpaPage.js";
import "../public/images/bastidores/PrimaveraVerao2026Page.js";
import "./components/ProfileMenu.js";
import "./components/FragrancesModal.js";
import "./components/AppNavigation.js";
import "./components/FooterSection.js";
import "./components/Toast.js";
import "./components/ModaAcessoriosContent.js";
import "./styles/smooth-scroll.css";

router.register("/", "splash-page");
router.register("/home", "home-page");
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
router.register("/colecao/product/:id", "colecao-product-detail-page");
router.register("/perfume/:id", "perfume-product-detail-page");
router.register("/gris-dior", "gris-dior-page");
router.register("/dioriviera", "dioriviera-page");
router.register("/dioriviera-dois", "dioriviera-page-dois");
router.register("/dior-spa", "dior-spa-page");
router.register("/primavera-verao-2026", "primavera-verao-2026-page");
router.register("/boutiques", "boutiques-page");
router.register("/minha-conta/dados", "dados-pessoais-page");

class Button {
  constructor(buttonElement) {
    this.block = buttonElement;
    if (!this.init()) return; // Se não encontrar elementos necessários, aborta
    this.initEvents();
  }

  init() {
    const el = gsap.utils.selector(this.block);
    const flair = el(".button__flair");

    if (!flair || flair.length === 0) {
      return false;
    }

    this.DOM = {
      button: this.block,
      flair: flair,
    };

    this.xSet = gsap.quickSetter(this.DOM.flair, "xPercent");
    this.ySet = gsap.quickSetter(this.DOM.flair, "yPercent");
    return true;
  }

  getXY(e) {
    const { left, top, width, height } = this.DOM.button.getBoundingClientRect();

    const xTransformer = gsap.utils.pipe(
      gsap.utils.mapRange(0, width, 0, 100),
      gsap.utils.clamp(0, 100),
    );

    const yTransformer = gsap.utils.pipe(
      gsap.utils.mapRange(0, height, 0, 100),
      gsap.utils.clamp(0, 100),
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

window.Button = Button;

function initScrollAnimations() {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  const galleryWrappers = document.querySelectorAll(".grid-item__wrapper");

  galleryWrappers.forEach((wrapper, index) => {
    const hasMedia = wrapper.querySelector("img, video");

    if (hasMedia) {
      gsap.set(wrapper, {
        clipPath: "inset(0% 0% 0% -90%)", // -10% para dar espaço à esquerda e não cortar
      });

      gsap.to(wrapper, {
        clipPath: "inset(0% 0% 0% 100%)", // Esconde completamente da direita para esquerda
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top center",
          end: "bottom center",
          scrub: 1, // Sincroniza com o scroll
        },
      });
    }
  });

  const textContent = document.querySelectorAll(".grid-content");

  textContent.forEach((content) => {
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

    gsap.to(content, {
      opacity: 0,
      y: -30,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: content,
        start: "top 10%",
        end: "top top",
        scrub: 2, // Scrub mais lento = mais suave
      },
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  router.init();

  const initializePageFeatures = () => {
    const buttonElements = document.querySelectorAll('[data-block="button"]');
    buttonElements.forEach((buttonElement) => {
      new Button(buttonElement);
    });

    const galleryVideos = document.querySelectorAll(
      ".grid-item__wrapper video:not(.hero-video-hover)",
    );
    galleryVideos.forEach((video) => {
      new VideoHoverController(video);
    });

    initScrollAnimations();

    initAnimatedSections();

    initVideoControls();
  };

  initializePageFeatures();

  window.addEventListener("page-loaded", () => {
    setTimeout(() => {
      initScrollAnimations();
      initAnimatedSections();
    }, 200);
  });
});

function initAnimatedSections() {
  const wrapper = document.querySelector(".animated-sections-wrapper");

  if (!wrapper) {
    return;
  }

  const sections = wrapper.querySelectorAll("section");
  const images = wrapper.querySelectorAll(".bg");
  const headings = gsap.utils.toArray(".animated-sections-wrapper .section-heading");
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

          if (currentIndex !== -1) {
            gsap.set(sections[currentIndex], { autoAlpha: 0 });
            currentIndex = -1;
          }
        }
      });
    },
    { threshold: 0.3 },
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
      tl.to(images[currentIndex], { yPercent: -15 * dFactor }).set(sections[currentIndex], {
        autoAlpha: 0,
      });
    }

    gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });
    tl.fromTo(
      [outerWrappers[index], innerWrappers[index]],
      { yPercent: (i) => (i ? -100 * dFactor : 100 * dFactor) },
      { yPercent: 0 },
      0,
    ).fromTo(images[index], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0);

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
        0.2,
      );
    }

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
          0.3,
        );
      }
    } else {
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

    if (currentIndex === 0 && e.wheelDeltaY > 0) {
      const wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: wrapperTop - window.innerHeight,
        behavior: "smooth",
      });
      return;
    }

    e.preventDefault();

    e.wheelDeltaY < 0 ? gotoSection(currentIndex + 1, 1) : gotoSection(currentIndex - 1, -1);
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

function initVideoControls() {
  const video = document.getElementById("section-video");
  const playPauseBtn = document.getElementById("play-pause-btn");
  const muteUnmuteBtn = document.getElementById("mute-unmute-btn");

  if (!video || !playPauseBtn || !muteUnmuteBtn) return;

  const iconPlay = playPauseBtn.querySelector(".icon-play");
  const iconPause = playPauseBtn.querySelector(".icon-pause");
  const iconMute = muteUnmuteBtn.querySelector(".icon-mute");
  const iconUnmute = muteUnmuteBtn.querySelector(".icon-unmute");

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

  if (!video.paused) {
    iconPlay.style.display = "none";
    iconPause.style.display = "block";
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initVideoControls);
} else {
  initVideoControls();
}
