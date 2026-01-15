// ============================================================================
// PERFUME PRODUCT DETAIL CONTENT - Componente reutilizável de conteúdo
// ============================================================================

import { getPerfumeById } from "../data/perfume-products.js";

export class PerfumeProductDetailContent extends HTMLElement {
  constructor() {
    super();
    this.product = null;
    this.currentSize = null;
  }

  connectedCallback() {
    const productId = this.getAttribute("data-product-id");
    
    if (productId) {
      this.product = getPerfumeById(productId);
    }

    if (!this.product) {
      this.innerHTML = `<div class="product-not-found">Produto não encontrado</div>`;
      return;
    }

    // Define o tamanho default
    this.currentSize = this.product.defaultSize;
    
    this.render();
    this.initInteractions();
  }

  getCurrentSizeData() {
    return this.product.sizes.find((s) => s.size === this.currentSize);
  }

  generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    let starsHtml = "";

    for (let i = 0; i < fullStars; i++) {
      starsHtml += '<span class="star filled">★</span>';
    }
    if (hasHalf) {
      starsHtml += '<span class="star half">★</span>';
    }
    for (let i = fullStars + (hasHalf ? 1 : 0); i < 5; i++) {
      starsHtml += '<span class="star">☆</span>';
    }

    return starsHtml;
  }

  generateReviewStars(rating) {
    let starsHtml = "";
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        starsHtml += '<span class="review-star-filled">★</span>';
      } else {
        starsHtml += '<span class="review-star-empty">☆</span>';
      }
    }
    return starsHtml;
  }

  generateSizeOptions() {
    return this.product.sizes
      .map(
        (size) => `
        <button class="size-option ${size.size === this.currentSize ? "active" : ""}" data-size="${size.size}">
          ${size.size}
        </button>
      `
      )
      .join("");
  }

  generateReviews() {
    return this.product.reviews
      .map(
        (review) => `
        <div class="review-item-card">
          <div class="review-stars-rating">
            ${this.generateReviewStars(review.rating)}
          </div>
          <p class="review-date">${review.date}</p>
          <p class="review-text">${review.text}</p>
          <p class="review-recommendation">Você recomendaria esse produto a um amigo?<br><strong>${review.recommend ? "Sim" : "Não"}</strong></p>
          <p class="review-author">Por ${review.author}</p>
        </div>
      `
      )
      .join("");
  }

  initInteractions() {
    requestAnimationFrame(() => {
      // Size selector buttons
      const sizeButtons = this.querySelectorAll(".size-option");
      const productImage = this.querySelector(".product-main-image");
      const buttonPrice = this.querySelector(".button-price");

      sizeButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const size = button.dataset.size;
          this.currentSize = size;

          // Remove active class from all buttons
          sizeButtons.forEach((btn) => btn.classList.remove("active"));
          button.classList.add("active");

          // Update image and price
          const sizeData = this.getCurrentSizeData();
          if (sizeData) {
            // Fade out effect
            productImage.style.opacity = "0";

            setTimeout(() => {
              productImage.src = sizeData.image;
              buttonPrice.textContent = sizeData.price;
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

          tabButtons.forEach((btn) => btn.classList.remove("active"));
          tabContents.forEach((content) => content.classList.remove("active"));

          button.classList.add("active");
          const targetContent = this.querySelector(`.tab-content[data-tab="${tabId}"]`);
          if (targetContent) {
            targetContent.classList.add("active");
          }
        });
      });

      // Image Reveal Animation
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

      if (writeReviewBtn && reviewModal) {
        writeReviewBtn.addEventListener("click", () => {
          reviewModal.classList.add("active");
          document.body.style.overflow = "hidden";
        });
      }

      if (closeModalBtn && reviewModal) {
        closeModalBtn.addEventListener("click", () => {
          reviewModal.classList.remove("active");
          document.body.style.overflow = "auto";
          document.body.style.overflowX = "hidden";
        });

        reviewModal.addEventListener("click", (e) => {
          if (e.target === reviewModal) {
            reviewModal.classList.remove("active");
            document.body.style.overflow = "auto";
            document.body.style.overflowX = "hidden";
          }
        });
      }

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

      if (reviewForm) {
        reviewForm.addEventListener("submit", (e) => {
          e.preventDefault();

          const formData = new FormData(reviewForm);
          const rating = this.querySelectorAll(".star-rating-input.selected").length;
          const reviewText = formData.get("review-text");
          const recommend = formData.get("recommend");
          const name = formData.get("reviewer-name");

          console.log({
            productId: this.product.id,
            rating,
            reviewText,
            recommend,
            name,
            date: new Date().toISOString(),
          });

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

  render() {
    const currentSizeData = this.getCurrentSizeData();

    this.innerHTML = `
      <div class="compras-miss-dior-page">
        <!-- Product Detail Section -->
        <section class="product-detail-section">
          <div class="product-detail-grid">
            <!-- Product Image -->
            <div class="product-image-wrapper">
              <img 
                src="${currentSizeData.image}" 
                alt="${this.product.name}" 
                class="product-main-image" 
              />
            </div>

            <!-- Product Info -->
            <div class="product-info-wrapper">
              <h1 class="product-detail-title">${this.product.name}</h1>
              <p class="product-detail-subtitle">${this.product.subtitle}</p>

              <!-- Rating -->
              <div class="product-rating">
                <div class="stars">
                  ${this.generateStars(this.product.rating)}
                </div>
                <span class="rating-score">${this.product.rating.toFixed(1)}</span>
                <a href="#reviews-section" class="rating-reviews">${this.product.reviewCount} avaliações</a>
              </div>

              <!-- Learn More Link -->
              <a href="#" class="learn-more-link">Saiba Mais</a>

              <!-- Size Options -->
              <div class="product-sizes">
                <p class="sizes-label">Este produto existe em ${this.product.sizes.length} tamanhos</p>
                <div class="size-options">
                  ${this.generateSizeOptions()}
                </div>
              </div>

              <!-- Purchase Button -->
              <button class="purchase-button">
                <span class="button-text">Comprar</span>
                <span class="button-price">${currentSizeData.price}</span>
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
                  <div class="tab-content active" data-tab="description">
                    <p>${this.product.tabs.description}</p>
                  </div>
                  <div class="tab-content" data-tab="perfumista">
                    <p>${this.product.tabs.perfumista}</p>
                  </div>
                  <div class="tab-content" data-tab="notas">
                    <p>${this.product.tabs.notas}</p>
                  </div>
                  <div class="tab-content" data-tab="aplicacao">
                    <p>${this.product.tabs.aplicacao}</p>
                  </div>
                  <div class="tab-content" data-tab="ingredientes">
                    <p>${this.product.tabs.ingredientes}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Love Quote Section (Ambassador) -->
        <section class="love-quote-section">
          <div class="love-quote-container">
            <p class="quote-author">Com ${this.product.ambassador}</p>
            <h2 class="quote-title">${this.product.ambassadorQuote}*</h2>
            <p class="quote-subtitle">*${this.product.ambassadorQuoteTranslation}</p>
          </div>
        </section>

        <!-- Video Full Section -->
        <section class="video-full-section">
          <video class="video-full-bg" autoplay muted loop playsinline>
            <source src="${this.product.video}" type="video/mp4" />
          </video>
        </section>

        <!-- Image Reveal Section -->
        <section class="love-quote-section">
          <div class="love-quote-container">
            <h2 class="quote-title">Encontre seu perfume ${this.product.family.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}*</h2>
          </div>
        </section>

        <section class="image-reveal-full-section">
          <div class="image-reveal-wrapper-full">
            <div class="reveal-overlay-full"></div>
            <img src="${this.product.galleryImage}" alt="${this.product.name}" class="reveal-image-full" />
          </div>
        </section>

        <!-- Reviews Section -->
        <section class="reviews-section-product" id="reviews-section">
          <div class="reviews-container">
            <div class="reviews-header-product">
              <p class="reviews-gama-text">A gama <span class="miss-dior-highlight">${this.product.family.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}</span> por intensidade</p>
              <a href="#" class="reviews-discover-link">Descubra</a>
            </div>

            <div class="reviews-title-area">
              <h3 class="reviews-main-title">Avaliações sobre o produto</h3>
            </div>

            <div class="reviews-box-product">
              <div class="reviews-summary">
                <p class="reviews-label">Avaliações</p>
                <div class="reviews-stars-display">
                  ${this.generateReviewStars(Math.round(this.product.rating))}
                </div>
                <p class="reviews-count">${this.product.reviewCount} avaliações</p>
              </div>

              <div class="reviews-list">
                ${this.generateReviews()}
              </div>

              <div class="reviews-pagination">
                <span class="pagination-info">1-${Math.min(5, this.product.reviews.length)} de ${this.product.reviewCount}</span>
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
                      placeholder="Dê detalhes sobre o produto e por que deu a nota acima."
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
    `;
  }
}

customElements.define("perfume-product-detail-content", PerfumeProductDetailContent);
