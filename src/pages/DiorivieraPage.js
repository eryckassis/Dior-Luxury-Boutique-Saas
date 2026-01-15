// ============================================================================
// DIORIVIERA PAGE - Reutilizando layout da ComprasMissDiorParfumPage
// ============================================================================

import "../components/AppNavigation.js";
import "../components/FooterSection.js";

export class DiorivieraPage extends HTMLElement {
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
        "100ml": {
          image: "/images/rivera100.webp",
          price: "R$ 2.890,00",
        },
        "200ml": {
          image: "/images/rivera200.webp",
          price: "R$ 3.519,00",
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
          const targetContent = this.querySelector(
            `.tab-content[data-tab="${tabId}"]`
          );
          if (targetContent) {
            targetContent.classList.add("active");
          }
        });
      });

      // Image Reveal Animation with GSAP
      if (window.gsap && window.ScrollTrigger) {
        const imageRevealWrapper = this.querySelector(
          ".image-reveal-wrapper-full"
        );
        if (imageRevealWrapper) {
          const overlay = imageRevealWrapper.querySelector(
            ".reveal-overlay-full"
          );
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
              "-=1.2"
            );
        }
      }

      // Review Form Modal
      const writeReviewBtn = this.querySelector(".reviews-load-more");
      const reviewModal = this.querySelector(".review-modal");
      const closeModalBtn = this.querySelector(".close-review-modal");
      const reviewForm = this.querySelector(".review-form");
      const starRatingInputs = this.querySelectorAll(".star-rating-input");

      // Open modal
      if (writeReviewBtn && reviewModal) {
        writeReviewBtn.addEventListener("click", () => {
          reviewModal.classList.add("active");
          document.body.style.overflow = "hidden";
        });
      }

      // Close modal
      if (closeModalBtn && reviewModal) {
        closeModalBtn.addEventListener("click", () => {
          reviewModal.classList.remove("active");
          document.body.style.overflow = "auto";
          document.body.style.overflowX = "hidden";
        });

        // Close on backdrop click
        reviewModal.addEventListener("click", (e) => {
          if (e.target === reviewModal) {
            reviewModal.classList.remove("active");
            document.body.style.overflow = "auto";
            document.body.style.overflowX = "hidden";
          }
        });
      }

      // Star rating selection
      starRatingInputs.forEach((star, index) => {
        star.addEventListener("click", () => {
          starRatingInputs.forEach((s, i) => {
            if (i <= index) {
              s.classList.add("selected");
            } else {
              s.classList.remove("selected");
            }
          });
        });
      });

      // Form submission
      if (reviewForm) {
        reviewForm.addEventListener("submit", (e) => {
          e.preventDefault();

          const formData = new FormData(reviewForm);
          const rating = this.querySelectorAll(
            ".star-rating-input.selected"
          ).length;
          const reviewText = formData.get("review-text");
          const recommend = formData.get("recommend");
          const name = formData.get("reviewer-name");

          console.log({
            rating,
            reviewText,
            recommend,
            name,
            date: new Date().toISOString(),
          });

          // Fechar modal e resetar form
          reviewModal.classList.remove("active");
          document.body.style.overflow = "auto";
          document.body.style.overflowX = "hidden";
          reviewForm.reset();
          starRatingInputs.forEach((s) => s.classList.remove("selected"));

          alert("Avaliação enviada com sucesso!");
        });
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
                <img src="/images/rivera100.webp" alt="Dioriviera" class="product-main-image" />
              </div>

              <!-- Product Info -->
              <div class="product-info-wrapper">
                <h1 class="product-detail-title">Dioriviera - Edição Limitada</h1>
                <p class="product-detail-subtitle">Eau de parfum - notas frutadas e florais</p>

                  <!-- Rating -->
                  <div class="product-rating">
                    <div class="stars">
                      <span class="star">☆</span>
                      <span class="star">☆</span>
                      <span class="star">☆</span>
                      <span class="star">☆</span>
                      <span class="star">☆</span>
                    </div>
                  </div>

                  <!-- Learn More Link -->
                  <a href="#" class="learn-more-link">Saiba Mais</a>

                  <!-- Size Options -->
                  <div class="product-sizes">
                    <p class="sizes-label">Este produto existe em 2 tamanhos</p>
                    <div class="size-options">
                      <button class="size-option active" data-size="100ml">100 ml</button>
                      <button class="size-option" data-size="200ml">200 ml</button>
                    </div>
                  </div>

                  <!-- Purchase Button -->
                  <button class="purchase-button">
                    <span class="button-text">Comprar</span>
                    <span class="button-price">R$ 3.519,00</span>
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
                        <p>Para esta edição limitada, Dioriviera apresenta-se num estojo com o padrão Toile de Jouy verde, uma tonalidade fresca e luminosa que evoca os reflexos esmeralda do mar Mediterrâneo. A silhueta alegre deste eau de parfum unissex reflete a dolce vita Dior, uma celebração da arte de viver vibrante que anima tanto a Maison quanto o sul de França. Floral e frutado, o seu rasto deixa flutuar aromas solares e estivais, conjugando notas de rosa e de figo verde. Edição limitada disponível para os formatos de 100 ml e 200 ml da eau de parfum Dioriviera.</p>
                      </div>

                      <!-- Perfumista Tab -->
                      <div class="tab-content" data-tab="perfumista">
                        <p>"Com Dioriviera, quis capturar a essência do verão mediterrâneo. Uma fragrância que evoca dias ensolarados na Riviera Francesa, onde o aroma das flores se mistura com a brisa do mar." - François Demachy</p>
                      </div>

                      <!-- Notas Tab -->
                      <div class="tab-content" data-tab="notas">
                        <p><strong>Notas de Topo:</strong> Figo Verde, Bergamota<br><br><strong>Notas de Coração:</strong> Rosa Centifólia, Jasmim, Flor de Laranjeira<br><br><strong>Notas de Fundo:</strong> Almíscar Branco, Sândalo, Cedro</p>
                      </div>

                      <!-- Aplicação Tab -->
                      <div class="tab-content" data-tab="aplicacao">
                        <p>• Aplique nos pontos de pulsação: pulsos, atrás das orelhas, pescoço<br>• Vaporize a 15-20cm de distância da pele<br>• Não esfregue os pulsos após a aplicação<br>• Para prolongar a duração, aplique após o banho com a pele ainda úmida</p>
                      </div>

                      <!-- Ingredientes Tab -->
                      <div class="tab-content" data-tab="ingredientes">
                        <p>ALCOHOL DENAT., PARFUM (FRAGRANCE), AQUA (WATER), LIMONENE, LINALOOL, CITRONELLOL, GERANIOL, HYDROXYCITRONELLAL, COUMARIN, CITRAL, FARNESOL, BENZYL BENZOATE, EUGENOL.</p>
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
              <h2 class="quote-title">The Spirit of the French Riviera*</h2>
              <p class="quote-subtitle">*O espírito da Riviera Francesa</p>
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
              <source src="/videos/rivera.mp4" type="video/mp4" />
            </video>
          </section>

          <section class="love-quote-section">
            <div class="love-quote-container">
            
              <h2 class="quote-title">Encontre seu perfume Miss Dior*</h2>
              
            </div>
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
                    <img src="/images/liquido.webp" alt="Dioriviera Sabonete Líquido" class="step-product-image" />
                  </div>
                  <div class="step-info">
                    <h3 class="step-product-name">Dioriviera Sabonete Líquido</h3>
                    <p class="step-product-description">Limpe as mãos e o corpo com o sabonete líquido Dioriviera, que libera uma espuma delicadamente perfumada com as notas frescas e florais da fragrância.</p>
                    <button class="step-buy-button">
                      <span class="step-buy-text">Comprar</span>
                      <span class="step-buy-price">R$ 565,00</span>
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
                    <img src="/images/creme.webp" alt="Dioriviera Leite Hidratante" class="step-product-image" />
                  </div>
                  <div class="step-info">
                    <h3 class="step-product-name">Dioriviera Leite Hidratante</h3>
                    <p class="step-product-description">Hidrate e sublime sua pele com a loção para mãos e corpo Dioriviera, elaborada com 90%* de ingredientes de origem natural. Textura leitosa.</p>
                    <button class="step-buy-button">
                      <span class="step-buy-text">Comprar</span>
                      <span class="step-buy-price">R$ 799,00</span>
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
                    <img src="/images/bivilera.webp" alt="Dioriviera" class="step-product-image" />
                  </div>
                  <div class="step-info">
                    <h3 class="step-product-name">Dioriviera</h3>
                    <p class="step-product-description">Descubra o eau de parfum unissex Dioriviera com notas frutadas e florais. Uma celebração da arte de viver mediterrânea. Frasco de 100 a 200 ml.</p>
                    <button class="step-buy-button">
                      <span class="step-buy-text">Comprar</span>
                      <span class="step-buy-price">R$ 2.890,00</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Reviews Section -->
          <section class="reviews-section-product">
            <div class="reviews-container">
              <div class="reviews-header-product">
                <p class="reviews-gama-text">La Collection Privée <span class="miss-dior-highlight">Dioriviera</span> por intensidade</p>
                <a href="#" class="reviews-discover-link">Descubra</a>
              </div>

              <div class="reviews-title-area">
                <h3 class="reviews-main-title">Avaliações sobre o produto</h3>
              </div>

              <div class="reviews-box-product">
                <div class="reviews-summary">
                  <p class="reviews-label">Avaliações</p>
                  <div class="reviews-stars-display">
                    <span class="review-star-filled">★</span>
                    <span class="review-star-filled">★</span>
                    <span class="review-star-filled">★</span>
                    <span class="review-star-filled">★</span>
                    <span class="review-star-filled">★</span>
                    <span class="review-star-empty">☆</span>
                  </div>
                  <p class="reviews-count">128 avaliações</p>
                </div>

                <div class="reviews-list">
                  <!-- Review 1 -->
                  <div class="review-item-card">
                    <div class="review-stars-rating">
                      <span class="review-star-filled">★</span>
                      <span class="review-star-filled">★</span>
                      <span class="review-star-filled">★</span>
                      <span class="review-star-filled">★</span>
                      <span class="review-star-filled">★</span>
                    </div>
                    <p class="review-date">Enviado há 3 dias</p>
                    <p class="review-text">Dioriviera é a essência do verão! A fragrância é fresca, alegre e perfeita para dias ensolarados. Me transporta para a Riviera Francesa a cada aplicação.</p>
                    <p class="review-recommendation">Você recomendaria esse produto a um amigo?<br><strong>Sim</strong></p>
                    <p class="review-author">Por Marina S.</p>
                  </div>

                  <!-- Review 2 -->
                  <div class="review-item-card">
                    <div class="review-stars-rating">
                      <span class="review-star-filled">★</span>
                      <span class="review-star-filled">★</span>
                      <span class="review-star-filled">★</span>
                      <span class="review-star-filled">★</span>
                      <span class="review-star-filled">★</span>
                    </div>
                    <p class="review-date">Enviado há 5 dias</p>
                    <p class="review-text">Apaixonado pela edição limitada! O estojo com padrão Toile de Jouy verde é simplesmente lindo. A fragrância combina perfeitamente com o visual mediterrâneo.</p>
                    <p class="review-recommendation">Você recomendaria esse produto a um amigo?<br><strong>Sim</strong></p>
                    <p class="review-author">Por Lucas P.</p>
                  </div>

                  <!-- Review 3 -->
                  <div class="review-item-card">
                    <div class="review-stars-rating">
                      <span class="review-star-filled">★</span>
                      <span class="review-star-filled">★</span>
                      <span class="review-star-filled">★</span>
                      <span class="review-star-filled">★</span>
                      <span class="review-star-filled">★</span>
                    </div>
                    <p class="review-date">Enviado há 7 dias</p>
                    <p class="review-text">As notas de figo verde e rosa são incríveis juntas. Um perfume unissex versátil que funciona tanto de dia quanto à noite. Duração excelente!</p>
                    <p class="review-recommendation">Você recomendaria esse produto a um amigo?<br><strong>Sim</strong></p>
                    <p class="review-author">Por Beatriz M.</p>
                  </div>

                  <!-- Review 4 -->
                  <div class="review-item-card">
                    <div class="review-stars-rating">
                      <span class="review-star-filled">★</span>
                      <span class="review-star-filled">★</span>
                      <span class="review-star-filled">★</span>
                      <span class="review-star-filled">★</span>
                      <span class="review-star-filled">★</span>
                    </div>
                    <p class="review-date">Enviado há 10 dias</p>
                    <p class="review-text">Dioriviera captura perfeitamente a dolce vita. É alegre, sofisticado e evoca memórias de férias no sul da França. Um must-have para o verão!</p>
                    <p class="review-recommendation">Você recomendaria esse produto a um amigo?<br><strong>Sim</strong></p>
                    <p class="review-author">Por Rafael C.</p>
                  </div>

                  <!-- Review 5 -->
                  <div class="review-item-card">
                    <div class="review-stars-rating">
                      <span class="review-star-filled">★</span>
                      <span class="review-star-filled">★</span>
                      <span class="review-star-filled">★</span>
                      <span class="review-star-filled">★</span>
                      <span class="review-star-filled">★</span>
                    </div>
                    <p class="review-date">Enviado há 12 dias</p>
                    <p class="review-text">Comprei como presente e foi um sucesso absoluto! A apresentação é impecável e o perfume é simplesmente divino. Vale cada centavo.</p>
                    <p class="review-recommendation">Você recomendaria esse produto a um amigo?<br><strong>Sim</strong></p>
                    <p class="review-author">Por Camila A.</p>
                  </div>
                </div>

                <div class="reviews-pagination">
                  <span class="pagination-info">1-5 de 128</span>
                  <div class="pagination-arrows">
                    <button class="pagination-btn" aria-label="Anterior">‹</button>
                    <button class="pagination-btn" aria-label="Próximo">›</button>
                  </div>
                </div>

                <button class="reviews-load-more">Escrever avaliação...</button>
              </div>

              <!-- Review Modal -->
              <div class="review-modal">
                <div class="review-modal-content">
                  <button class="close-review-modal" aria-label="Fechar">&times;</button>
                  
                  <h2 class="review-modal-title">AVALIAÇÃO DO PRODUTO</h2>
                  
                  <form class="review-form">
                    <div class="form-group">
                      <label class="form-label">Dê uma nota geral para o produto *</label>
                      <div class="star-rating-select">
                        <span class="star-rating-input">☆</span>
                        <span class="star-rating-input">☆</span>
                        <span class="star-rating-input">☆</span>
                        <span class="star-rating-input">☆</span>
                        <span class="star-rating-input">☆</span>
                        <span class="star-rating-input">☆</span>
                      </div>
                    </div>

                    <div class="form-group">
                      <label class="form-label" for="review-text">Sua avaliação do produto *</label>
                      <textarea 
                        id="review-text" 
                        name="review-text" 
                        class="form-textarea" 
                        placeholder="Dê detalhes sobre o produto e por que deu a nota acima. Se possível, fale como você usa o produto e dê dicas para outros consumidores."
                        required
                        rows="5"
                      ></textarea>
                    </div>

                    <div class="form-group">
                      <label class="form-label">Você recomendaria esse produto a um amigo? *</label>
                      <div class="radio-group">
                        <label class="radio-label">
                          <input type="radio" name="recommend" value="sim" required>
                          <span>Sim</span>
                        </label>
                        <label class="radio-label">
                          <input type="radio" name="recommend" value="nao">
                          <span>Não</span>
                        </label>
                      </div>
                    </div>

                    <div class="form-section-title">SEUS DADOS</div>

                    <div class="form-group">
                      <label class="form-label" for="reviewer-name">Entre com seu nome ou apelido *</label>
                      <input 
                        type="text" 
                        id="reviewer-name" 
                        name="reviewer-name" 
                        class="form-input" 
                        placeholder="Seu nome ou apelido"
                        required
                      >
                    </div>

                    <button type="submit" class="submit-review-btn">ENVIAR AVALIAÇÃO</button>
                  </form>
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

customElements.define("dioriviera-page", DiorivieraPage);
