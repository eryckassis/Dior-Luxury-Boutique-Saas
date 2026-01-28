import "../components/AppNavigation.js";
import "../components/FooterSection.js";
import "../components/ProductReviews.js";

export class DiorivieraPageDois extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.initInteractions();
  }

  disconnectedCallback() {}

  initInteractions() {
    requestAnimationFrame(() => {
      const productData = {
        "125ml": {
          image: "/images/presentear/rivera.webp",
          price: "R$ 1.490,00",
        },
        "250ml": {
          image: "/images/presentear/dois.webp",
          price: "R$ 2.590,00",
        },
      };

      const sizeButtons = this.querySelectorAll(".size-option");
      const productImage = this.querySelector(".product-main-image");
      const buttonPrice = this.querySelector(".button-price");

      sizeButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const size = button.dataset.size;

          sizeButtons.forEach((btn) => btn.classList.remove("active"));
          button.classList.add("active");

          if (productData[size]) {
            productImage.style.opacity = "0";

            setTimeout(() => {
              productImage.src = productData[size].image;
              buttonPrice.textContent = productData[size].price;

              productImage.style.opacity = "1";
            }, 300);
          }
        });
      });

      const tabButtons = this.querySelectorAll(".tab-button");
      const tabContents = this.querySelectorAll(".tab-content");

      tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const tabId = button.dataset.tab;

          tabButtons.forEach((btn) => btn.classList.remove("active"));
          tabContents.forEach((content) => content.classList.remove("active"));

          button.classList.add("active");
          const targetContent = this.querySelector(`.tab-content[data-tab="${tabId}"]`);
          if (targetContent) {
            targetContent.classList.add("active");
          }
        });
      });

      if (window.gsap && window.ScrollTrigger) {
        const imageRevealWrapper = this.querySelector(".image-reveal-wrapper-full");
        if (imageRevealWrapper) {
          const overlay = imageRevealWrapper.querySelector(".reveal-overlay-full");
          const image = imageRevealWrapper.querySelector(".reveal-image-full");

          const revealTl = window.gsap.timeline({
            scrollTrigger: {
              trigger: imageRevealWrapper,
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
        }
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

  render() {
    this.innerHTML = `
      <div class="all-content" id="all-content" role="main">
        <!-- Navigation -->
        <app-navigation></app-navigation>

        <div class="compras-miss-dior-page">
          <!-- Product Detail Section -->
          <section class="product-detail-section">
            <div class="product-detail-grid">
              <!-- Product Image -->
              <div class="product-image-wrapper">
                <img src="/images/presentear/rivera.webp" alt="Dioriviera" class="product-main-image" />
              </div>

              <!-- Product Info -->
              <div class="product-info-wrapper">
                <h1 class="product-detail-title">Dioriviera</h1>
                <p class="product-detail-subtitle">Eau de Toilette - Fragrância floral fresca e mediterrânea</p>

                  <!-- Rating -->
                  <div class="product-rating">
                    <div class="stars">
                      <span class="star filled">★</span>
                      <span class="star filled">★</span>
                      <span class="star filled">★</span>
                      <span class="star filled">★</span>
                      <span class="star filled">★</span>
                    </div>
                    <span class="rating-score">4.8</span>
                    <a href="#" class="rating-reviews">284 avaliações</a>
                  </div>

                  <!-- Learn More Link -->
                  <a href="#" class="learn-more-link">Saiba Mais</a>

                  <!-- Size Options -->
                  <div class="product-sizes">
                    <p class="sizes-label">Este produto existe em 2 tamanhos</p>
                    <div class="size-options">
                      <button class="size-option active" data-size="125ml">125 ml</button>
                      <button class="size-option" data-size="250ml">250 ml</button>
                    </div>
                  </div>

                  <!-- Purchase Button -->
                  <button class="purchase-button">
                    <span class="button-text">Comprar</span>
                    <span class="button-price">R$ 1.490,00</span>
                  </button>

                  <!-- Tabs Navigation -->
                  <div class="product-tabs">
                    <div class="tabs-header">
                      <button class="tab-button active" data-tab="description">Descrição</button>
                      <button class="tab-button" data-tab="perfumista">Palavras do perfumista</button>
                      <button class="tab-button" data-tab="notas">Notas olfativas</button>
                      <button class="tab-button" data-tab="aplicacao">Dicas de aplicação</button>
                      <button class="tab-button" data-tab="ingredientes">Lista de ingredientes</button>
                    </div>

                    <div class="tabs-content">
                      <!-- Description Tab -->
                      <div class="tab-content active" data-tab="description">
                        <p>Dioriviera é uma fragrância que captura a essência do verão mediterrâneo. Inspirada na Riviera Francesa, esta eau de toilette evoca dias ensolarados à beira-mar com suas notas frescas e florais. Uma composição luminosa que transporta você para um paraíso costeiro de elegância descontraída.</p>
                      </div>

                      <!-- Perfumista Tab -->
                      <div class="tab-content" data-tab="perfumista">
                        <p>"Com Dioriviera, quis criar uma fragrância que evocasse a alegria e a leveza do verão na Riviera. É como um mergulho refrescante no Mediterrâneo, com toda a elegância e sofisticação da Maison Dior." - François Demachy</p>
                      </div>

                      <!-- Notas Tab -->
                      <div class="tab-content" data-tab="notas">
                        <p><strong>Notas de Topo:</strong> Bergamota da Calábria, Neroli, Limão Siciliano<br><br><strong>Notas de Coração:</strong> Jasmim, Flor de Laranjeira, Magnólia<br><br><strong>Notas de Fundo:</strong> Almíscar Branco, Cedro, Âmbar</p>
                      </div>

                      <!-- Aplicação Tab -->
                      <div class="tab-content" data-tab="aplicacao">
                        <p>• Aplique nos pontos de pulsação: pulsos, atrás das orelhas, pescoço<br>• Ideal para dias quentes e ocasiões ao ar livre<br>• Vaporize a 15-20cm de distância da pele<br>• Reaplique durante o dia para manter a frescura</p>
                      </div>

                      <!-- Ingredientes Tab -->
                      <div class="tab-content" data-tab="ingredientes">
                        <p>ALCOHOL DENAT., PARFUM (FRAGRANCE), AQUA (WATER), LIMONENE, LINALOOL, CITRONELLOL, GERANIOL, CITRAL, FARNESOL, COUMARIN, BENZYL BENZOATE, EUGENOL, HYDROXYCITRONELLAL.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </section>

          <!-- Love Quote Section -->
          <section class="love-quote-section">
            <div class="love-quote-container">
              <p class="quote-author">La Collection Privée</p>
              <h2 class="quote-title">The Spirit of Mediterranean Summer*</h2>
              <p class="quote-subtitle">*O espírito do verão mediterrâneo</p>
            </div>
          </section>

          <!-- Video Full Section -->
          <section class="video-full-section">
            <video
              class="video-full-bg"
              autoplay
              muted
              loop
              playsinline
            >
              <source src="/videos/diorRivera.mp4" type="video/mp4" />
            </video>
          </section>

            <section class="love-quote-section">
            <div class="love-quote-container">
            
              <h2 class="quote-title">Encontre seu perfume Miss Dior*</h2>
              
            </div>
          </section>

            </section>

           <section class="image-reveal-full-section">
            <div class="image-reveal-wrapper-full">
              <div class="reveal-overlay-full"></div>
              <img src="/images/dirivera.webp" alt="Miss Dior" class="reveal-image-full" />
            </div>
          </section>

          <!-- Steps Ritual Section -->
          <section class="steps-ritual-section">
            <div class="steps-ritual-container">
              <div class="steps-ritual-grid">
                <!-- Step 1 - Limpar -->
                <div class="step-card">
                  <div class="step-header">
                    <p class="step-number">01</p>
                    <p class="step-label">Passo 1: Limpar</p>
                  </div>
                  <div class="step-image-wrapper">
                    <img src="/images/presentear/diorivera3.webp" alt="Dioriviera Sabonete" class="step-product-image" />
                  </div>
                  <div class="step-info">
                    <h3 class="step-product-name">Dioriviera Sabonete Perfumado</h3>
                    <p class="step-product-description">Limpe a pele com o sabonete perfumado Dioriviera, que envolve o corpo em uma espuma delicada com as notas frescas e florais da fragrância.</p>
                    <button class="step-buy-button">
                      <span class="step-buy-text">Comprar</span>
                      <span class="step-buy-price">R$ 485,00</span>
                    </button>
                  </div>
                </div>

                <!-- Step 2 - Hidratar -->
                <div class="step-card">
                  <div class="step-header">
                    <p class="step-number">02</p>
                    <p class="step-label">Passo 2: Hidratar</p>
                  </div>
                  <div class="step-image-wrapper">
                    <img src="/images/presentear/diorrivera4.webp" alt="Dioriviera Body Lotion" class="step-product-image" />
                  </div>
                  <div class="step-info">
                    <h3 class="step-product-name">Dioriviera Loção Corporal</h3>
                    <p class="step-product-description">Hidrate e perfume a pele com a loção corporal Dioriviera. Sua textura sedosa deixa a pele macia e delicadamente perfumada durante todo o dia.</p>
                    <button class="step-buy-button">
                      <span class="step-buy-text">Comprar</span>
                      <span class="step-buy-price">R$ 699,00</span>
                    </button>
                  </div>
                </div>

                <!-- Step 3 - Perfumar -->
                <div class="step-card">
                  <div class="step-header">
                    <p class="step-number">03</p>
                    <p class="step-label">Passo 3: Perfumar</p>
                  </div>
                  <div class="step-image-wrapper">
                    <img src="/images/presentear/diorrivera5.webp" alt="Dioriviera EDT" class="step-product-image" />
                  </div>
                  <div class="step-info">
                    <h3 class="step-product-name">Dioriviera Eau de Toilette</h3>
                    <p class="step-product-description">Complete o ritual com a eau de toilette Dioriviera. Uma fragrância luminosa que captura a essência do verão mediterrâneo. Frascos de 125 a 250 ml.</p>
                    <button class="step-buy-button">
                      <span class="step-buy-text">Comprar</span>
                      <span class="step-buy-price">R$ 1.490,00</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Reviews Section - Componente Reutilizável -->
          <product-reviews 
            product-id="dioriviera-edt-125ml"
            product-name="Dioriviera"
            collection="La Collection Privée"
          ></product-reviews>
        </div>

        <!-- Footer -->
        <footer-section></footer-section>
      </div>
    `;
  }
}

customElements.define("dioriviera-page-dois", DiorivieraPageDois);
