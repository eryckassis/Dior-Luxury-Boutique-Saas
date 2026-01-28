// ============================================================================
// COMPRAS MISS DIOR PARFUM PAGE - Página de produto Miss Dior Parfum
// ============================================================================

import "../components/AppNavigation.js";
import "../components/FooterSection.js";
import "../components/ProductReviews.js";

export class ComprasMissDiorParfumPage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.initInteractions();
  }

  disconnectedCallback() {
    // Cleanup
  }

  initInteractions() {
    requestAnimationFrame(() => {
      // Product data for each size
      const productData = {
        "35ml": {
          image: "/images/35mlmiss.webp",
          price: "R$ 465,00",
        },
        "50ml": {
          image: "/images/50mlmiss.webp",
          price: "R$ 665,00",
        },
        "80ml": {
          image: "/images/80mlmiss.webp",
          price: "R$ 865,00",
        },
      };

      // Size selector buttons with image and price change
      const sizeButtons = this.querySelectorAll(".size-option");
      const productImage = this.querySelector(".product-main-image");
      const buttonPrice = this.querySelector(".button-price");

      sizeButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const size = button.dataset.size;

          // Remove active class from all buttons
          sizeButtons.forEach((btn) => btn.classList.remove("active"));
          button.classList.add("active");

          // Update image and price
          if (productData[size]) {
            // Fade out effect
            productImage.style.opacity = "0";

            setTimeout(() => {
              productImage.src = productData[size].image;
              buttonPrice.textContent = productData[size].price;

              // Fade in effect
              productImage.style.opacity = "1";
            }, 300);
          }
        });
      });

      // Tab navigation
      const tabButtons = this.querySelectorAll(".tab-button");
      const tabContents = this.querySelectorAll(".tab-content");

      tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const tabId = button.dataset.tab;

          // Remove active class from all buttons and contents
          tabButtons.forEach((btn) => btn.classList.remove("active"));
          tabContents.forEach((content) => content.classList.remove("active"));

          // Add active class to clicked button and corresponding content
          button.classList.add("active");
          const targetContent = this.querySelector(`.tab-content[data-tab="${tabId}"]`);
          if (targetContent) {
            targetContent.classList.add("active");
          }
        });
      });

      // Image Reveal Animation with GSAP
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

      // Reviews agora são gerenciados pelo componente <product-reviews>
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
                <img src="/images/35mlmiss.webp" alt="Miss Dior Parfum" class="product-main-image" />
              </div>

              <!-- Product Info -->
              <div class="product-info-wrapper">
                <h1 class="product-detail-title">Miss Dior Parfum</h1>
                <p class="product-detail-subtitle">Perfume - notas florais, frutadas e amadeiradas intensas</p>

                  <!-- Rating -->
                  <div class="product-rating">
                    <div class="stars">
                      <span class="star filled">★</span>
                      <span class="star filled">★</span>
                      <span class="star filled">★</span>
                      <span class="star filled">★</span>
                      <span class="star filled">★</span>
                    </div>
                    <span class="rating-score">5.0</span>
                    <a href="#" class="rating-reviews">892 avaliações</a>
                  </div>

                  <!-- Learn More Link -->
                  <a href="#" class="learn-more-link">Saiba Mais</a>

                  <!-- Size Options -->
                  <div class="product-sizes">
                    <p class="sizes-label">Este produto existe em 3 tamanhos</p>
                    <div class="size-options">
                      <button class="size-option" data-size="35ml">35 ml</button>
                      <button class="size-option active" data-size="50ml">50 ml</button>
                      <button class="size-option" data-size="80ml">80 ml</button>
                    </div>
                  </div>

                  <!-- Purchase Button -->
                  <button class="purchase-button">
                    <span class="button-text">Comprar</span>
                    <span class="button-price">R$ 665,00</span>
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
                        <p>Entre força e graça, entre ousadia e elegância. Miss Dior Parfum é o sopro de feminilidade e juventude ao estilo Dior. Francis Kurkdjian, Diretor Criativo de Perfumes Dior, apropria-se da icônica silhueta olfativa de Miss Dior para recontá-la com modernidade. O perfume revela uma fusão de notas florais, frutadas e amadeiradas para compor uma fragrância vibrante e sensual.</p>
                      </div>

                      <!-- Perfumista Tab -->
                      <div class="tab-content" data-tab="perfumista">
                        <p>Conteúdo sobre as palavras do perfumista.</p>
                      </div>

                      <!-- Notas Tab -->
                      <div class="tab-content" data-tab="notas">
                        <p>Conteúdo sobre as notas olfativas.</p>
                      </div>

                      <!-- Aplicação Tab -->
                      <div class="tab-content" data-tab="aplicacao">
                        <p>Conteúdo sobre dicas de aplicação.</p>
                      </div>

                      <!-- Ingredientes Tab -->
                      <div class="tab-content" data-tab="ingredientes">
                        <p>Conteúdo sobre lista de ingredientes.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </section>

          <!-- Love Quote Section -->
          <section class="love-quote-section">
            <div class="love-quote-container">
              <p class="quote-author">Com Natalie Portman</p>
              <h2 class="quote-title">And you, what would you do for love?*</h2>
              <p class="quote-subtitle">*E você, o que faria por amor?</p>
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
              <source src="/videos/love.mp4" type="video/mp4" />
            </video>
          </section>

          <!-- Image Reveal Section -->
           <section class="love-quote-section">
            <div class="love-quote-container">
            
              <h2 class="quote-title">Encontre seu perfume Miss Dior*</h2>
              
            </div>
          </section>
          
          <section class="image-reveal-full-section">
            <div class="image-reveal-wrapper-full">
              <div class="reveal-overlay-full"></div>
              <img src="/images/compras.webp" alt="Miss Dior" class="reveal-image-full" />
            </div>
          </section>

          <!-- Reviews Section - Componente Reutilizável -->
          <product-reviews 
            product-id="miss-dior-parfum-50ml"
            product-name="Miss Dior"
            collection="A gama"
          ></product-reviews>
        </div>

       

        <!-- Footer -->
        <footer-section></footer-section>
      </div>
    `;
  }
}

customElements.define("compras-miss-dior-parfum-page", ComprasMissDiorParfumPage);
