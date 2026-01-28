// ============================================================================
// MISS DIOR PAGE - Página dedicada à fragrância Miss Dior
// ============================================================================

import "../components/AppNavigation.js";
import "../components/FooterSection.js";
import { cartService } from "../services/CartService.js";

export class MissDiorPage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.initAnimations();
    this.initVideoControls();
    this.initBagButton();
  }

  disconnectedCallback() {
    // Cleanup animations
    if (this.animations) {
      this.animations.forEach((anim) => anim.kill());
    }
  }

  initVideoControls() {
    requestAnimationFrame(() => {
      const video = this.querySelector("#miss-dior-section-video");
      const playPauseBtn = this.querySelector("#miss-dior-play-pause-btn");
      const muteUnmuteBtn = this.querySelector("#miss-dior-mute-unmute-btn");

      if (!video || !playPauseBtn || !muteUnmuteBtn) return;

      // Play/Pause
      playPauseBtn.addEventListener("click", () => {
        if (video.paused) {
          video.play();
          playPauseBtn.querySelector(".icon-play").style.display = "none";
          playPauseBtn.querySelector(".icon-pause").style.display = "block";
        } else {
          video.pause();
          playPauseBtn.querySelector(".icon-play").style.display = "block";
          playPauseBtn.querySelector(".icon-pause").style.display = "none";
        }
      });

      // Mute/Unmute
      muteUnmuteBtn.addEventListener("click", () => {
        video.muted = !video.muted;
        if (video.muted) {
          muteUnmuteBtn.querySelector(".icon-mute").style.display = "block";
          muteUnmuteBtn.querySelector(".icon-unmute").style.display = "none";
        } else {
          muteUnmuteBtn.querySelector(".icon-mute").style.display = "none";
          muteUnmuteBtn.querySelector(".icon-unmute").style.display = "block";
        }
      });
    });
  }

  initAnimations() {
    requestAnimationFrame(() => {
      if (!window.gsap) return;

      this.animations = [];

      // Video Hero animation
      const heroTl = window.gsap.timeline();
      heroTl
        .from(".miss-dior-video-title", {
          y: 60,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
        })
        .from(
          ".miss-dior-video-description",
          {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.8",
        )
        .from(
          ".video-controls",
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.6",
        );

      this.animations.push(heroTl);

      // Full Image Reveal Animation
      const imageReveal = this.querySelector(".miss-dior-image-reveal");
      if (imageReveal) {
        const overlay = imageReveal.querySelector(".reveal-overlay");
        const image = imageReveal.querySelector(".reveal-image");

        const revealTl = window.gsap.timeline({
          scrollTrigger: {
            trigger: imageReveal,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        });

        revealTl
          .set(overlay, { scaleX: 1, transformOrigin: "left" })
          .set(image, { scale: 1.3 })
          .to(overlay, {
            scaleX: 0,
            duration: 1.2,
            ease: "power3.inOut",
          })
          .to(
            image,
            {
              scale: 1,
              duration: 1.2,
              ease: "power3.out",
            },
            "-=1.2",
          );

        this.animations.push(revealTl);
      }

      // Product Detail Animation
      const productDetail = this.querySelector(".miss-dior-product-info");
      if (productDetail) {
        const detailAnim = window.gsap.from(productDetail, {
          scrollTrigger: {
            trigger: productDetail,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        });
        this.animations.push(detailAnim);
      }

      // Double Images Reveal Animation
      const doubleImageReveals = this.querySelectorAll(".miss-dior-image-reveal-double");
      doubleImageReveals.forEach((imageReveal, index) => {
        const overlay = imageReveal.querySelector(".reveal-overlay");
        const image = imageReveal.querySelector(".reveal-image");

        const revealTl = window.gsap.timeline({
          scrollTrigger: {
            trigger: imageReveal,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        });

        revealTl
          .set(overlay, { scaleX: 1, transformOrigin: "left" })
          .set(image, { scale: 1.2 })
          .to(overlay, {
            scaleX: 0,
            duration: 1.2,
            ease: "power3.inOut",
            delay: index * 0.2, // Delay para segunda imagem
          })
          .to(
            image,
            {
              scale: 1,
              duration: 1.2,
              ease: "power3.out",
            },
            "-=1.2",
          );

        this.animations.push(revealTl);
      });

      // Double section description animation
      const doubleDescription = this.querySelector(".double-section-description");
      if (doubleDescription) {
        const descAnim = window.gsap.from(doubleDescription, {
          scrollTrigger: {
            trigger: doubleDescription,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        });
        this.animations.push(descAnim);
      }

      // Frasco Couture Image Reveal Animation
      const frascoReveal = this.querySelector(".miss-dior-image-reveal-frasco");
      if (frascoReveal) {
        const overlay = frascoReveal.querySelector(".reveal-overlay");
        const image = frascoReveal.querySelector(".reveal-image");

        const frascoTl = window.gsap.timeline({
          scrollTrigger: {
            trigger: frascoReveal,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        });

        frascoTl
          .set(overlay, { scaleX: 1, transformOrigin: "left" })
          .set(image, { scale: 1.3 })
          .to(overlay, {
            scaleX: 0,
            duration: 1.2,
            ease: "power3.inOut",
          })
          .to(
            image,
            {
              scale: 1,
              duration: 1.2,
              ease: "power3.out",
            },
            "-=1.2",
          );

        this.animations.push(frascoTl);
      }

      // Frasco Couture Content Animation
      const frascoContent = this.querySelector(".frasco-couture-content");
      if (frascoContent) {
        const frascoContentAnim = window.gsap.from(frascoContent, {
          scrollTrigger: {
            trigger: frascoContent,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          x: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        });
        this.animations.push(frascoContentAnim);
      }

      // Services Button Hover Animation
      const servicesButtons = this.querySelectorAll(".services-button");
      if (servicesButtons.length > 0) {
        servicesButtons.forEach((button) => {
          button.addEventListener("mouseenter", () => {
            window.gsap.to(button, {
              "--underline-width": "0%",
              duration: 0.4,
              ease: "power2.out",
            });
          });

          button.addEventListener("mouseleave", () => {
            window.gsap.to(button, {
              "--underline-width": "100%",
              duration: 0.4,
              ease: "power2.out",
            });
          });
        });
      }

      // Bouquets Full Image Animation
      const bouquetsImage = this.querySelector(".bouquets-full-image");
      const bouquetsText = this.querySelector(".bouquets-full-text");

      if (bouquetsImage) {
        const bouquetsImageAnim = window.gsap.from(bouquetsImage, {
          scrollTrigger: {
            trigger: bouquetsImage,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          scale: 1.2,
          opacity: 0,
          duration: 1.4,
          ease: "power3.out",
        });
        this.animations.push(bouquetsImageAnim);
      }

      if (bouquetsText) {
        const bouquetsTextAnim = window.gsap.from(bouquetsText, {
          scrollTrigger: {
            trigger: bouquetsText,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          y: 30,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          delay: 0.3,
        });
        this.animations.push(bouquetsTextAnim);
      }
    });
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

  initBagButton() {
    requestAnimationFrame(() => {
      const bagButtons = this.querySelectorAll(".product-bag-button");

      const productsData = [
        {
          id: "miss-dior-detail",
          name: "Miss Dior Parfum",
          volume: "35 ml",
          price: 665,
          image: "/images/missDiorle.webp",
        },
        {
          id: "miss-dior-1",
          name: "Miss Dior Parfum",
          volume: "35 ml",
          price: 665,
          image: "/images/parfum1.webp",
        },
        {
          id: "miss-dior-2",
          name: "Miss Dior",
          volume: "50 ml",
          price: 615,
          image: "/images/parfum2.webp",
        },
        {
          id: "miss-dior-3",
          name: "Miss Dior Blooming Bouquet",
          volume: "50 ml",
          price: 555,
          image: "/images/parfum3.webp",
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
              <source src="/videos/missdiorvideo.mp4" type="video/mp4" />
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

        <!-- Text Section -->
        <section class="miss-dior-text-section">
          <div class="container">
            <div class="miss-dior-text-content">
              <h2 class="miss-dior-main-title">Miss Dior uma fragrância voluptuosa</h2>
              <p class="miss-dior-main-description">
                “Miss Dior nasceu daquelas noites da Provence iluminadas por vagalumes, nas quais o jasmim verde serve de contraponto à melodia da noite e da terra.”

Christian Dior, 1947
              </p>
            </div>
          </div>
        </section>

        <!-- Full Image Section with Reveal -->
        <section class="miss-dior-full-image">
          <div class="miss-dior-image-reveal">
            <div class="reveal-overlay"></div>
            <img src="/images/missdiorimage1.webp" alt="Miss Dior Perfume" class="reveal-image" />
          </div>
        </section>

        <!-- Product Detail Section -->
        <section class="miss-dior-product-detail">
          <div class="container">
            <div class="miss-dior-product-info">
              <a href="/compras-miss-dior-parfum" class="product-detail-image" data-route="/compras-miss-dior-parfum">
                <img src="/images/missDiorle.webp" alt="Miss Dior Parfum" />
              </a>
              <div class="product-detail-content">
                <h3 class="product-name">Miss Dior Parfum</h3>
                <p class="product-description">Perfume - notas florais, frutadas e amadeiradas intensas</p>
                <div class="product-intensity">
                  <span class="intensity-label">Intensity</span>
                  <div class="intensity-bars">
                    <span class="bar filled"></span>
                    <span class="bar filled"></span>
                    <span class="bar filled"></span>
                    <span class="bar filled"></span>
                  </div>
                </div>
                <div class="product-detail-footer">
                  <p class="product-price">A partir de R$ 665</p>
                  <button class="product-bag-button product-detail-bag-button" aria-label="Adicionar ao carrinho">
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

         <section class="miss-dior-video-section">
            <video
              class="miss-dior-video-bg"
              id="miss-dior-section-video"
              autoplay
              muted
              loop
              playsinline
            >
              <source src="/videos/midior.mp4" type="video/mp4" />
            </video>

            <!-- Conteúdo de texto sobre o vídeo -->
            <div class="miss-dior-video-content">
              <h1 class="miss-dior-video-title"></h1>
              <p class="miss-dior-video-description"></p>
            </div>

           
            </div>
          </section>

        <!-- Two Images Section with Text -->
        <section class="miss-dior-double-image-section">
          <div class="container">
            <div class="miss-dior-double-content">
              <p class="double-section-description">
                Descubra o Miss Dior Parfum, uma fragrância voluptuosa com notas brilhantes de tangerina,
                onde o aroma frutado e rosado do jasmim estrela serve de contraponto à melodia da madeira.
              </p>
              
              <div class="double-images-grid">
                <div class="double-image-item">
                  <div class="miss-dior-image-reveal-double">
                    <div class="reveal-overlay"></div>
                    <img src="/images/missdiorflow.webp" alt="Miss Dior Flores" class="reveal-image" />
                  </div>
                </div>
                
                <div class="double-image-item">
                  <div class="miss-dior-image-reveal-double">
                    <div class="reveal-overlay"></div>
                    <img src="/images/missdiorflow2.webp" alt="Miss Dior Parfum Card" class="reveal-image" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Miss Dior Reinventado Section -->
        <section class="miss-dior-reinventado">
          <div class="container">
            <h2 class="reinventado-title">Miss Dior reinventado</h2>
            <p class="reinventado-subtitle">
              Uma explosão floral e gourmand que se instala como uma fruta na língua, envolvendo-se em flores sensuais e deixando um rastro âmbar denso e amadeirado.
            </p>

            <div class="reinventado-grid">
              <div class="reinventado-card">
                <div class="reinventado-image">
                  <img src="/images/1947.webp" alt="A noite de 1947" />
                  <div class="reinventado-logo"><br></div>
                </div>
                <h3 class="reinventado-card-title">A noite de 1947</h3>
                <p class="reinventado-card-text">
                  Francis Kurkdjian, Diretor Criativo de Fragrâncias, reinventa o lendário aroma chipre de Miss Dior com uma composição que mistura acordes florais frutados com voluptuosas notas de madeira âmbar.
                </p>
              </div>

              <div class="reinventado-card">
                <div class="reinventado-image">
                  <img src="/images/jasmin.webp" alt="Jasmim Estrela" />
                  <div class="reinventado-logo"><br></div>
                </div>
                <h3 class="reinventado-card-title">Jasmim Estrela</h3>
                <p class="reinventado-card-text">
                  Um tributo ao jasmim da fragrância original Miss Dior de 1947, um novo jasmim, obtido por meio de um tratamento raro e inovador, revela uma surpreendente nota rosa frutada que contrasta com a das madeiras, iluminado por explosões de tangerina.
                </p>
              </div>

              <div class="reinventado-card">
                <div class="reinventado-image">
                  <img src="/images/juventude.webp" alt="Um sopro de juventude" />
                  <div class="reinventado-logo"><br></div>
                </div>
                <h3 class="reinventado-card-title">Um sopro de juventude</h3>
                <p class="reinventado-card-text">
                  "Visualizar um novo Miss Dior é o desejo de capturar a juventude de sua época em um perfume."<br>
                  Francis Kurkdjian, 2024
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Frasco Couture Section -->
        <section class="miss-dior-frasco-couture">
          <div class="container">
            <div class="frasco-couture-grid">
              <div class="frasco-couture-image-wrapper">
                <div class="miss-dior-image-reveal-frasco">
                  <div class="reveal-overlay"></div>
                  <img src="/images/compredior.webp" alt="Miss Dior Parfum" class="reveal-image" />
                </div>
              </div>
              <div class="frasco-couture-content">
                <h2 class="frasco-couture-title">Um frasco ainda mais couture</h2>
                <p class="frasco-couture-text">
                  Mais couture do que nunca, o Miss Dior Parfum é adornado com um laço "poignard" trançado que ecoa a nova assinatura do rótulo. Emblemático de Miss Dior, o padrão pied-de-poule envolve o frasco rosa cintilante
                </p>
                <a href="/compras-miss-dior-parfum" class="services-button" data-route="/compras-miss-dior-parfum">Compre</a>
              </div>
            </div>
          </div>
        </section>

        <!-- Bouquets Full Image Section -->
        <section class="miss-dior-bouquets-full">
          <div class="bouquets-full-image-wrapper">
            <img src="/images/imagereveal.webp" alt="Miss Dior Bouquets" class="bouquets-full-image" />
          </div>
          <div class="container">
            <p class="bouquets-full-text">Descubra os Bouquets das fragrâncias Miss Dior</p>
          </div>
        </section>

        <!-- Products Grid Section -->
        <section class="miss-dior-products-grid">
          <div class="container">
            <div class="products-grid">
              <!-- Product 1 -->
              <div class="product-grid-item">
                <div class="product-grid-image">
                  <img src="/images/parfum1.webp" alt="Miss Dior Parfum" />
                </div>
                <div class="product-info">
                  <h3 class="product-name">Miss Dior Parfum</h3>
                  <p class="product-description">Perfume - notas florais, frutadas e amadeiradas intensas</p>
                  <div class="product-intensity">
                    <span class="intensity-label">Intensity</span>
                    <div class="intensity-bars">
                      <span class="bar filled"></span>
                      <span class="bar filled"></span>
                      <span class="bar filled"></span>
                      <span class="bar filled"></span>
                    </div>
                  </div>
                  <div class="product-footer">
                    <p class="product-price">A partir de R$ 665</p>
                    <button class="product-bag-button" aria-label="Adicionar ao carrinho">
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
              <div class="product-grid-item">
                <div class="product-grid-image">
                  <img src="/images/parfum2.webp" alt="Miss Dior" />
                </div>
                <div class="product-info">
                  <h3 class="product-name">Miss Dior</h3>
                  <p class="product-description">Eau De Parfum</p>
                  <div class="product-intensity">
                    <span class="intensity-label">Intensity</span>
                    <div class="intensity-bars">
                      <span class="bar filled"></span>
                      <span class="bar filled"></span>
                      <span class="bar filled"></span>
                      <span class="bar"></span>
                    </div>
                  </div>
                  <div class="product-footer">
                    <p class="product-price">A partir de R$ 615</p>
                    <button class="product-bag-button" aria-label="Adicionar ao carrinho">
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
              <div class="product-grid-item">
                <div class="product-grid-image">
                  <img src="/images/parfum3.webp" alt="Miss Dior Blooming Bouquet" />
                </div>
                <div class="product-info">
                  <h3 class="product-name">Miss Dior Blooming Bouquet</h3>
                  <p class="product-description">Eau de toilette - notas frescas e suaves</p>
                  <div class="product-intensity">
                    <span class="intensity-label">Intensity</span>
                    <div class="intensity-bars">
                      <span class="bar filled"></span>
                      <span class="bar filled"></span>
                      <span class="bar"></span>
                      <span class="bar"></span>
                    </div>
                  </div>
                  <div class="product-footer">
                    <p class="product-price">A partir de R$ 555</p>
                    <button class="product-bag-button" aria-label="Adicionar ao carrinho">
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
          </div>
        </section>
        </div>

        <!-- Footer -->
        <footer-section></footer-section>
      </div>
    `;
  }
}

customElements.define("miss-dior-page", MissDiorPage);
