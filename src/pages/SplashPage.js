import "../styles/splash-page.css";
import { router } from "../router/router.js";

const ANIMATION_CONFIG = {
  duration: {
    hover: 0.6,
    scale: 0.8,
    flex: 0.5,
    exit: 0.8,

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
    ".preloader .imagem-logo svg",
    {
      opacity: 0,
      duration: 0.3,
    },
    "<",
  );
}

export class SplashPage extends HTMLElement {
  constructor() {
    super();
    this.options = null;
    this.buttons = [];
    this.isTransitioning = false;
  }

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

  render() {
    this.innerHTML = `
      <div class="splash-page">
        <!-- Logo Central -->
        <div class="splash-logo">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 106 32" fill="#ffffff" width="180" height="54">
            <path d="M0.320558 0.624729H14.0404C25.8369 0.624729 30.453 8.12148 30.453 16.0578C30.453 24.133 24.5333 31.329 13.2711 31.329H0.341928C0.106853 31.329 0.0213705 31.167 0.0213705 31.0282C0.0213705 30.8662 0.170964 30.7274 0.384669 30.7274H2.79954C3.5475 30.7274 4.03902 30.2415 4.03902 29.3391V2.66088C4.03902 1.98988 3.73984 1.24946 2.75679 1.24946H0.299187C0.106853 1.24946 0 1.11063 0 0.948662C0 0.809834 0.042741 0.624729 0.320558 0.624729ZM8.89013 29.8944C8.89013 30.5654 9.16794 30.7737 9.57399 30.7737H13.207C22.1612 30.7737 25.4095 23.3463 25.4095 15.8959C25.4095 8.44541 21.9689 1.22632 14.4037 1.22632H9.46713C8.95424 1.22632 8.9115 1.68908 8.9115 1.89732L8.89013 29.8944ZM31.8207 0.624729C31.607 0.624729 31.4146 0.717281 31.4146 0.902386C31.4146 1.08749 31.5215 1.20318 31.7138 1.20318H34.1287C34.6843 1.20318 35.2186 1.61967 35.2186 2.77657V29.3623C35.2186 29.9176 34.8339 30.7505 34.1501 30.7505H31.7566C31.4788 30.7505 31.4574 30.9819 31.4574 31.0745C31.4574 31.167 31.436 31.329 31.7566 31.329H43.3821C43.5531 31.329 43.7882 31.3059 43.7882 31.1208C43.7882 30.9356 43.7454 30.7505 43.4462 30.7505H41.2023C40.8818 30.7505 40.0056 30.5423 40.0056 29.4779V2.49892C40.0056 1.73536 40.4544 1.22632 41.2664 1.22632H43.4676C43.6599 1.22632 43.7668 1.11063 43.7668 0.948662C43.7668 0.786696 43.6599 0.647867 43.4035 0.647867H31.8207V0.624729ZM49.9856 15.9884C49.9856 7.49675 53.4904 0.624729 60.0725 0.624729C66.5264 0.624729 70.1594 7.49675 70.1594 15.9884C70.1594 24.4801 66.8469 31.3521 60.0725 31.3521C53.5117 31.3753 49.9856 24.4801 49.9856 15.9884ZM60.0725 32C69.4328 32 75.331 24.8272 75.331 16.0116C75.331 7.19595 69.4969 0 60.0725 0C50.6695 0 44.8139 7.17281 44.8139 15.9884C44.8139 24.804 50.9045 32 60.0725 32ZM105.25 31.1439C101.574 31.5604 99.5438 25.0354 97.6846 21.9349C96.2955 19.6443 93.3464 17.3073 90.44 16.8445C95.227 16.5437 100.591 14.8778 100.591 9.00072C100.591 4.23427 97.8769 0.624729 87.9182 0.624729H76.4423C76.2927 0.624729 76.1431 0.717281 76.1431 0.902386C76.1431 1.08749 76.2927 1.20318 76.4423 1.20318H79.0709C79.6265 1.20318 80.1608 1.61967 80.1608 2.77657V29.3623C80.1608 29.9176 79.7761 30.7505 79.0922 30.7505H76.5064C76.2927 30.7505 76.2072 30.9356 76.2072 31.0282C76.2072 31.1208 76.2927 31.329 76.5064 31.329H88.6876C88.8586 31.329 89.0081 31.2364 89.0081 31.0513C89.0081 30.8662 88.9013 30.7505 88.6662 30.7505H86.2086C85.888 30.7505 85.0119 30.5192 85.0119 29.4779V16.914H86.2727C92.2992 16.914 92.748 23.9942 95.7398 28.0434C98.3043 31.5141 101.659 31.9537 103.561 31.9537C104.374 31.9537 104.929 31.9306 105.442 31.7918C105.763 31.6761 105.827 31.0745 105.25 31.1439ZM86.23 1.20318H88.0037C91.0383 1.20318 95.9536 2.49891 95.9536 8.69993C95.9536 14.3919 91.594 16.3124 87.5549 16.3124H84.9691V2.49892C84.9691 1.71222 85.4179 1.20318 86.23 1.20318Z"/>
          </svg>
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
              </button>
            </div>
          </div>

        </div>
        
      </div>

    `;
  }

  cacheElements() {
    this.splashElement = this.querySelector(".splash-page");
    this.options = this.querySelectorAll(".splash-option");
    this.buttons = this.querySelectorAll(".splash-option-button");
    this.videos = this.querySelectorAll(".splash-option-bg");
  }

  initButtonEffects() {
    if (!window.gsap) return;

    this.buttons.forEach((button) => {
      button.addEventListener("mouseenter", () => {
        gsap.to(button, {
          "--underline-width": "100%",
          duration: 0.35,
          ease: "power2.inOut",
        });
      });

      button.addEventListener("mouseleave", () => {
        gsap.to(button, {
          "--underline-width": "0%",
          duration: 0.35,
          ease: "power2.inOut",
        });
      });
    });
  }

  initHoverEffects() {
    if (!window.gsap) return;

    this.options.forEach((option) => {
      const darkening = option.querySelector(".splash-option-darkening");
      const bg = option.querySelector(".splash-option-bg");

      if (!darkening || !bg) return;

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

  handleCategoryClick(category) {
    this.isTransitioning = true;

    const targetRoute = ROUTES[category] || ROUTES.beauty;

    const contents = this.querySelectorAll(".splash-option-content");
    const darkenings = this.querySelectorAll(".splash-option-darkening");
    const videos = this.querySelectorAll(".splash-option-bg");
    const logo = this.querySelector(".splash-logo");
    const preloader = document.querySelector(".preloader");

    const isMobile = window.innerWidth <= 480;

    const tl = gsap.timeline();

    tl.to(contents, {
      opacity: 0,
      y: 20,
      duration: ANIMATION_CONFIG.duration.contentFade,
      ease: ANIMATION_CONFIG.ease.smooth,
      stagger: 0.1,
    });

    if (isMobile && logo) {
      tl.to(
        logo,
        {
          opacity: 0,
          y: -30,
          duration: ANIMATION_CONFIG.duration.contentFade,
          ease: ANIMATION_CONFIG.ease.smooth,
        },
        "<",
      );
    }

    tl.to(
      darkenings,
      {
        opacity: 1,
        duration: ANIMATION_CONFIG.duration.videoDarken,
        ease: ANIMATION_CONFIG.ease.smooth,
      },
      "<0.2",
    );

    tl.to(
      videos,
      {
        opacity: 0,
        duration: ANIMATION_CONFIG.duration.videoDarken,
        ease: ANIMATION_CONFIG.ease.smooth,
      },
      "<0.3",
    );

    tl.to({}, { duration: ANIMATION_CONFIG.duration.logoHold });

    tl.call(() => {
      if (preloader) {
        gsap.set(preloader, {
          display: "flex",
          height: "100vh",
          opacity: 0,
        });
        gsap.set(".preloader .text-container", { visibility: "visible" });
        gsap.set(".preloader .imagem-logo svg", { opacity: 1 });
      }
    });

    tl.to(
      logo,
      {
        opacity: 0,
        duration: ANIMATION_CONFIG.duration.preloaderFade,
        ease: ANIMATION_CONFIG.ease.smooth,
      },
      ">",
    );

    tl.to(
      preloader,
      {
        opacity: 1,
        duration: ANIMATION_CONFIG.duration.preloaderFade,
        ease: ANIMATION_CONFIG.ease.smooth,
      },
      "<",
    );

    tl.call(() => {
      router.navigateFromSplash(targetRoute);

      setTimeout(() => {
        hidePreloaderGlobal();
      }, 800);
    });
  }

  initVideos() {
    this.videos.forEach((video) => {
      video.play().catch((err) => {
        console.warn("Autoplay bloqueado:", err.message);
      });
    });
  }

  cleanup() {
    if (this.videos) {
      this.videos.forEach((video) => {
        video.pause();
        video.src = "";
      });
    }

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

customElements.define("splash-page", SplashPage);
