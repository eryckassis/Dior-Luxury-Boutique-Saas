// ============================================================================
// ARTE DE PRESENTEAR PAGE - Página usando Web Components
// ============================================================================

import "../components/AppNavigation.js";
import "../components/FooterSection.js";
import { initServicesDrag, initButtonUnderlineAnimation } from "../components/ServicesDragCards.js";
import { getSmoothScroll } from "../components/SmoothScroll.js";

export class ArteDePresentearPage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.initVideoControls();
    this.initVideoControls2();
    this.initPresenteVideoControls();
    this.initButtonAnimations();
    this.initSelecaoPresentes();
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
  }

  render() {
    this.innerHTML = `
      <div class="all-content" id="all-content" role="main">
        <!-- Navigation -->
        <app-navigation></app-navigation>

        <!-- Main Content Area -->
        <main class="content" id="content">
          <!-- Video Section Full Screen -->
          <section class="arte-presentear-video-section">
            <video
              class="arte-video-bg"
              id="arte-section-video"
              autoplay
              muted
              loop
              playsinline
            >
              <source src="/videos/aArteDePresentear.mp4" type="video/mp4" />
            </video>

            <!-- Conteúdo de texto sobre o vídeo -->
            <div class="arte-video-content">
              <h1 class="arte-video-title">A arte de presentear</h1>
              <p class="arte-video-description">Descubra presentes exclusivos que celebram momentos especiais</p>
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
          <section class="presentes-section-second">
        <div class="presentes-container-second">
          <div class="presentes-header-second">
            <p class="presentes-label-second">Ajustar amarrar aprimorar</p>
            <h2 class="presentes-title-second">Os ateliês encantados da Dior ganham vida magicamente para transformar cada presente em uma experiencia extraordinária</h2>
            <p class="presentes-subtitle-second">
              Reinterpretada no tema encantado do artista e amigo da Maison Pietro Ruffo.<br>
              mais exclusivas em edição limitada, para as celebrações mais<br>
              mágicas e encantadoras.
            </p>
          </div>

          <div class="presentes-grid-second">
            <div class="presente-item-second">
              <div class="presente-video-wrapper-second">
                <video 
                  class="presente-video-second"
                  id="presente-video-1"
                  autoplay
                  muted
                  loop
                  playsinline
                >
                  <source src="/videos/diorvideopresente.mp4" type="video/mp4" />
                </video>

                <!-- Video Controls para o vídeo do presente -->
                <div class="video-controls video-controls-presente">
                  <button
                    class="glass-button"
                    id="presente-play-pause-btn"
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
                    id="presente-mute-unmute-btn"
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
              </div>
              <p class="presente-price-second">A inspiração do artista</p>
              <p class="presente-caption-second">O circo dos Sonhos Dior imaginado por Pietro Ruffo - edição limitada</p>
            </div>

            <div class="presente-item-second">
              <img class="presente-image-second" src="/images/thirtyproduct.webp" alt="Dior Palette Couture - edição limitada">
              <p class="presente-price-second">Um novo tema exclusivo de alta costura</p>
              <p class="presente-caption-second">Presente maravilhosamente embrulhados</p>
            </div>
          </div>
        </div>

        <section class="presentes-section-second">
        <div class="presentes-container-second">
          <div class="presentes-header-second">
            <p class="presentes-label-second"></p>
            <h2 class="presentes-title-terceiro">Um presente único para este Natal</h2>
            <p class="presentes-subtitle-terceiro">
              Como o grand finale do Circo dos Sonhos, os serviços de personalização da Dior transformam magicamente seu presente em memórias únicas: laços Fontange, Dagger ou Butterfly e ornamentos dourados dão o toque final aos seus presentes para uma temporada de Natal inumerosamente deslumbrante.
            </p>
          </div>

          <div class="presentes-fullwidth-image">
            <img 
              class="presentes-image-full" 
              src="/images/presentear/presentes.webp" 
              alt="A Arte de Presentear Dior"
              style="width: 100%; height: 100vh; object-fit: cover; display: block;"
            >
          </div>
        </div>
        </section>

        <section class="presentes-section-second">
        <div class="presentes-container-second">
          <div class="presentes-header-second">
            <p class="presentes-label-second"></p>
            <h2 class="presentes-title-terceiro">Um presente único para este Natal</h2>
            <p class="presentes-subtitle-terceiro">
              Como o grand finale do Circo dos Sonhos, os serviços de personalização da Dior transformam magicamente seu presente em memórias únicas: laços Fontange, Dagger ou Butterfly e ornamentos dourados dão o toque final aos seus presentes para uma temporada de Natal inumerosamente deslumbrante.
            </p>
          </div>

          <div class="presentes-grid-second" style="display: flex; gap: 40px; justify-content: center; padding: 60px 0;">
            <div class="presente-card-hellix" style="flex: 1; max-width: 600px; text-align: center;">
              <img 
                class="presente-card-image" 
                src="/images/presentear/moca.jpg" 
                alt="A caixa Dior"
                style="width: 100%; height: auto; object-fit: cover; display: block;"
              >
              <h3 style="font-family: 'Hellix', sans-serif; font-size: 1.25rem; font-weight: 500; margin-top: 24px; color: #1a1a1a;">A caixa</h3>
              <p style="font-family: 'Hellix', sans-serif; font-size: 0.875rem; font-weight: 300; color: #666; margin-top: 12px; line-height: 1.6;">Uma caixa feita de papelão 100% reciclado e reciclável com certificação FSC.*</p>
            </div>

            <div class="presente-card-hellix" style="flex: 1; max-width: 600px; text-align: center;">
              <img 
                class="presente-card-image" 
                src="/images/presentear/dior.jpg" 
                alt="Motivo emblemático Dior"
                style="width: 100%; height: auto; object-fit: cover; display: block;"
              >
              <h3 style="font-family: 'Hellix', sans-serif; font-size: 1.25rem; font-weight: 500; margin-top: 24px; color: #1a1a1a;">Motivo emblemático</h3>
              <p style="font-family: 'Hellix', sans-serif; font-size: 0.875rem; font-weight: 300; color: #666; margin-top: 12px; line-height: 1.6;">A icônica Toile de Jouy – um mundo imaginário bucólico caro à Maison – revela-se no centro de cada caixa.</p>
            </div>
          </div>
        
        </div>
        </section>

         <section class="presentes-section-second">
        <div class="presentes-container-second">
          <div class="presentes-header-second">
            <p class="presentes-label-second"></p>
            <h2 class="presentes-title-terceiro">Um presente único para este Natal</h2>
            <p class="presentes-subtitle-terceiro">
              Como o grand finale do Circo dos Sonhos, os serviços de personalização da Dior transformam magicamente seu presente em memórias únicas: laços Fontange, Dagger ou Butterfly e ornamentos dourados dão o toque final aos seus presentes para uma temporada de Natal inumerosamente deslumbrante.
            </p>
          </div>

          <div class="presentes-grid-second" style="display: flex; gap: 40px; justify-content: center; padding: 60px 0;">
            <div class="presente-card-hellix" style="flex: 1; max-width: 600px; text-align: center;">
              <img 
                class="presente-card-image" 
                src="/images/presentear/bolsa.jpg" 
                alt="A caixa Dior"
                style="width: 100%; height: auto; object-fit: cover; display: block;"
              >
              <h3 style="font-family: 'Hellix', sans-serif; font-size: 1.25rem; font-weight: 500; margin-top: 24px; color: #1a1a1a;">A caixa</h3>
              <p style="font-family: 'Hellix', sans-serif; font-size: 0.875rem; font-weight: 300; color: #666; margin-top: 12px; line-height: 1.6;">Uma caixa feita de papelão 100% reciclado e reciclável com certificação FSC.*</p>
            </div>

            <div class="presente-card-hellix" style="flex: 1; max-width: 600px; text-align: center;">
              <img 
                class="presente-card-image" 
                src="/images/presentear/msg.jpg" 
                alt="Motivo emblemático Dior"
                style="width: 100%; height: auto; object-fit: cover; display: block;"
              >
              <h3 style="font-family: 'Hellix', sans-serif; font-size: 1.25rem; font-weight: 500; margin-top: 24px; color: #1a1a1a;">Motivo emblemático</h3>
              <p style="font-family: 'Hellix', sans-serif; font-size: 0.875rem; font-weight: 300; color: #666; margin-top: 12px; line-height: 1.6;">A icônica Toile de Jouy – um mundo imaginário bucólico caro à Maison – revela-se no centro de cada caixa.</p>
            </div>
          </div>
        
        </div>
        </section>

        <!-- O Toque Final Section -->
        <section class="toque-final-section">
          <div class="toque-final-container">
            <span class="toque-final-label">O toque final</span>
            <h2 class="toque-final-title">A perfeição está nos detalhes. Aproveite os serviços Dior para prolongar a magia.</h2>
          </div>
        </section>

        <!-- Seleção de Presentes - Usando classes do services-dior que funcionam -->
        <section class="services-dior-section selecao-presentes-section" id="selecao-presentes">
          <div class="services-dior-container">
            <!-- Left Content - Text -->
            <div class="services-text-content">
              <h2 class="services-title">A seleção de presentes</h2>
              <a href="#" class="selecao-presentes-link" data-block="button">Descubra</a>
            </div>

            <!-- Right Content - Drag Cards -->
            <div class="services-drag-container">
              <div class="services-drag-track">
                <!-- Card 1 -->
                <article class="services-drag-card selecao-card-style">
                  <div class="services-card-image-wrap selecao-card-image-wrap">
                    <img src="/images/presentear/griss.webp" alt="Gris Dior" class="services-card-image" />
                  </div>
                  <p class="selecao-card-title">Gris Dior</p>
                </article>

                <!-- Card 2 -->
                <article class="services-drag-card selecao-card-style">
                  <div class="services-card-image-wrap selecao-card-image-wrap">
                    <img src="/images/presentear/miss.webp" alt="Miss Dior Essence" class="services-card-image" />
                  </div>
                  <p class="selecao-card-title">Miss Dior Essence</p>
                </article>

                <!-- Card 3 -->
                <article class="services-drag-card selecao-card-style">
                  <div class="services-card-image-wrap selecao-card-image-wrap">
                    <img src="/images/presentear/sauvage.jpg" alt="Sauvage Eau de Toilette" class="services-card-image" />
                  </div>
                  <p class="selecao-card-title">Sauvage Eau de Toilette</p>
                </article>

                <!-- Card 4 -->
                <article class="services-drag-card selecao-card-style">
                  <div class="services-card-image-wrap selecao-card-image-wrap">
                    <img src="/images/presentear/rouge.jpg" alt="Rouge Dior" class="services-card-image" />
                  </div>
                  <p class="selecao-card-title">Rouge Dior</p>
                </article>

                <!-- Card 5 -->
                <article class="services-drag-card selecao-card-style">
                  <div class="services-card-image-wrap selecao-card-image-wrap">
                    <img src="/images/presentear/capture.jpg" alt="Dior Capture Le Sérum" class="services-card-image" />
                  </div>
                  <p class="selecao-card-title">Dior Capture Le Sérum</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        </main>

        <!-- Footer -->
        <footer-section></footer-section>
      </div>

      
    `;
  }

  initVideoControls() {
    // Aguarda o DOM estar pronto
    setTimeout(() => {
      const video = document.getElementById("arte-section-video");
      const playPauseBtn = document.getElementById("arte-play-pause-btn");
      const muteUnmuteBtn = document.getElementById("arte-mute-unmute-btn");

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

      // Sincroniza estado inicial
      if (!video.paused) {
        iconPlay.style.display = "none";
        iconPause.style.display = "block";
      }
    }, 100);
  }

  initButtonAnimations() {
    // Aguarda o DOM estar pronto
    setTimeout(() => {
      const playPauseBtn = document.getElementById("arte-play-pause-btn");
      const muteUnmuteBtn = document.getElementById("arte-mute-unmute-btn");
      const playPauseBtn2 = document.getElementById("arte-play-pause-btn-2");
      const muteUnmuteBtn2 = document.getElementById("arte-mute-unmute-btn-2");
      const presentePlayPauseBtn = document.getElementById("presente-play-pause-btn");
      const presenteMuteUnmuteBtn = document.getElementById("presente-mute-unmute-btn");

      // Inicializa animação GSAP nos botões de controle do vídeo principal
      if (playPauseBtn && window.Button) {
        new window.Button(playPauseBtn);
      }

      if (muteUnmuteBtn && window.Button) {
        new window.Button(muteUnmuteBtn);
      }

      // Inicializa animação GSAP nos botões de controle do segundo vídeo
      if (playPauseBtn2 && window.Button) {
        new window.Button(playPauseBtn2);
      }

      if (muteUnmuteBtn2 && window.Button) {
        new window.Button(muteUnmuteBtn2);
      }

      // Inicializa animação GSAP nos botões de controle do vídeo do presente
      if (presentePlayPauseBtn && window.Button) {
        new window.Button(presentePlayPauseBtn);
      }

      if (presenteMuteUnmuteBtn && window.Button) {
        new window.Button(presenteMuteUnmuteBtn);
      }
    }, 150);
  }

  initVideoControls2() {
    // Aguarda o DOM estar pronto
    setTimeout(() => {
      const video = document.getElementById("arte-section-video-2");
      const playPauseBtn = document.getElementById("arte-play-pause-btn-2");
      const muteUnmuteBtn = document.getElementById("arte-mute-unmute-btn-2");

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

      // Sincroniza estado inicial
      if (!video.paused) {
        iconPlay.style.display = "none";
        iconPause.style.display = "block";
      }
    }, 100);
  }

  initPresenteVideoControls() {
    // Aguarda o DOM estar pronto
    setTimeout(() => {
      const video = document.getElementById("presente-video-1");
      const playPauseBtn = document.getElementById("presente-play-pause-btn");
      const muteUnmuteBtn = document.getElementById("presente-mute-unmute-btn");

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

      // Sincroniza estado inicial
      if (!video.paused) {
        iconPlay.style.display = "none";
        iconPause.style.display = "block";
      }
    }, 100);
  }

  // ============================================================================
  // SELEÇÃO DE PRESENTES - Drag Carousel GSAP (usando classes do services-dior)
  // ============================================================================
  initSelecaoPresentes() {
    setTimeout(() => {
      const section = this.querySelector("#selecao-presentes");
      if (!section) return;

      // Inicializar drag nos cards - usando as mesmas classes do HomePage
      const container = section.querySelector(".services-drag-container");
      const track = section.querySelector(".services-drag-track");
      const cards = section.querySelectorAll(".services-drag-card");

      if (container && track && cards.length > 0) {
        // Log para debug
        console.log("📐 Seleção Presentes Debug:", {
          containerWidth: container.offsetWidth,
          cardWidth: cards[0]?.offsetWidth,
          totalCards: cards.length,
          trackScrollWidth: track.scrollWidth,
        });

        this.selecaoDragInstance = initServicesDrag({
          container,
          track,
          cards,
          onUpdate: null,
        });
      }

      // Inicializar animação do botão
      const button = section.querySelector(".selecao-presentes-link");
      if (button) {
        initButtonUnderlineAnimation([button]);
      }

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

      console.log("✅ Seleção de Presentes Drag inicializado!");
    }, 300);
  }
}

customElements.define("arte-de-presentear-page", ArteDePresentearPage);
