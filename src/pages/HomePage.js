// ============================================================================
// HOME PAGE - Página inicial usando Web Components
// ============================================================================

import "../components/AppNavigation.js";
import "../components/HeroSection.js";
import "../components/TextContent.js";
import "../components/VideoSection.js";
import "../components/KeyholeSection.js";
import "../components/AnimatedSections.js";
import "../components/FooterSection.js";
import "../styles/arte-de-presentear.css";
import "../styles/category-interactive.css";
import "../styles/services-dior.css";
import "../styles/miss-dior-essence.css";
import "../styles/diorivera-morph.css";
import { router } from "../router/router.js";
import { cartService } from "../services/CartService.js";
import {
  initServicesDrag,
  initButtonUnderlineAnimation,
} from "../components/ServicesDragCards.js";

export class HomePage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.initDioriveraScrollMorph(); // Nova animação morph
    this.initJadoreExpandMorph(); // Morph expand (inverso)
    this.initHeroVideosHover();
    this.initHeroScrollAnimations();
    this.initHeroButtons();
    this.initKeyholeScrollAnimations();
    this.initVideoControls();
    this.initCategoryTabs();
    this.initServicesDiorSection();
    this.initParallaxBagButtons();
    this.initProductsReveal();
    this.initCategoryBagButtons();
    this.initLaMousseParallax();
  }

  // ============================================================================
  // DIORIVERA SCROLL MORPH - Animação estilo Dior.com
  // 1 imagem central → scroll → laterais diminuem + 2 imagens sobem dos lados
  // ============================================================================
  initDioriveraScrollMorph() {
    if (!window.gsap || !window.ScrollTrigger) return;

    requestAnimationFrame(() => {
      const section = this.querySelector(".diorivera-morph-section");
      const centerImage = this.querySelector(".diorivera-center");
      const leftImage = this.querySelector(".diorivera-left");
      const rightImage = this.querySelector(".diorivera-right");

      if (!section || !centerImage) return;

      // Timeline principal com ScrollTrigger
      const tl = window.gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });

      // Fase 1: Imagem central diminui (laterais contraem) - 0 a 1
      tl.to(
        centerImage,
        {
          width: "33.33%",
          borderRadius: "12px",
          duration: 1,
          ease: "power2.inOut",
        },
        0
      );

      // Fase 2: APÓS morph completo, imagens laterais sobem SINCRONIZADAS
      tl.to(
        [leftImage, rightImage],
        {
          y: "0%",
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        1
      );
    });
  }

  // ============================================================================
  // J'ADORE EXPAND MORPH - Efeito inverso: inicia com padding, expande para full
  // Mesma lógica do Diorivera, mas animando de pequeno → full-width
  // ============================================================================
  initJadoreExpandMorph() {
    if (!window.gsap || !window.ScrollTrigger) return;

    requestAnimationFrame(() => {
      const section = this.querySelector(".jadore-expand-section");
      const imageWrapper = this.querySelector(".jadore-image-wrapper");

      if (!section || !imageWrapper) return;

      // Timeline principal com ScrollTrigger (mesma lógica do Diorivera)
      const tl = window.gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });

      // Expande os 4 lados: width e height (imagem fica fixa, só o wrapper expande)
      tl.to(
        imageWrapper,
        {
          width: "100%",
          height: "100%",
          duration: 1,
          ease: "power2.inOut",
        },
        0
      );
    });
  }

  // ============================================================================
  // SERVICES DIOR SECTION - Inicialização do drag cards + animações
  // ============================================================================
  initServicesDiorSection() {
    setTimeout(() => {
      const section = this.querySelector(".services-dior-section");
      if (!section) return;

      // Inicializar drag nos cards
      const container = section.querySelector(".services-drag-container");
      const track = section.querySelector(".services-drag-track");
      const cards = section.querySelectorAll(".services-drag-card");
      const navIndicator = section.querySelector(".services-nav-indicator");

      if (container && track && cards.length > 0) {
        this.servicesDragInstance = initServicesDrag({
          container,
          track,
          cards,
          onUpdate: navIndicator
            ? (currentIndex, totalCards) => {
                navIndicator.textContent = `${currentIndex}/${totalCards}`;
              }
            : null,
        });
      }

      // Inicializar animação dos botões
      const buttons = section.querySelectorAll(".services-card-button");
      initButtonUnderlineAnimation(buttons);

      // Animação de entrada do título
      if (window.gsap && window.ScrollTrigger) {
        const title = section.querySelector(".services-title");

        if (title) {
          window.gsap.from(title, {
            scrollTrigger: {
              trigger: title,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: "power3.out",
          });
        }

        // Animação de entrada dos cards
        cards.forEach((card, index) => {
          window.gsap.from(card, {
            scrollTrigger: {
              trigger: container,
              start: "top 80%",
              toggleActions: "play none none none",
            },
            opacity: 0,
            y: 50,
            duration: 0.7,
            delay: index * 0.1,
            ease: "power3.out",
          });
        });
      }

      // Navegação ao clicar nos cards
      cards.forEach((card) => {
        const link = card.querySelector(".services-card-button");
        if (link) {
          link.addEventListener("click", (e) => {
            e.preventDefault();
            const route = link.getAttribute("data-route");
            if (route) {
              router.navigate(route);
            }
          });
        }
      });

      console.log("✅ Services Dior Section inicializada!");
    }, 300);
  }

  initHeroVideosHover() {
    // Aguardar os web components renderizarem
    setTimeout(() => {
      const heroVideos = this.querySelectorAll(".hero-video-hover");

      if (heroVideos.length === 0) {
        console.warn("Nenhum vídeo hero encontrado");
        return;
      }

      console.log(`${heroVideos.length} vídeos hero encontrados`);

      heroVideos.forEach((video, index) => {
        // Garantir que o vídeo está pausado inicialmente
        video.pause();
        video.currentTime = 0;

        // Pegar o wrapper do vídeo para melhor detecção de hover
        const wrapper =
          video.closest(".grid-item__wrapper") || video.parentElement;

        const playVideo = () => {
          console.log(`Hover no vídeo ${index + 1}`);
          video.currentTime = 0;
          video
            .play()
            .catch((err) => console.error("Erro ao reproduzir:", err));
        };

        const pauseVideo = () => {
          console.log(`Hover removido do vídeo ${index + 1}`);
          video.pause();
          video.currentTime = 0;
        };

        // Adicionar eventos no wrapper E no vídeo para garantir detecção
        if (wrapper && wrapper !== video) {
          wrapper.addEventListener("mouseenter", playVideo);
          wrapper.addEventListener("mouseleave", pauseVideo);
          console.log(
            `Event listeners adicionados ao wrapper do vídeo ${index + 1}`
          );
        }

        video.addEventListener("mouseenter", playVideo);
        video.addEventListener("mouseleave", pauseVideo);

        console.log(`Event listeners adicionados ao vídeo ${index + 1}`);
      });
    }, 100);
  }

  initHeroScrollAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;

    // Aguardar os web components renderizarem
    setTimeout(() => {
      // Selecionar os wrappers dos vídeos hero
      const heroWrappers = this.querySelectorAll(".hero-video-hover").forEach(
        (video) => {
          const wrapper = video.closest(".grid-item__wrapper");

          if (wrapper) {
            // Adiciona clip-path inicial no wrapper
            window.gsap.set(wrapper, {
              clipPath: "inset(0% 0% 0% -90%)",
            });

            // Animação com ScrollTrigger no wrapper
            window.gsap.to(wrapper, {
              clipPath: "inset(0% 0% 0% 100%)",
              ease: "none",
              scrollTrigger: {
                trigger: wrapper,
                start: "top center",
                end: "bottom center",
                scrub: 1,
              },
            });
          }
        }
      );

      // Animação do texto que aparece entre os vídeos
      const textContent = this.querySelectorAll(".grid-content");

      textContent.forEach((content) => {
        // Animação de entrada (aparece)
        window.gsap.from(content, {
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
        window.gsap.to(content, {
          opacity: 0,
          y: -30,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: content,
            start: "top 10%",
            end: "top top",
            scrub: 2,
          },
        });
      });
    }, 150);
  }

  initHeroButtons() {
    // Aguardar os web components renderizarem
    setTimeout(() => {
      // Selecionar TODOS os botões na HomePage
      // 1. Botões dentro de web components (hero-section, video-section, keyhole-section)
      // 2. Botões glass-button dos controles de vídeo
      const allButtons = this.querySelectorAll(
        'hero-section [data-block="button"], video-section [data-block="button"], keyhole-section [data-block="button"], .glass-button[data-block="button"]'
      );

      if (!allButtons.length) {
        console.warn("Nenhum botão encontrado na HomePage");
        return;
      }

      console.log(`${allButtons.length} botões encontrados na HomePage`);

      // Inicializar cada botão com a classe Button
      allButtons.forEach((button, index) => {
        if (window.Button) {
          new window.Button(button);
          console.log(`Botão ${index + 1} inicializado com GSAP`);
        } else {
          console.error("Classe Button não está disponível");
        }
      });
    }, 100);
  }

  initKeyholeScrollAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;

    // Função para inicializar as animações
    const initAnimations = () => {
      const keyholeComponent = this.querySelector("keyhole-section");
      if (!keyholeComponent) {
        console.warn("Keyhole component não encontrado");
        return false;
      }

      const keyholeImage = keyholeComponent.querySelector(".keyhole-image img");
      const keyholeOverlay = keyholeComponent.querySelector(".keyhole-overlay");
      const keyholeSubtitle =
        keyholeComponent.querySelector(".keyhole-subtitle");
      const keyholeTitle = keyholeComponent.querySelector(".keyhole-title");
      const keyholeButton = keyholeComponent.querySelector(".keyhole-button");
      const keyholeSection = keyholeComponent.querySelector(".keyhole-section");
      const keyholeContainer =
        keyholeComponent.querySelector(".keyhole-container");

      if (!keyholeImage || !keyholeSection) {
        console.warn("Keyhole elements não encontrados, aguardando...");
        return false;
      }

      console.log("Inicializando ScrollTrigger do Keyhole");

      // Animação da imagem - expande o retângulo do centro até preencher tela
      window.gsap.to(keyholeImage, {
        clipPath: "inset(0% 0% 0% 0% round 0px)",
        ease: "none",
        scrollTrigger: {
          trigger: keyholeSection,
          start: "top top",
          end: "bottom center",
          scrub: 1.5,
          pin: keyholeContainer,
        },
      });

      // Animação do overlay - desaparece conforme expande
      if (keyholeOverlay) {
        window.gsap.to(keyholeOverlay, {
          opacity: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: keyholeSection,
            start: "top top",
            end: "center center",
            scrub: 1,
          },
        });
      }

      // Anima o subtitle
      if (keyholeSubtitle) {
        window.gsap.to(keyholeSubtitle, {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: keyholeSection,
            start: "top center",
            end: "center center",
            scrub: 1,
          },
        });
      }

      // Anima o título
      if (keyholeTitle) {
        window.gsap.to(keyholeTitle, {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: keyholeSection,
            start: "top center",
            end: "center center",
            scrub: 1,
          },
        });
      }

      // Anima o botão
      if (keyholeButton) {
        window.gsap.to(keyholeButton, {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: keyholeSection,
            start: "20% center",
            end: "center center",
            scrub: 1,
          },
        });
      }

      console.log("ScrollTrigger do Keyhole inicializado com sucesso");
      return true;
    };

    // Aguardar o web component keyhole-section renderizar com retry
    const tryInit = (attempts = 0) => {
      if (attempts > 10) {
        console.error("Keyhole section não renderizou após 10 tentativas");
        return;
      }

      if (!initAnimations()) {
        setTimeout(() => tryInit(attempts + 1), 100);
      }
    };

    // Iniciar após um pequeno delay para garantir que o DOM está pronto
    setTimeout(() => tryInit(), 100);
  }

  initCategoryTabs() {
    requestAnimationFrame(() => {
      const tabs = this.querySelectorAll(".category-tab");
      const contents = this.querySelectorAll(".category-content");

      tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          const category = tab.dataset.category;

          // Remove active class from all tabs
          tabs.forEach((t) => t.classList.remove("active"));
          tab.classList.add("active");

          // Animate out current content
          const activeContent = this.querySelector(".category-content.active");
          if (activeContent) {
            this.animateOut(activeContent, () => {
              activeContent.classList.remove("active");

              // Show new content
              const newContent = this.querySelector(
                `[data-content="${category}"]`
              );
              if (newContent) {
                newContent.classList.add("active");
                this.animateIn(newContent);
              }
            });
          }
        });
      });

      // Animate initial content
      const initialContent = this.querySelector(".category-content.active");
      if (initialContent && window.gsap) {
        this.revealImages(initialContent);
      }
    });
  }

  animateOut(element, callback) {
    if (!window.gsap) {
      element.style.opacity = "0";
      setTimeout(callback, 300);
      return;
    }

    const items = element.querySelectorAll(".category-item");

    window.gsap.to(items, {
      opacity: 0,
      y: 20,
      stagger: 0.05,
      duration: 0.3,
      ease: "power2.in",
      onComplete: callback,
    });
  }

  animateIn(element) {
    if (!window.gsap) {
      element.style.opacity = "1";
      return;
    }

    const items = element.querySelectorAll(".category-item");

    // Reset initial state
    window.gsap.set(items, {
      opacity: 0,
      y: 30,
    });

    // Animate in
    window.gsap.to(items, {
      opacity: 1,
      y: 0,
      stagger: 0.08,
      duration: 0.6,
      ease: "power3.out",
    });

    // Reveal images
    this.revealImages(element);
  }

  revealImages(container) {
    if (!window.gsap) return;

    const imageWraps = container.querySelectorAll(".category-image-wrap");

    imageWraps.forEach((wrap, index) => {
      const overlay = wrap.querySelector(".image-reveal-overlay");
      const image = wrap.querySelector(".category-image");

      // Set initial states
      window.gsap.set(overlay, {
        scaleX: 1,
        transformOrigin: "left center",
      });

      window.gsap.set(image, {
        scale: 1.2,
        opacity: 0,
      });

      // Create reveal animation
      const tl = window.gsap.timeline({
        delay: index * 0.1,
      });

      tl.to(image, {
        opacity: 1,
        duration: 0.01,
      })
        .to(
          overlay,
          {
            scaleX: 0,
            duration: 0.8,
            ease: "power3.inOut",
          },
          0.1
        )
        .to(
          image,
          {
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
          },
          0.1
        );
    });
  }

  initProductsReveal() {
    if (!window.gsap || !window.ScrollTrigger) return;

    requestAnimationFrame(() => {
      const productCards = this.querySelectorAll(
        ".essence-products-section .essence-product-card"
      );

      productCards.forEach((card, index) => {
        const imageWrapper = card.querySelector(
          ".essence-product-image-wrapper"
        );
        const overlay = card.querySelector(".essence-image-reveal-overlay");
        const image = card.querySelector(".essence-product-image");
        const info = card.querySelector(".essence-product-info");

        if (!overlay || !image) return;

        // Set initial states
        window.gsap.set(overlay, {
          scaleY: 1,
          transformOrigin: "top center",
        });

        window.gsap.set(image, {
          scale: 1.2,
          opacity: 0,
        });

        window.gsap.set(info, {
          opacity: 0,
          y: 20,
        });

        // Create timeline with ScrollTrigger
        const tl = window.gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none none",
          },
          delay: index * 0.15,
        });

        tl.to(image, {
          opacity: 1,
          duration: 0.01,
        })
          .to(
            overlay,
            {
              scaleY: 0,
              duration: 1.2,
              ease: "power3.inOut",
            },
            0.1
          )
          .to(
            image,
            {
              scale: 1,
              duration: 1.2,
              ease: "power3.out",
            },
            0.1
          )
          .to(
            info,
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
            },
            0.6
          );
      });
    });
  }

  initCategoryBagButtons() {
    // Dados completos dos produtos por categoria
    const categoryProductsData = {
      // Para Ela
      4: {
        id: 4,
        name: "J'adore",
        volume: "50 ml",
        price: 615.0,
        image: "/images/paraela1.webp",
      },
      5: {
        id: 5,
        name: "Rose Star",
        volume: "100 ml",
        price: 1625.0,
        image: "/images/paraela2.webp",
      },
      6: {
        id: 6,
        name: "Miss Dior Essence",
        volume: "35 ml",
        price: 799.0,
        image: "/images/paraela3.webp",
      },
      7: {
        id: 7,
        name: "Rouge Dior Sequin Liquid Duo - edição limitada",
        volume: "Duo",
        price: 355.0,
        image: "/images/paraela4.webp",
      },
      // Para Ele
      8: {
        id: 8,
        name: "Sauvage Eau de Toilette",
        volume: "100 ml",
        price: 589.0,
        image: "/images/paraele1.webp",
      },
      9: {
        id: 9,
        name: "Dior Homme Intense",
        volume: "100 ml",
        price: 725.0,
        image: "/images/paraele2.webp",
      },
      10: {
        id: 10,
        name: "Fahrenheit",
        volume: "100 ml",
        price: 655.0,
        image: "/images/paraele3.webp",
      },
      11: {
        id: 11,
        name: "Dior Homme Sport",
        volume: "100 ml",
        price: 599.0,
        image: "/images/paraele4.webp",
      },
      // Para Casa
      12: {
        id: 12,
        name: "Vela Perfumada Miss Dior",
        volume: "250g",
        price: 425.0,
        image: "/images/paracasa.webp",
      },
      13: {
        id: 13,
        name: "Difusor de Ambiente",
        volume: "200 ml",
        price: 520.0,
        image: "/images/paracasa2.webp",
      },
      14: {
        id: 14,
        name: "Home Spray Gris Dior",
        volume: "125 ml",
        price: 380.0,
        image: "/images/diorhomme.jpg",
      },
      15: {
        id: 15,
        name: "Porta-velas Dior",
        volume: "Unidade",
        price: 295.0,
        image: "/images/diormaster.jpg",
      },
    };

    requestAnimationFrame(() => {
      const bagButtons = this.querySelectorAll(".category-bag-button");

      bagButtons.forEach((button) => {
        const productId = parseInt(button.dataset.productId);
        const productData = categoryProductsData[productId];

        if (!productData) {
          console.error(`Produto ${productId} não encontrado`);
          return;
        }

        button.addEventListener("click", (e) => {
          e.preventDefault();

          cartService.addItem({
            id: productData.id,
            name: productData.name,
            volume: productData.volume,
            price: productData.price,
            image: productData.image,
          });

          this.animateButtonFeedback(button);

          console.log("✅ Produto adicionado:", productData.name);
          console.log("🛒 Total no carrinho:", cartService.getTotalItems());
        });
      });
    });
  }

  initParallaxBagButtons() {
    // Dados dos produtos
    const productsData = {
      1: {
        id: 1,
        name: "Coffret Capture Duo",
        volume: "Kit completo",
        price: 1235.0,
        image: "/images/cofre.jpg",
      },
      2: {
        id: 2,
        name: "Coffret Dior Homme - Edição Limitada",
        volume: "100 ml + Travel Spray",
        price: 965.0,
        image: "/images/diorhomme.jpg",
      },
      3: {
        id: 3,
        name: "O Ritual de Brilho Natural - Edição Limitada",
        volume: "Kit completo",
        price: 530.0,
        image: "/images/diormaster.jpg",
      },
    };

    requestAnimationFrame(() => {
      const bagButtons = this.querySelectorAll(".parallax-bag-button");

      bagButtons.forEach((button) => {
        // Pega o ID do produto do data-attribute
        const productId = parseInt(button.dataset.productId);
        const productData = productsData[productId];

        if (!productData) {
          console.error(`Produto ${productId} não encontrado`);
          return;
        }

        // Adiciona event listener
        button.addEventListener("click", (e) => {
          e.preventDefault();

          // Adiciona o produto ao carrinho usando CartService
          cartService.addItem({
            id: productData.id,
            name: productData.name,
            volume: productData.volume,
            price: productData.price,
            image: productData.image,
          });

          // Feedback visual
          this.animateButtonFeedback(button);

          // Log para debug
          console.log("✅ Produto adicionado ao carrinho:", productData.name);
          console.log(
            "🛒 Total de itens no carrinho:",
            cartService.getTotalItems()
          );
        });
      });
    });
  }

  // ============================================================================
  // LA MOUSSE PARALLAX - Efeito parallax na imagem fullscreen
  // ============================================================================
  initLaMousseParallax() {
    if (!window.gsap || !window.ScrollTrigger) return;

    requestAnimationFrame(() => {
      const section = this.querySelector(".lamousse-section");
      const image = this.querySelector(".lamousse-parallax-image");
      const content = this.querySelector(".lamousse-content");

      if (!section || !image) return;

      // Parallax na imagem - move mais lento que o scroll
      window.gsap.to(image, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Animação do conteúdo ao entrar na viewport
      if (content) {
        const label = content.querySelector(".lamousse-label");
        const title = content.querySelector(".lamousse-title");
        const button = content.querySelector(".lamousse-button");

        // Estado inicial - invisível
        gsap.set([label, title, button], { opacity: 0, y: 30 });

        const tl = window.gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        });

        tl.to(label, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        })
          .to(
            title,
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
            },
            "-=0.5"
          )
          .to(
            button,
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
            },
            "-=0.6"
          );
      }
    });
  }

  animateButtonFeedback(button) {
    if (!window.gsap) return;

    window.gsap
      .timeline()
      .to(button, {
        scale: 0.9,
        duration: 0.1,
        ease: "power2.in",
      })
      .to(button, {
        scale: 1.1,
        duration: 0.2,
        ease: "back.out(2)",
      })
      .to(button, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      });

    const originalSVG = button.innerHTML;
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;

    setTimeout(() => {
      button.innerHTML = originalSVG;
    }, 1000);
  }

  initVideoControls() {
    // Aguardar um frame para garantir que o DOM está pronto
    requestAnimationFrame(() => {
      const video = this.querySelector("#arte-section-video");
      const playPauseBtn = this.querySelector("#arte-play-pause-btn");
      const muteUnmuteBtn = this.querySelector("#arte-mute-unmute-btn");

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
    });
  }

  render() {
    this.innerHTML = `
      <div class="all-content" id="all-content" role="main">
        <!-- Navigation -->
        <app-navigation></app-navigation>

        <!-- Main Content Area -->
        <main class="content" id="content">
          
          <!-- ============================================================
               DIORIVERA MORPH SECTION - Animação estilo Dior.com
               1 imagem central → scroll → diminui + 2 imagens sobem dos lados
               ============================================================ -->
          <section class="diorivera-morph-section">
            <div class="diorivera-morph-container">
              
              <!-- Imagem Esquerda (sobe de baixo) -->
              <div class="diorivera-side diorivera-left">
                <img src="/images/summerFest2.jpg" alt="Diorivera Left" class="diorivera-image" />
              </div>
              
              <!-- Imagem Central (começa 100%, diminui para 33%) -->
              <div class="diorivera-center">
                <img src="/images/summerfest.jpg" alt="Diorivera Center" class="diorivera-image" />
                
                <!-- Texto sobreposto na imagem central -->
                <div class="diorivera-text-content">
                  <span class="diorivera-label">La Collection Privée</span>
                  <h2 class="diorivera-title">O espírito da alta costura de verão</h2>
                  <a href="/dior-verao" class="diorivera-button" data-route="/dior-verao">Descubra</a>
                </div>
              </div>
              
              <!-- Imagem Direita (sobe de baixo) -->
              <div class="diorivera-side diorivera-right">
                <img src="/images/summerFest3.jpg" alt="Diorivera Right" class="diorivera-image" />
              </div>
              
            </div>
          </section>

        </main>
      </div>

      <!-- Arte de Presentear Video Section -->
      <section class="arte-presentear-video-section">
        <video
          class="arte-video-bg"
          id="arte-section-video"
          autoplay
          muted
          loop
          playsinline
        >
          <source src="/videos/videoLips.mp4" type="video/mp4" />
        </video>

        <!-- Conteúdo de texto sobre o vídeo -->
        <div class="arte-video-content">
          <h1 class="arte-video-title">Dior Forever para uma pele perfeita.</h1>
          <p class="arte-video-description">Experimente online os produtos de maquiagem Dior para encontrar seu look ideal.   </p>
        </div>

        <!-- Video Controls - Liquid Glass -->
        <div class="video-controls">
          <button
            class="glass-button"
            id="arte-play-pause-btn"
            aria-label="Play/Pause"
            data-block="button"
          >
            <span class="button__flair"></span>
            <svg
              class="icon-play"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <svg
              class="icon-pause"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              style="display: none"
            >
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          </button>

          <button
            class="glass-button"
            id="arte-mute-unmute-btn"
            aria-label="Mute/Unmute"
            data-block="button"
          >
            <span class="button__flair"></span>
            <svg
              class="icon-mute"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
            <svg
              class="icon-unmute"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              style="display: none"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          </button>
        </div>
      </section>

      <!-- Featured Products Section -->
      <section class="essence-products-section">
        <div class="essence-products-container">
          
          <!-- Product 1 -->
          <div class="essence-product-card">
            <div class="essence-product-image-wrapper">
              <div class="essence-image-reveal-overlay"></div>
              <img src="/images/cofre.jpg" alt="Coffret Capture Duo" class="essence-product-image" />
            </div>
            <div class="essence-product-info">
              <h3 class="essence-product-name">Coffret Capture Duo</h3>
              <p class="essence-product-description">Kit de cuidados anti-idade exclusivo</p>
              <div class="product-intensity">
                <span class="intensity-label">Intensity</span>
                <div class="intensity-bars">
                  <span class="bar filled"></span>
                  <span class="bar filled"></span>
                  <span class="bar filled"></span>
                  <span class="bar filled"></span>
                </div>
              </div>
              <div class="essence-product-footer">
                <p class="essence-product-price">R$ 1.235,00</p>
                <button class="essence-bag-button parallax-bag-button" aria-label="Adicionar ao carrinho" data-product-id="1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Product 2 -->
          <div class="essence-product-card">
            <div class="essence-product-image-wrapper">
              <div class="essence-image-reveal-overlay"></div>
              <img src="/images/diorhomme.jpg" alt="Coffret Dior Homme" class="essence-product-image" />
            </div>
            <div class="essence-product-info">
              <h3 class="essence-product-name">Coffret Dior Homme - Edição Limitada</h3>
              <p class="essence-product-description">A eau de toilette Dior Homme e o seu travel spray em um único coffret presente de edição limitada</p>
              <div class="product-intensity">
                <span class="intensity-label">Intensity</span>
                <div class="intensity-bars">
                  <span class="bar filled"></span>
                  <span class="bar filled"></span>
                  <span class="bar filled"></span>
                  <span class="bar"></span>
                </div>
              </div>
              <div class="essence-product-footer">
                <p class="essence-product-price">R$ 965,00</p>
                <button class="essence-bag-button parallax-bag-button" aria-label="Adicionar ao carrinho" data-product-id="2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Product 3 -->
          <div class="essence-product-card">
            <div class="essence-product-image-wrapper">
              <div class="essence-image-reveal-overlay"></div>
              <img src="/images/diormaster.jpg" alt="O Ritual de Brilho Natural" class="essence-product-image" />
            </div>
            <div class="essence-product-info">
              <h3 class="essence-product-name">O Ritual de Brilho Natural - Edição Limitada</h3>
              <p class="essence-product-description">Tratamento completo para uma pele radiante</p>
              <div class="product-intensity">
                <span class="intensity-label">Intensity</span>
                <div class="intensity-bars">
                  <span class="bar filled"></span>
                  <span class="bar filled"></span>
                  <span class="bar"></span>
                  <span class="bar"></span>
                </div>
              </div>
              <div class="essence-product-footer">
                <p class="essence-product-price">R$ 530,00</p>
                <button class="essence-bag-button parallax-bag-button" aria-label="Adicionar ao carrinho" data-product-id="3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- Interactive Category Section -->
      <section class="category-interactive-section">
        <div class="category-container">
          <!-- Category Tabs -->
          <div class="category-tabs">
            <button class="category-tab active" data-category="para-ela">
              <span>Para Ela</span>
            </button>
            <button class="category-tab" data-category="para-ele">
              <span>Para Ele</span>
            </button>
            <button class="category-tab" data-category="para-casa">
              <span>Para Casa</span>
            </button>
          </div>

          <!-- Category Content -->
          <div class="category-content-wrapper">
            <!-- Para Ela -->
            <div class="category-content active" data-content="para-ela">
              <div class="category-grid">
                <div class="category-item">
                  <div class="category-image-wrap">
                    <div class="image-reveal-overlay"></div>
                    <img src="/images/paraela1.webp" alt="J'adore" class="category-image" />
                  </div>
                  <div class="category-product-info">
                    <p class="category-product-name">J'adore</p>
                    <p class="category-product-description">A essência da feminilidade em uma fragrância radiante</p>
                    <div class="product-intensity">
                      <span class="intensity-label">Intensity</span>
                      <div class="intensity-bars">
                        <span class="bar filled"></span>
                        <span class="bar filled"></span>
                        <span class="bar filled"></span>
                        <span class="bar"></span>
                      </div>
                    </div>
                    <div class="category-product-footer">
                      <p class="category-product-price">R$ 615,00</p>
                      <button class="category-bag-button" aria-label="Adicionar ao carrinho" data-product-id="4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                          <line x1="3" y1="6" x2="21" y2="6"></line>
                          <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="category-item">
                  <div class="category-image-wrap">
                    <div class="image-reveal-overlay"></div>
                    <img src="/images/paraela2.webp" alt="Rose Star" class="category-image" />
                  </div>
                  <div class="category-product-info">
                    <p class="category-product-name">Rose Star</p>
                    <p class="category-product-description">Um bouquet floral sofisticado e envolvente</p>
                    <div class="product-intensity">
                      <span class="intensity-label">Intensity</span>
                      <div class="intensity-bars">
                        <span class="bar filled"></span>
                        <span class="bar filled"></span>
                        <span class="bar filled"></span>
                        <span class="bar filled"></span>
                      </div>
                    </div>
                    <div class="category-product-footer">
                      <p class="category-product-price">R$ 1.625,00</p>
                      <button class="category-bag-button" aria-label="Adicionar ao carrinho" data-product-id="5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                          <line x1="3" y1="6" x2="21" y2="6"></line>
                          <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="category-item">
                  <div class="category-image-wrap">
                    <div class="image-reveal-overlay"></div>
                    <img src="/images/paraela3.webp" alt="Miss Dior Essence" class="category-image" />
                  </div>
                  <div class="category-product-info">
                    <p class="category-product-name">Miss Dior Essence</p>
                    <p class="category-product-description">A elegância atemporal em cada nota</p>
                    <div class="product-intensity">
                      <span class="intensity-label">Intensity</span>
                      <div class="intensity-bars">
                        <span class="bar filled"></span>
                        <span class="bar filled"></span>
                        <span class="bar filled"></span>
                        <span class="bar"></span>
                      </div>
                    </div>
                    <div class="category-product-footer">
                      <p class="category-product-price">R$ 799,00</p>
                      <button class="category-bag-button" aria-label="Adicionar ao carrinho" data-product-id="6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                          <line x1="3" y1="6" x2="21" y2="6"></line>
                          <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="category-item">
                  <div class="category-image-wrap">
                    <div class="image-reveal-overlay"></div>
                    <img src="/images/paraela4.webp" alt="Rouge Dior Sequin Liquid Duo" class="category-image" />
                  </div>
                  <div class="category-product-info">
                    <p class="category-product-name">Rouge Dior Sequin Liquid Duo - edição limitada</p>
                    <p class="category-product-description">Duo de lábios líquidos com acabamento luminoso</p>
                    <div class="product-intensity">
                      <span class="intensity-label">Intensity</span>
                      <div class="intensity-bars">
                        <span class="bar filled"></span>
                        <span class="bar filled"></span>
                        <span class="bar"></span>
                        <span class="bar"></span>
                      </div>
                    </div>
                    <div class="category-product-footer">
                      <p class="category-product-price">R$ 355,00</p>
                      <button class="category-bag-button" aria-label="Adicionar ao carrinho" data-product-id="7">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                          <line x1="3" y1="6" x2="21" y2="6"></line>
                          <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Para Ele -->
            <div class="category-content" data-content="para-ele">
              <div class="category-grid">
                <div class="category-item">
                  <div class="category-image-wrap">
                    <div class="image-reveal-overlay"></div>
                    <img src="/images/paraele1.webp" alt="Sauvage Eau de Toilette" class="category-image" />
                  </div>
                  <div class="category-product-info">
                    <p class="category-product-name">Sauvage Eau de Toilette</p>
                    <p class="category-product-description">A fragrância masculina icônica, fresca e intensa</p>
                    <div class="product-intensity">
                      <span class="intensity-label">Intensity</span>
                      <div class="intensity-bars">
                        <span class="bar filled"></span>
                        <span class="bar filled"></span>
                        <span class="bar filled"></span>
                        <span class="bar filled"></span>
                      </div>
                    </div>
                    <div class="category-product-footer">
                      <p class="category-product-price">R$ 589,00</p>
                      <button class="category-bag-button" aria-label="Adicionar ao carrinho" data-product-id="8">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                          <line x1="3" y1="6" x2="21" y2="6"></line>
                          <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="category-item">
                  <div class="category-image-wrap">
                    <div class="image-reveal-overlay"></div>
                    <img src="/images/paraele2.webp" alt="Dior Homme Intense" class="category-image" />
                  </div>
                  <div class="category-product-info">
                    <p class="category-product-name">Dior Homme Intense</p>
                    <p class="category-product-description">Elegância masculina sofisticada e envolvente</p>
                    <div class="product-intensity">
                      <span class="intensity-label">Intensity</span>
                      <div class="intensity-bars">
                        <span class="bar filled"></span>
                        <span class="bar filled"></span>
                        <span class="bar filled"></span>
                        <span class="bar filled"></span>
                      </div>
                    </div>
                    <div class="category-product-footer">
                      <p class="category-product-price">R$ 725,00</p>
                      <button class="category-bag-button" aria-label="Adicionar ao carrinho" data-product-id="9">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                          <line x1="3" y1="6" x2="21" y2="6"></line>
                          <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="category-item">
                  <div class="category-image-wrap">
                    <div class="image-reveal-overlay"></div>
                    <img src="/images/paraele3.webp" alt="Fahrenheit" class="category-image" />
                  </div>
                  <div class="category-product-info">
                    <p class="category-product-name">Fahrenheit</p>
                    <p class="category-product-description">A fragrância masculina lendária e atemporal</p>
                    <div class="product-intensity">
                      <span class="intensity-label">Intensity</span>
                      <div class="intensity-bars">
                        <span class="bar filled"></span>
                        <span class="bar filled"></span>
                        <span class="bar filled"></span>
                        <span class="bar"></span>
                      </div>
                    </div>
                    <div class="category-product-footer">
                      <p class="category-product-price">R$ 655,00</p>
                      <button class="category-bag-button" aria-label="Adicionar ao carrinho" data-product-id="10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                          <line x1="3" y1="6" x2="21" y2="6"></line>
                          <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="category-item">
                  <div class="category-image-wrap">
                    <div class="image-reveal-overlay"></div>
                    <img src="/images/paraele4.webp" alt="Dior Homme Sport" class="category-image" />
                  </div>
                  <div class="category-product-info">
                    <p class="category-product-name">Dior Homme Sport</p>
                    <p class="category-product-description">Energia cítrica e frescor esportivo</p>
                    <div class="product-intensity">
                      <span class="intensity-label">Intensity</span>
                      <div class="intensity-bars">
                        <span class="bar filled"></span>
                        <span class="bar filled"></span>
                        <span class="bar filled"></span>
                        <span class="bar"></span>
                      </div>
                    </div>
                    <div class="category-product-footer">
                      <p class="category-product-price">R$ 599,00</p>
                      <button class="category-bag-button" aria-label="Adicionar ao carrinho" data-product-id="11">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                          <line x1="3" y1="6" x2="21" y2="6"></line>
                          <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Para Casa -->
            <div class="category-content" data-content="para-casa">
              <div class="category-grid">
                <div class="category-item">
                  <div class="category-image-wrap">
                    <div class="image-reveal-overlay"></div>
                    <img src="/images/paracasa.webp" alt="Vela Perfumada Miss Dior" class="category-image" />
                  </div>
                  <div class="category-product-info">
                    <p class="category-product-name">Vela Perfumada Miss Dior</p>
                    <p class="category-product-description">Aromas florais que transformam seu ambiente</p>
                    <div class="product-intensity">
                      <span class="intensity-label">Intensity</span>
                      <div class="intensity-bars">
                        <span class="bar filled"></span>
                        <span class="bar filled"></span>
                        <span class="bar filled"></span>
                        <span class="bar"></span>
                      </div>
                    </div>
                    <div class="category-product-footer">
                      <p class="category-product-price">R$ 425,00</p>
                      <button class="category-bag-button" aria-label="Adicionar ao carrinho" data-product-id="12">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                          <line x1="3" y1="6" x2="21" y2="6"></line>
                          <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="category-item">
                  <div class="category-image-wrap">
                    <div class="image-reveal-overlay"></div>
                    <img src="/images/paracasa2.webp" alt="Difusor de Ambiente" class="category-image" />
                  </div>
                  <div class="category-product-info">
                    <p class="category-product-name">Difusor de Ambiente</p>
                    <p class="category-product-description">Fragrância contínua e elegante para sua casa</p>
                    <div class="product-intensity">
                      <span class="intensity-label">Intensity</span>
                      <div class="intensity-bars">
                        <span class="bar filled"></span>
                        <span class="bar filled"></span>
                        <span class="bar"></span>
                        <span class="bar"></span>
                      </div>
                    </div>
                    <div class="category-product-footer">
                      <p class="category-product-price">R$ 520,00</p>
                      <button class="category-bag-button" aria-label="Adicionar ao carrinho" data-product-id="13">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                          <line x1="3" y1="6" x2="21" y2="6"></line>
                          <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="category-item">
                  <div class="category-image-wrap">
                    <div class="image-reveal-overlay"></div>
                    <img src="/images/diorhomme.jpg" alt="Home Spray Gris Dior" class="category-image" />
                  </div>
                  <div class="category-product-info">
                    <p class="category-product-name">Home Spray Gris Dior</p>
                    <p class="category-product-description">Frescor instantâneo com assinatura Dior</p>
                    <div class="product-intensity">
                      <span class="intensity-label">Intensity</span>
                      <div class="intensity-bars">
                        <span class="bar filled"></span>
                        <span class="bar filled"></span>
                        <span class="bar"></span>
                        <span class="bar"></span>
                      </div>
                    </div>
                    <div class="category-product-footer">
                      <p class="category-product-price">R$ 380,00</p>
                      <button class="category-bag-button" aria-label="Adicionar ao carrinho" data-product-id="14">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                          <line x1="3" y1="6" x2="21" y2="6"></line>
                          <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="category-item">
                  <div class="category-image-wrap">
                    <div class="image-reveal-overlay"></div>
                    <img src="/images/diormaster.jpg" alt="Porta-velas Dior" class="category-image" />
                  </div>
                  <div class="category-product-info">
                    <p class="category-product-name">Porta-velas Dior</p>
                    <p class="category-product-description">Elegância e sofisticação em cada detalhe</p>
                    <div class="product-intensity">
                      <span class="intensity-label">Intensity</span>
                      <div class="intensity-bars">
                        <span class="bar filled"></span>
                        <span class="bar"></span>
                        <span class="bar"></span>
                        <span class="bar"></span>
                      </div>
                    </div>
                    <div class="category-product-footer">
                      <p class="category-product-price">R$ 295,00</p>
                      <button class="category-bag-button" aria-label="Adicionar ao carrinho" data-product-id="15">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                          <line x1="3" y1="6" x2="21" y2="6"></line>
                          <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================================
           J'ADORE EXPAND SECTION - Morph inverso (expande para full)
           ============================================================ -->
      <section class="jadore-expand-section">
        <div class="jadore-expand-container">
          <div class="jadore-image-wrapper">
            <img src="/images/JadoreFull.jpg" alt="J'adore Eau de Parfum" class="jadore-expand-image" />
            
            <!-- Texto sobreposto -->
            <div class="jadore-text-content">
              <span class="jadore-label">J'adore Eau de Parfum</span>
              <h2 class="jadore-title">A flor dos sonhos de J'adore</h2>
              <a href="/miss-dior" class="jadore-button" data-route="/miss-dior">Descubra</a>
            </div>
          </div>
        </div>
      </section>

       <!-- La Mousse Section - Full Width Parallax -->
      <section class="lamousse-section" id="lamousse">
        <div class="lamousse-parallax-container">
          <img src="/images/lamousse.jpg" alt="La Mousse OFF/ON" class="lamousse-parallax-image" />
          <div class="lamousse-overlay"></div>
        </div>
        <div class="lamousse-content">
          <span class="lamousse-label">La Mousse OFF/ON</span>
          <h2 class="lamousse-title">Mais do que um produto de limpeza, um cuidado nutritivo para a pele</h2>
          <a href="#" class="lamousse-button">Descubra</a>
        </div>
      </section>

      <!-- Keyhole Reveal Section -->
      <keyhole-section
        image="/images/Image 2 Dior.jpg"
        subtitle="Dior Backstage Glow Maximizer Palette"
        title="Uma nova visão da icônica paleta de iluminadores"
        button-text="Descubra"
      ></keyhole-section>


      <!-- Services Dior Section - Drag Cards -->
      <section class="services-dior-section" id="services-dior">
        <div class="services-dior-container">
          <!-- Left Content - Text -->
          <div class="services-text-content">
            <h2 class="services-title">Os serviços da Dior</h2>
          </div>

          <!-- Right Content - Drag Cards -->
          <div class="services-drag-container">
            <div class="services-drag-track">
              <!-- Card 1 - A arte de presentear -->
              <article class="services-drag-card">
                <div class="services-card-image-wrap">
                  <img src="/images/Presentes.webp" alt="A arte de presentear" class="services-card-image" />
                  <div class="services-card-overlay"></div>
                  <div class="services-card-info">
                    <h3 class="services-card-title">A arte de presentear</h3>
                    <a href="/arte-de-presentear" class="services-card-button" data-route="/arte-de-presentear">Descubra</a>
                  </div>
                </div>
              </article>

              <!-- Card 2 - O Atelier de Personalização -->
              <article class="services-drag-card">
                <div class="services-card-image-wrap">
                  <img src="/images/casitas.jpg" alt="O Atelier de Personalização" class="services-card-image" />
                  <div class="services-card-overlay"></div>
                  <div class="services-card-info">
                    <h3 class="services-card-title">O Atelier de Personalização</h3>
                    <a href="/arte-de-presentear" class="services-card-button" data-route="/arte-de-presentear">Descubra</a>
                  </div>
                </div>
              </article>

              <!-- Card 3 - Amostras, e miniaturas -->
              <article class="services-drag-card">
                <div class="services-card-image-wrap">
                  <img src="/images/inspect.webp" alt="Amostras, e miniaturas" class="services-card-image" />
                  <div class="services-card-overlay"></div>
                  <div class="services-card-info">
                    <h3 class="services-card-title">Amostras, e miniaturas</h3>
                    <a href="/arte-de-presentear" class="services-card-button" data-route="/arte-de-presentear">Descubra</a>
                  </div>
                </div>
              </article>

              <!-- Card 4 - Free shipping -->
              <article class="services-drag-card">
                <div class="services-card-image-wrap">
                  <img src="/images/shipping.jpg" alt="Free shipping" class="services-card-image" />
                  <div class="services-card-overlay"></div>
                  <div class="services-card-info">
                    <h3 class="services-card-title">Free shipping</h3>
                    <a href="/arte-de-presentear" class="services-card-button" data-route="/arte-de-presentear">Discover</a>
                  </div>
                </div>
              </article>
            </div>
          </div>
          
          <!-- Navigation Indicator -->
          <span class="services-nav-indicator">1/4</span>
        </div>
      </section>

     

      <footer-section></footer-section>
      
      
    `;
  }
}

customElements.define("home-page", HomePage);
