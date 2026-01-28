// ============================================================================
// MODA E ACESSÓRIOS PAGE - Página dedicada a Moda e Acessórios
// ============================================================================
import { getSmoothScroll } from "../components/SmoothScroll.js";
import "../components/ModaNavigation.js";
import "../components/FooterSection.js";
import "../components/ModaAcessoriosContent.js";
import "../styles/moda-acessorios.css";
import "../styles/miss-dior.css";

export class ModaEAcessoriosPage extends HTMLElement {
  constructor() {
    super();
    this.getSmoothScroll = null;
  }

  connectedCallback() {
    this.render();
    this.initAnimations();
    this.initButtonAnimation();
    this.initCardAnimations();
    this.initCardButtons();
    this.initDragCards();
    this.initVideoControls();
    this.initSmoothScroll();
  }

  initSmoothScroll() {
    this.SmoothScroll = getSmoothScroll({
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    this.SmoothScroll.init();
  }

  disconnectedCallback() {
    // Cleanup draggable
    if (this.SmoothScroll) {
      this.SmoothScroll.destroy();
    }
    if (this.draggableInstance) {
      this.draggableInstance.kill();
    }
    // Cleanup animations
    if (this.animations) {
      this.animations.forEach((anim) => anim.kill());
    }
  }

  initAnimations() {
    requestAnimationFrame(() => {
      if (!window.gsap) return;

      this.animations = [];

      // Hero animation
      const heroTl = window.gsap.timeline();
      heroTl
        .from(".moda-hero-label", {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        })
        .from(
          ".moda-hero-title",
          {
            y: 60,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out",
          },
          "-=0.5",
        )
        .from(
          ".moda-hero-subtitle",
          {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.8",
        )
        .from(
          ".moda-discover-button",
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.6",
        );

      this.animations.push(heroTl);

      // Content fade in
      const contentAnim = window.gsap.from(".moda-content-wrapper", {
        scrollTrigger: {
          trigger: ".moda-content-wrapper",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      this.animations.push(contentAnim);
    });
  }

  initButtonAnimation() {
    requestAnimationFrame(() => {
      if (!window.gsap) return;

      const buttons = this.querySelectorAll(".moda-discover-button, .moda-discover-button-second");

      buttons.forEach((button) => {
        // Mouseenter - linha diminui para 0
        button.addEventListener("mouseenter", () => {
          window.gsap.to(button, {
            "--underline-width": "0%",
            duration: 0.35,
            ease: "power2.inOut",
          });
        });

        // Mouseleave - linha volta a 100%
        button.addEventListener("mouseleave", () => {
          window.gsap.to(button, {
            "--underline-width": "100%",
            duration: 0.35,
            ease: "power2.inOut",
          });
        });
      });
    });
  }

  initCardAnimations() {
    requestAnimationFrame(() => {
      if (!window.gsap || !window.ScrollTrigger) return;

      const cards = this.querySelectorAll(".moda-gift-card");

      cards.forEach((card, index) => {
        const image = card.querySelector(".moda-card-image");
        const overlay = card.querySelector(".moda-card-overlay");
        const title = card.querySelector(".moda-card-title");
        const button = card.querySelector(".moda-card-button");

        // Set initial states
        window.gsap.set(image, {
          scale: 1.3,
          opacity: 0,
        });

        window.gsap.set(overlay, {
          scaleX: 1,
          transformOrigin: "left center",
        });

        window.gsap.set([title, button], {
          y: 30,
          opacity: 0,
        });

        // Create scroll trigger animation
        const tl = window.gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 75%",
            end: "bottom 25%",
            toggleActions: "play reverse play reverse",
          },
          delay: index * 0.2,
        });

        tl.to(image, {
          opacity: 1,
          duration: 0.01,
        })
          .to(
            overlay,
            {
              scaleX: 0,
              duration: 1.2,
              ease: "power3.inOut",
            },
            0.1,
          )
          .to(
            image,
            {
              scale: 1,
              duration: 1.2,
              ease: "power3.out",
            },
            0.1,
          )
          .to(
            title,
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
            },
            0.5,
          )
          .to(
            button,
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
            },
            0.6,
          );
      });
    });
  }

  initCardButtons() {
    requestAnimationFrame(() => {
      if (!window.gsap) return;

      const buttons = this.querySelectorAll(".moda-card-button", "moda-card-button-second");

      buttons.forEach((button) => {
        // Mouseenter - linha diminui para 0
        button.addEventListener("mouseenter", () => {
          window.gsap.to(button, {
            "--underline-width": "0%",
            duration: 0.35,
            ease: "power2.inOut",
          });
        });

        // Mouseleave - linha volta a 100%
        button.addEventListener("mouseleave", () => {
          window.gsap.to(button, {
            "--underline-width": "100%",
            duration: 0.35,
            ease: "power2.inOut",
          });
        });
      });
    });
  }

  initVideoControls() {
    // Controle para os 3 vídeos principais com botão liquid glass
    const videoControls = [
      { videoId: "moda-video-1", btnId: "moda-video-1-btn" },
      { videoId: "moda-video-3", btnId: "moda-video-3-btn" },
      { videoId: "moda-video-4", btnId: "moda-video-4-btn" },
    ];

    videoControls.forEach(({ videoId, btnId }) => {
      const video = this.querySelector(`#${videoId}`);
      const btn = this.querySelector(`#${btnId}`);

      if (!video || !btn) return;

      const playIcon = btn.querySelector(".play-icon");
      const pauseIcon = btn.querySelector(".pause-icon");

      btn.addEventListener("click", () => {
        if (video.paused) {
          video.play();
          btn.classList.add("playing");
          playIcon.style.display = "none";
          pauseIcon.style.display = "block";
        } else {
          video.pause();
          btn.classList.remove("playing");
          playIcon.style.display = "block";
          pauseIcon.style.display = "none";
        }
      });

      // Inicialmente, vídeo está tocando, então mostra o ícone de pause
      video
        .play()
        .then(() => {
          btn.classList.add("playing");
          playIcon.style.display = "none";
          pauseIcon.style.display = "block";
        })
        .catch(() => {
          // Se autoplay falhar, mantém ícone de play
          btn.classList.remove("playing");
          playIcon.style.display = "block";
          pauseIcon.style.display = "none";
        });
    });

    // Controle legacy para video com botões de mute
    const video = this.querySelector("#miss-dior-section-video");
    const playPauseBtn = this.querySelector("#miss-dior-play-pause-btn");
    const muteBtn = this.querySelector("#miss-dior-mute-unmute-btn");

    if (!video || !playPauseBtn || !muteBtn) return;

    const iconPlay = playPauseBtn.querySelector(".icon-play");
    const iconPause = playPauseBtn.querySelector(".icon-pause");
    const iconMute = muteBtn.querySelector(".icon-mute");
    const iconUnmute = muteBtn.querySelector(".icon-unmute");

    // Play/Pause handler
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

    // Mute/Unmute handler
    muteBtn.addEventListener("click", () => {
      video.muted = !video.muted;
      if (video.muted) {
        iconMute.style.display = "block";
        iconUnmute.style.display = "none";
      } else {
        iconMute.style.display = "none";
        iconUnmute.style.display = "block";
      }
    });
  }

  initDragCards() {
    setTimeout(() => {
      if (!window.gsap || !window.Draggable) {
        console.warn("GSAP ou Draggable não disponível");
        return;
      }

      const container = this.querySelector(".moda-drag-container");
      const slider = this.querySelector(".moda-gift-cards-section");
      const progressFill = this.querySelector(".moda-drag-progress-fill");
      const cards = this.querySelectorAll(".moda-gift-card");

      if (!container || !slider || cards.length === 0) {
        console.warn("Container, slider ou cards não encontrados");
        return;
      }

      // Função para calcular bounds corretamente
      const calculateBounds = () => {
        const containerWidth = container.offsetWidth;
        const firstCard = cards[0].getBoundingClientRect();
        const lastCard = cards[cards.length - 1].getBoundingClientRect();

        // Largura real do conteúdo: do início do primeiro ao fim do último card
        const contentWidth = lastCard.right - firstCard.left;

        // Adiciona padding extra para ver o último card completamente
        const padding = parseFloat(getComputedStyle(container).paddingLeft) || 0;
        const totalWidth = contentWidth + padding;

        // MaxDrag negativo para mover para esquerda
        const maxDrag = Math.min(0, -(totalWidth - containerWidth + padding));

        console.log("📏 Bounds:", {
          containerWidth,
          contentWidth,
          totalWidth,
          maxDrag,
        });

        return { minX: maxDrag, maxX: 0 };
      };

      let bounds = calculateBounds();

      // Atualizar progress bar
      const updateProgress = (x) => {
        if (!progressFill || bounds.minX >= 0) return;
        const progress = Math.abs(x) / Math.abs(bounds.minX);
        const clampedProgress = Math.min(Math.max(progress, 0), 1);
        window.gsap.to(progressFill, {
          scaleX: Math.max(clampedProgress, 0.15),
          duration: 0.1,
          ease: "none",
        });
      };

      // Criar Draggable
      this.draggableInstance = window.Draggable.create(slider, {
        type: "x",
        bounds: bounds,
        inertia: true,
        edgeResistance: 0.65,
        dragResistance: 0,
        throwResistance: 2000,
        cursor: "grab",
        activeCursor: "grabbing",
        allowNativeTouchScrolling: false,
        onPress: function () {
          window.gsap.killTweensOf(slider);
        },
        onDrag: function () {
          updateProgress(this.x);
        },
        onThrowUpdate: function () {
          updateProgress(this.x);
        },
        onClick: function (e) {
          if (e.target.classList.contains("moda-card-button")) {
            e.target.click();
          }
        },
      })[0];

      // Recalcular bounds on resize
      window.addEventListener("resize", () => {
        bounds = calculateBounds();
        if (this.draggableInstance) {
          this.draggableInstance.applyBounds(bounds);
          // Corrigir posição se estiver fora dos bounds
          const currentX = this.draggableInstance.x;
          if (currentX < bounds.minX) {
            window.gsap.to(slider, { x: bounds.minX, duration: 0.3 });
          }
        }
      });

      // Recalcular após imagens carregarem
      setTimeout(() => {
        bounds = calculateBounds();
        if (this.draggableInstance) {
          this.draggableInstance.applyBounds(bounds);
        }
      }, 500);

      // Initial progress
      updateProgress(0);

      console.log("✅ Drag cards inicializado!", bounds);
    }, 300);
  }

  render() {
    this.innerHTML = `
      <div class="all-content" id="all-content" role="main">
      <section class="moda-hero-video-section">
      <div class="moda-hero-overlay"></div>
      <video
      class="moda-hero-bg-video"
      id="moda-video-1"
      autoplay
      muted
      loop
      playsinline
      >
      <source src="/videos/book.mp4" type="video/mp4" />
      </video>
      
      <!-- Video Control Button -->
      <button class="moda-video-control-btn" id="moda-video-1-btn" aria-label="Play/Pause">
        <svg class="play-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.2 6.902a.5.5 0 0 1 .765-.424l8.157 5.098a.5.5 0 0 1 0 .848l-8.157 5.098a.5.5 0 0 1-.765-.424z"></path>
        </svg>
        <svg class="pause-icon" width="24" height="24" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style="display: none;">
          <g>
            <path d="m182.4,385.5c-6.6,0-12-5.4-12-12v-218.2c0-6.6 5.4-12 12-12 6.6,0 12,5.4 12,12v218.2c0,6.6-5.4,12-12,12z"/>
            <path d="m329.6,385.5c-6.6,0-12-5.4-12-12v-218.2c0-6.6 5.4-12 12-12s12,5.4 12,12v218.2c0,6.6-5.4,12-12,12z"/>
          </g>
        </svg>
      </button>
      
      <div class="moda-hero-content">
      <p class="moda-hero-label"></p>
      <h1 class="moda-hero-title"></h1>
      <p class="moda-hero-title-video">
      A coleção book cover
      </p>
      <a href="/colecao" data-route="/colecao" class="moda-discover-button">Descubra
      </a>
      </div>
      </section>
        <!-- Moda Navigation (customizada) -->
        <moda-navigation></moda-navigation>

          <section class="moda-hero-section">
            <div class="moda-hero-overlay"></div>
            <img
              src="/images/menininha.png"
              alt="O mundo encantado da Dior - Presentes para o fim de ano"
              class="moda-hero-video"
              loading="eager"
            />
            
            <div class="moda-hero-content">
              <p class="moda-hero-label">Coleção feminina Primavera-Verão 2026</p>
              <h1 class="moda-hero-title">Tradição revisada</h1>
              <p class="moda-hero-subtitle">
                Descubra a seleção de presentes da Maison: um convite para celebrar a arte de presentear, desde já, no espírito das festas de fim de ano
              </p>
              <a href="/colecao" data-route="/colecao" class="moda-discover-button">Descubra a  coleção</a>
            </div>
          </section>
          

          <section class="moda-hero-video-section">
      <div class="moda-hero-overlay"></div>
      <video
      class="moda-hero-bg-video"
      id="moda-video-3"
      autoplay
      muted
      loop
      playsinline
      >
      <source src="/videos/desfile.mp4" type="video/mp4" />
      </video>
      
      <!-- Video Control Button -->
      <button class="moda-video-control-btn" id="moda-video-3-btn" aria-label="Play/Pause">
        <svg class="play-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.2 6.902a.5.5 0 0 1 .765-.424l8.157 5.098a.5.5 0 0 1 0 .848l-8.157 5.098a.5.5 0 0 1-.765-.424z"></path>
        </svg>
        <svg class="pause-icon" width="24" height="24" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style="display: none;">
          <g>
            <path d="m182.4,385.5c-6.6,0-12-5.4-12-12v-218.2c0-6.6 5.4-12 12-12 6.6,0 12,5.4 12,12v218.2c0,6.6-5.4,12-12,12z"/>
            <path d="m329.6,385.5c-6.6,0-12-5.4-12-12v-218.2c0-6.6 5.4-12 12-12s12,5.4 12,12v218.2c0,6.6-5.4,12-12,12z"/>
          </g>
        </svg>
      </button>
      
      <div class="moda-hero-content">
      <p class="moda-hero-label"></p>
      <h1 class="moda-hero-title"></h1>
      <p class="moda-hero-title-video">
      A arte de se vestir
      </p>
      <a href="/colecao" data-route="/colecao" class="moda-discover-button">Descubra a coleção
      </a>
      </div>
      </section>

          <!-- Content Wrapper -->
          <div class="moda-content-wrapper">
            <!-- Drag Cards Container -->
            <div class="moda-drag-container">
              <section class="moda-gift-cards-section">
                <div class="moda-gift-card">
                  <div class="moda-card-image-wrapper">
                    <img src="/images/paraEla.avif" alt="Presentes para ela" class="moda-card-image" />
                    <div class="moda-card-overlay"></div>
                  </div>
                  <div class="moda-card-content">
                    <h2 class="moda-card-title">Presentes para ela</h2>
                    <a href="/para-ela" data-route="/para-ela" class="moda-card-button">Descobrir</a>
                  </div>
                </div>

                <div class="moda-gift-card">
                  <div class="moda-card-image-wrapper">
                    <img src="/images/bolsa.avif" alt="Bolsas femininas" class="moda-card-image" />
                    <div class="moda-card-overlay"></div>
                  </div>
                  <div class="moda-card-content">
                    <h2 class="moda-card-title">Bolsas femininas</h2>
                    <a href="#bolsas" class="moda-card-button">Descobrir</a>
                  </div>
                </div>

                <div class="moda-gift-card">
                  <div class="moda-card-image-wrapper">
                    <img src="/images/paraEle.avif" alt="Presentes para homem" class="moda-card-image" />
                    <div class="moda-card-overlay"></div>
                  </div>
                  <div class="moda-card-content">
                    <h2 class="moda-card-title">Presentes para homem</h2>
                    <a href="#para-ele" class="moda-card-button">Descobrir</a>
                  </div>
                </div>

                <div class="moda-gift-card">
                  <div class="moda-card-image-wrapper">
                    <img src="/images/sapatero.webp" alt="Sapatos masculinos" class="moda-card-image" />
                    <div class="moda-card-overlay"></div>
                  </div>
                  <div class="moda-card-content">
                    <h2 class="moda-card-title">Sapatos masculinos</h2>
                    <a href="#sapatos" class="moda-card-button">Descobrir</a>
                  </div>
                </div>

                <div class="moda-gift-card">
                  <div class="moda-card-image-wrapper">
                    <img src="/images/joias.avif" alt="Joias" class="moda-card-image" />
                    <div class="moda-card-overlay"></div>
                  </div>
                  <div class="moda-card-content">
                    <h2 class="moda-card-title">Joias</h2>
                    <a href="#joias" class="moda-card-button">Descobrir</a>
                  </div>
                </div>

                <div class="moda-gift-card">
                  <div class="moda-card-image-wrapper">
                    <img src="/images/relogio.avif" alt="Relojoaria" class="moda-card-image" />
                    <div class="moda-card-overlay"></div>
                  </div>
                  <div class="moda-card-content">
                    <h2 class="moda-card-title">Relojoaria</h2>
                    <a href="#joias" class="moda-card-button">Descobrir</a>
                  </div>
                </div>

                <div class="moda-gift-card">
                  <div class="moda-card-image-wrapper">
                    <img src="/images/joalheria.avif" alt="Joalheria" class="moda-card-image" />
                    <div class="moda-card-overlay"></div>
                  </div>
                  <div class="moda-card-content">
                    <h2 class="moda-card-title">Joalheria</h2>
                    <a href="#joias" class="moda-card-button">Descobrir</a>
                  </div>
                </div>

                <div class="moda-gift-card">
                  <div class="moda-card-image-wrapper">
                    <img src="/images/sapatos.webp" alt="Sapatos Femininos" class="moda-card-image" />
                    <div class="moda-card-overlay"></div>
                  </div>
                  <div class="moda-card-content">
                    <h2 class="moda-card-title">Sapatos Femininos</h2>
                    <a href="#joias" class="moda-card-button">Descobrir</a>
                  </div>
                </div>
              </section>
            </div>
           

            <!-- Progress Bar -->
            <div class="moda-drag-progress">
              <div class="moda-drag-progress-fill"></div>
            </div>
          </div> 
          

           <section class="miss-dior-video-section">
            <video
              class="miss-dior-video-bg"
              id="miss-dior-section-video"
              autoplay
              muted
              loop
              playsinline
            >
              <source src="/videos/lady.mp4" type="video/mp4" />
            </video>

            <!-- Conteúdo de texto sobre o vídeo -->
            <div class="miss-dior-video-content">
            </div>

            <!-- Video Controls - Liquid Glass -->
            <div class="video-controls">
              <button
                class="glass-button"
                id="miss-dior-play-pause-btn"
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
                id="miss-dior-mute-unmute-btn"
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

          <!-- Seção Descubra a Campanha -->
          <section class="moda-campaign-section">
            <div class="moda-campaign-content">
              <h2 class="moda-campaign-title">Descubra</h2>
              <p class="moda-campaign-description">
                As fotografias de David Sims, tanto em cores quanto em preto e branco, são como esboços visuais, transmitindo informações de forma concisa e significativa através da linguagem corporal, roupas e ambiente
              </p>
              <a href="#campanha" class="moda-discover-button">Descubra a campanha</a>
            </div>
          </section>

           <section class="miss-dior-video-section">
            <video
              class="miss-dior-video-bg"
              id="moda-video-4"
              autoplay
              muted
              loop
              playsinline
            >
              <source src="/videos/bolsinhas.mp4" type="video/mp4" />
              
            </video>
            
            <!-- Video Control Button -->
            <button class="moda-video-control-btn" id="moda-video-4-btn" aria-label="Play/Pause">
              <svg class="play-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.2 6.902a.5.5 0 0 1 .765-.424l8.157 5.098a.5.5 0 0 1 0 .848l-8.157 5.098a.5.5 0 0 1-.765-.424z"></path>
              </svg>
              <svg class="pause-icon" width="24" height="24" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style="display: none;">
                <g>
                  <path d="m182.4,385.5c-6.6,0-12-5.4-12-12v-218.2c0-6.6 5.4-12 12-12 6.6,0 12,5.4 12,12v218.2c0,6.6-5.4,12-12,12z"/>
                  <path d="m329.6,385.5c-6.6,0-12-5.4-12-12v-218.2c0-6.6 5.4-12 12-12s12,5.4 12,12v218.2c0,6.6-5.4,12-12,12z"/>
                </g>
              </svg>
            </button>
            
            <div class="moda-hero-content-second">
              <p class="moda-hero-label-second">Savoir-faire</p>
              <h1 class="moda-hero-title-second">A bolsa Dior Bow</h1>
              
              <a href="#" class="moda-discover-button-second">Descubra  mais</a>
            </div>
            
            </section>


        <!-- Footer -->
        <footer-section></footer-section>
      </div>
    `;
  }
}

customElements.define("moda-acessorios-page", ModaEAcessoriosPage);
