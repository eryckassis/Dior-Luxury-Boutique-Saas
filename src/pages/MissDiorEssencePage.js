// ============================================================================
// MISS DIOR ESSENCE PAGE - Página dedicada à fragrância J'adore
// ============================================================================

import "../components/AppNavigation.js";
import "../components/FooterSection.js";
import { cartService } from "../services/CartService.js";

export class MissDiorEssencePage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.initVideoControls();
    this.initAnimations();
    this.initBagButtons();
  }

  disconnectedCallback() {
    // Cleanup video controls
    this.cleanupVideoControls();
  }

  animateOut() {
    return new Promise((resolve) => {
      if (!window.gsap) {
        resolve();
        return;
      }

      window.gsap.to(this, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: resolve,
      });
    });
  }

  initVideoControls() {
    // Aguarda o próximo frame para garantir que o DOM foi renderizado
    requestAnimationFrame(() => {
      const video = this.querySelector("#miss-dior-section-video");
      const playPauseBtn = this.querySelector("#miss-dior-play-pause-btn");
      const muteUnmuteBtn = this.querySelector("#miss-dior-mute-unmute-btn");

      if (!video || !playPauseBtn || !muteUnmuteBtn) return;

      // Play/Pause functionality
      this.playPauseHandler = () => {
        const iconPlay = playPauseBtn.querySelector(".icon-play");
        const iconPause = playPauseBtn.querySelector(".icon-pause");

        if (video.paused) {
          video.play();
          iconPlay.style.display = "none";
          iconPause.style.display = "block";
        } else {
          video.pause();
          iconPlay.style.display = "block";
          iconPause.style.display = "none";
        }
      };

      // Mute/Unmute functionality
      this.muteUnmuteHandler = () => {
        const iconMute = muteUnmuteBtn.querySelector(".icon-mute");
        const iconUnmute = muteUnmuteBtn.querySelector(".icon-unmute");

        if (video.muted) {
          video.muted = false;
          iconMute.style.display = "none";
          iconUnmute.style.display = "block";
        } else {
          video.muted = true;
          iconMute.style.display = "block";
          iconUnmute.style.display = "none";
        }
      };

      // Adiciona event listeners
      playPauseBtn.addEventListener("click", this.playPauseHandler);
      muteUnmuteBtn.addEventListener("click", this.muteUnmuteHandler);

      // Inicializa os ícones com o estado atual
      const iconPlay = playPauseBtn.querySelector(".icon-play");
      const iconPause = playPauseBtn.querySelector(".icon-pause");

      if (!video.paused) {
        iconPlay.style.display = "none";
        iconPause.style.display = "block";
      }
    });
  }

  cleanupVideoControls() {
    const playPauseBtn = this.querySelector("#miss-dior-play-pause-btn");
    const muteUnmuteBtn = this.querySelector("#miss-dior-mute-unmute-btn");

    if (playPauseBtn && this.playPauseHandler) {
      playPauseBtn.removeEventListener("click", this.playPauseHandler);
    }

    if (muteUnmuteBtn && this.muteUnmuteHandler) {
      muteUnmuteBtn.removeEventListener("click", this.muteUnmuteHandler);
    }
  }

  initAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;

    requestAnimationFrame(() => {
      const productCards = this.querySelectorAll(".essence-product-card");

      productCards.forEach((card, index) => {
        const imageWrapper = card.querySelector(".essence-product-image-wrapper");
        const image = card.querySelector(".essence-product-image");
        const overlay = card.querySelector(".essence-image-reveal-overlay");
        const productInfo = card.querySelector(".essence-product-info");

        if (!imageWrapper || !image || !overlay || !productInfo) return;

        // Image reveal animation
        const tl = window.gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            end: "top 20%",
            toggleActions: "play none none none",
          },
        });

        // Initial states
        window.gsap.set(image, {
          scale: 1.3,
          filter: "blur(10px)",
        });

        window.gsap.set(overlay, {
          scaleY: 1,
          transformOrigin: "top",
        });

        window.gsap.set(productInfo, {
          opacity: 0,
          y: 30,
        });

        // Animation sequence
        tl.to(overlay, {
          scaleY: 0,
          duration: 1.2,
          ease: "power3.inOut",
        })
          .to(
            image,
            {
              scale: 1,
              filter: "blur(0px)",
              duration: 1.2,
              ease: "power3.out",
            },
            "-=1.2",
          )
          .to(
            productInfo,
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
            },
            "-=0.6",
          );
      });
    });
  }

  initBagButtons() {
    requestAnimationFrame(() => {
      const bagButtons = this.querySelectorAll(".essence-bag-button");

      // Dados dos produtos (mapeamento por índice)
      const productsData = [
        {
          id: "essence-1",
          name: "Miss Dior",
          volume: "35 ml",
          price: 665,
          image: "/images/dioressence1.webp",
        },
        {
          id: "essence-2",
          name: "Miss Dior Essence",
          volume: "50 ml",
          price: 765,
          image: "/images/dioressence2.webp",
        },
        {
          id: "essence-3",
          name: "Miss Dior Essence",
          volume: "75 ml",
          price: 899,
          image: "/images/dioressence3.webp",
        },
        {
          id: "essence-4",
          name: "Miss Dior Parfum",
          volume: "35 ml",
          price: 715,
          image: "/images/parfum1.webp",
        },
        {
          id: "essence-5",
          name: "Miss Dior Blooming Bouquet",
          volume: "50 ml",
          price: 689,
          image: "/images/dioressence5.webp",
        },
        {
          id: "essence-6",
          name: "Mini Miss Maximum Dior",
          volume: "3x 7.5 ml",
          price: 545,
          image: "/images/dioressence6.webp",
        },
        {
          id: "essence-7",
          name: "O ritual de beleza Miss Dior - Edição Limitada",
          volume: "Kit",
          price: 1299,
          image: "/images/dioressence7.webp",
        },
        {
          id: "essence-8",
          name: "Coffret Miss Dior Eau de Parfum - Edição Limitada",
          volume: "Kit",
          price: 899,
          image: "/images/dioressence8.webp",
        },
        {
          id: "essence-9",
          name: "Coffret Miss Dior Blooming Bouquet - Edição Limitada",
          volume: "Kit",
          price: 849,
          image: "/images/dioressence9.webp",
        },
        {
          id: "essence-10",
          name: "Miss Dior Rose N'Roses",
          volume: "50 ml",
          price: 719,
          image: "/images/dioressence10.webp",
        },
        {
          id: "essence-11",
          name: "Miss Dior Parfum Mini Miss Parfum Solide",
          volume: "Kit",
          price: 589,
          image: "/images/dioressence11.webp",
        },
        {
          id: "essence-12",
          name: "Miss Dior Rose N'Roses Roller Pearl",
          volume: "20 ml",
          price: 429,
          image: "/images/dioressence12.webp",
        },
        {
          id: "essence-13",
          name: "Miss Dior Eau de Parfum Mini Miss Parfum Solide",
          volume: "Kit",
          price: 625,
          image: "/images/dioressence13.webp",
        },
        {
          id: "essence-14",
          name: "Miss Dior Óleo Corporal esfoliante com Extrato de Rosa",
          volume: "200 ml",
          price: 389,
          image: "/images/dioressence14.webp",
        },
      ];

      bagButtons.forEach((button, index) => {
        const productData = productsData[index];

        if (!productData) return;

        // Adiciona data attributes
        button.dataset.productId = productData.id;
        button.dataset.productName = productData.name;
        button.dataset.productVolume = productData.volume;
        button.dataset.productPrice = productData.price;
        button.dataset.productImage = productData.image;

        // Adiciona event listener
        button.addEventListener("click", (e) => {
          e.preventDefault();

          // Adiciona o produto ao carrinho
          cartService.addItem({
            id: productData.id,
            name: productData.name,
            volume: productData.volume,
            price: productData.price,
            image: productData.image,
          });

          // Feedback visual
          this.animateButtonFeedback(button);
        });
      });
    });
  }

  animateButtonFeedback(button) {
    if (!window.gsap) return;

    // Animação de sucesso
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

    // Muda temporariamente o ícone para checkmark
    const originalSVG = button.innerHTML;
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;

    // Volta ao ícone original após 1 segundo
    setTimeout(() => {
      button.innerHTML = originalSVG;
    }, 1000);
  }

  render() {
    this.innerHTML = `
      <div class="all-content" id="all-content" role="main">
        <!-- Navigation -->
        <app-navigation></app-navigation>

        <div class="miss-dior-essence-page">
          <!-- Hero Section -->
          <section class="essence-hero-section">
            <div class="essence-hero-content">
              <p class="essence-hero-category">Fragrâncias</p>
              <h1 class="essence-hero-title">Miss Dior</h1>
            </div>
          </section>
        </div>
         <div class="miss-dior-page">
          <!-- Hero Video Section -->
          <section class="miss-dior-video-section">
            <video
              class="miss-dior-video-bg"
              id="miss-dior-section-video"
              autoplay
              muted
              loop
              playsinline
            >
              <source src="/videos/essence.mp4" type="video/mp4" />
            </video>

            <!-- Conteúdo de texto sobre o vídeo -->
            <div class="miss-dior-video-content">
              <h1 class="miss-dior-video-title"></h1>
              <p class="miss-dior-video-description"></p>
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

          <!-- Products Section -->
          <section class="essence-products-section">
            <div class="essence-products-container">
              <!-- Product 1 -->
              <div class="essence-product-card">
                <div class="essence-product-image-wrapper">
                  <div class="essence-image-reveal-overlay"></div>
                  <img 
                    src="/images/dioressence1.webp" 
                    alt="J'adore Eau de Parfum" 
                    class="essence-product-image"
                  />
                </div>
                <div class="essence-product-info">
                  <h3 class="essence-product-name">Miss Dior</h3>
                  <p class="essence-product-description">Eau de Parfum</p>
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
                    <p class="essence-product-price">A partir de R$ 665</p>
                    <button 
                      class="essence-bag-button" 
                      aria-label="Adicionar ao carrinho"
                      data-product-id="essence-1"
                      data-product-name="Miss Dior"
                      data-product-volume="35 ml"
                      data-product-price="665"
                      data-product-image="/images/dioressence1.webp"
                    >
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
                  <img 
                    src="/images/dioressence2.webp" 
                    alt="J'adore Parfum d'Eau" 
                    class="essence-product-image"
                  />
                </div>
                <div class="essence-product-info">
                  <h3 class="essence-product-name">Miss Dior Essence</h3>
                  <p class="essence-product-description">Essence</p>
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
                    <p class="essence-product-price">A partir de R$ 765</p>
                    <button 
                      class="essence-bag-button" 
                      aria-label="Adicionar ao carrinho"
                      data-product-id="essence-2"
                      data-product-name="Miss Dior Essence"
                      data-product-volume="50 ml"
                      data-product-price="765"
                      data-product-image="/images/dioressence2.webp"
                    >
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
                  <img 
                    src="/images/dioressence3.webp" 
                    alt="J'adore Infinissime" 
                    class="essence-product-image"
                  />
                </div>
                <div class="essence-product-info">
                  <h3 class="essence-product-name">Miss Dior Essence</h3>
                  <p class="essence-product-description">Miss Dior Essence, a nova fragrância floral, amadeirada.</p>
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
                    <p class="essence-product-price">A partir de R$ 715</p>
                    <button class="essence-bag-button" aria-label="Adicionar ao carrinho">
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
        </div>

         <!-- Products Section -->
          <section class="essence-products-section">
            <div class="essence-products-container">
              <!-- Product 1 -->
              <div class="essence-product-card">
                <div class="essence-product-image-wrapper">
                  <div class="essence-image-reveal-overlay"></div>
                  <img 
                    src="/images/missparfum.webp" 
                    alt="J'adore Eau de Parfum" 
                    class="essence-product-image"
                  />
                </div>
                <div class="essence-product-info">
                  <h3 class="essence-product-name">Miss Dior Parfum</h3>
                  <p class="essence-product-description">Perfume de notas florais, frutadas e amadeiradas intensas</p>
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
                    <p class="essence-product-price">A partir de R$ 665</p>
                    <button class="essence-bag-button" aria-label="Adicionar ao carrinho">
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
                  <img 
                    src="/images/missbouque.webp" 
                    alt="J'adore Parfum d'Eau" 
                    class="essence-product-image"
                  />
                </div>
                <div class="essence-product-info">
                  <h3 class="essence-product-name">Miss Dior Blooming Bouquet</h3>
                  <p class="essence-product-description">Eau de toilette - notas frescas e suaves</p>
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
                    <p class="essence-product-price">A partir de R$ 765</p>
                    <button class="essence-bag-button" aria-label="Adicionar ao carrinho">
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
                  <img 
                    src="/images/minimiss.webp" 
                    alt="J'adore Infinissime" 
                    class="essence-product-image"
                  />
                </div>
                <div class="essence-product-info">
                  <h3 class="essence-product-name">Mini Miss Maximum Dior</h3>
                  <p class="essence-product-description">Miss Dior é reinventado em um novo formato de perfume sólido ultra-couture.</p>
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
                    <p class="essence-product-price">A partir de R$ 715</p>
                    <button class="essence-bag-button" aria-label="Adicionar ao carrinho">
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
        </div>

         <!-- Products Section -->
          <section class="essence-products-section">
            <div class="essence-products-container">
              <!-- Product 1 -->
              <div class="essence-product-card">
                <div class="essence-product-image-wrapper">
                  <div class="essence-image-reveal-overlay"></div>
                  <img 
                    src="/images/ritual1.webp" 
                    alt="J'adore Eau de Parfum" 
                    class="essence-product-image"
                  />
                </div>
                <div class="essence-product-info">
                  <h3 class="essence-product-name">O ritual de beleza Miss Dior - Edição Limitada</h3>
                  <p class="essence-product-description">A beleza da dior acompanha você</p>
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
                    <p class="essence-product-price">A partir de R$ 665</p>
                    <button class="essence-bag-button" aria-label="Adicionar ao carrinho">
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
                  <img 
                    src="/images/ritual2.webp" 
                    alt="J'adore Parfum d'Eau" 
                    class="essence-product-image"
                  />
                </div>
                <div class="essence-product-info">
                  <h3 class="essence-product-name">Cofrett Miss Dior Eau de Parfum - Edição Limitada</h3>
                  <p class="essence-product-description">O coffret mais cobiçado da Dior</p>
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
                    <p class="essence-product-price">A partir de R$ 765</p>
                    <button class="essence-bag-button" aria-label="Adicionar ao carrinho">
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
                  <img 
                    src="/images/ritual3.webp" 
                    alt="J'adore Infinissime" 
                    class="essence-product-image"
                  />
                </div>
                <div class="essence-product-info">
                  <h3 class="essence-product-name">Coffret Miss Dior Blooming Bouquet - Edição Limitada</h3>
                  <p class="essence-product-description">Eau de Parfum - Floral</p>
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
                    <p class="essence-product-price">A partir de R$ 715</p>
                    <button class="essence-bag-button" aria-label="Adicionar ao carrinho">
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
        </div>

         <!-- Products Section -->
          <section class="essence-products-section">
            <div class="essence-products-container">
              <!-- Product 1 -->
              <div class="essence-product-card">
                <div class="essence-product-image-wrapper">
                  <div class="essence-image-reveal-overlay"></div>
                  <img 
                    src="/images/roses.webp" 
                    alt="J'adore Eau de Parfum" 
                    class="essence-product-image"
                  />
                </div>
                <div class="essence-product-info">
                  <h3 class="essence-product-name">Miss Dior Rose N'Roses</h3>
                  <p class="essence-product-description">Eau de Toilette</p>
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
                    <p class="essence-product-price">A partir de R$ 555,00</p>
                    <button class="essence-bag-button" aria-label="Adicionar ao carrinho">
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
                  <img 
                    src="/images/lipstick.webp" 
                    alt="J'adore Parfum d'Eau" 
                    class="essence-product-image"
                  />
                </div>
                <div class="essence-product-info">
                  <h3 class="essence-product-name">Miss Dior Parfum Mini Miss Parfum Solide</h3>
                  <p class="essence-product-description">Perfume em stick sem álcool - notas florais, frutadas e amadeiradas intensas</p>
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
                    <p class="essence-product-price">A partir de R$ 765</p>
                    <button class="essence-bag-button" aria-label="Adicionar ao carrinho">
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
                  <img 
                    src="/images/pearl.webp" 
                    alt="J'adore Infinissime" 
                    class="essence-product-image"
                  />
                </div>
                <div class="essence-product-info">
                  <h3 class="essence-product-name">Miss Dior Rose N'Roses Roller Pearl</h3>
                  <p class="essence-product-description">Roller-pearl eau de toilette</p>
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
                    <p class="essence-product-price">A partir de R$ 715</p>
                    <button class="essence-bag-button" aria-label="Adicionar ao carrinho">
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
        </div>

          <section class="essence-products-section">
            <div class="essence-products-container">
              <!-- Product 1 -->
              <div class="essence-product-card">
                <div class="essence-product-image-wrapper">
                  <div class="essence-image-reveal-overlay"></div>
                  <img 
                    src="/images/solide.webp" 
                    alt="J'adore Eau de Parfum" 
                    class="essence-product-image"
                  />
                </div>
                <div class="essence-product-info">
                  <h3 class="essence-product-name">Miss Dior Eau de Parfum Mini Miss Parfum Solide</h3>
                  <p class="essence-product-description">Perfume em stick sem álcool - notas aveludadas e sensuais</p>
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
                    <p class="essence-product-price">A partir de R$ 665</p>
                    <button class="essence-bag-button" aria-label="Adicionar ao carrinho">
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
                  <img 
                    src="/images/oleo.webp" 
                    alt="J'adore Parfum d'Eau" 
                    class="essence-product-image"
                  />
                </div>
                <div class="essence-product-info">
                  <h3 class="essence-product-name">Miss Dior Óleo Corporal esfoliante com Extratto de Rosa</h3>
                  <p class="essence-product-description">Óleo corporal esfoliante</p>
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
                    <p class="essence-product-price">A partir de R$ 765</p>
                    <button class="essence-bag-button" aria-label="Adicionar ao carrinho">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              </section>

        <!-- Footer -->
        <footer-section></footer-section>
      </div>
    `;
  }
}

customElements.define("miss-dior-essence-page", MissDiorEssencePage);
