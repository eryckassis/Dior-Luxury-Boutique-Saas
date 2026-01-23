// ============================================================================
// PRODUCT REVIEWS COMPONENT - Componente de Avaliações Reutilizável
// ============================================================================

import { reviewService } from "../services/ReviewService.js";
import { authService } from "../services/AuthService.js";
import { toast } from "./Toast.js";
import { router } from "../router/router.js";

export class ProductReviews extends HTMLElement {
  constructor() {
    super();
    this.reviews = [];
    this.stats = null;
    this.currentPage = 1;
    this.limit = 5;
    this.totalPages = 1;
    this.isLoading = false;
    this.hasUserReviewed = false;
    this._selectedRating = 0;
  }

  // Atributos observados
  static get observedAttributes() {
    return ["product-id", "product-name", "collection"];
  }

  get productId() {
    return this.getAttribute("product-id") || "";
  }

  get productName() {
    return this.getAttribute("product-name") || "Produto";
  }

  get collection() {
    return this.getAttribute("collection") || "";
  }

  async connectedCallback() {
    this.render();
    await this.loadData();
    this.initEventListeners();
    this.initRealtime();
  }

  disconnectedCallback() {
    // Remove subscription real-time
    if (this.realtimeCallback) {
      reviewService.unsubscribeFromProduct(this.productId, this.realtimeCallback);
    }
  }

  async loadData() {
    try {
      this.isLoading = true;
      this.updateLoadingState();

      // Carrega em paralelo
      const [reviewsData, statsData, userReviewed] = await Promise.all([
        reviewService.getReviews(this.productId, this.currentPage, this.limit),
        reviewService.getProductStats(this.productId),
        reviewService.hasUserReviewed(this.productId),
      ]);

      this.reviews = reviewsData.reviews;
      this.totalPages = reviewsData.totalPages;
      this.stats = statsData;
      this.hasUserReviewed = userReviewed;

      this.renderContent();
    } catch (error) {
      console.error("Erro ao carregar reviews:", error);
      // Não mostra toast de erro na primeira carga para não assustar usuário
    } finally {
      this.isLoading = false;
    }
  }

  initRealtime() {
    this.realtimeCallback = async (payload) => {
      console.log("🔄 Real-time update:", payload.eventType);
      // Recarrega dados quando há mudança
      await this.loadData();
    };

    reviewService.subscribeToProduct(this.productId, this.realtimeCallback);
  }

  initEventListeners() {
    // Delegação de eventos
    this.addEventListener("click", async (e) => {
      // Abrir modal
      if (e.target.closest(".reviews-load-more")) {
        e.preventDefault();
        await this.openReviewModal();
      }

      // Fechar modal (botão X)
      if (e.target.closest(".close-review-modal")) {
        e.preventDefault();
        this.closeReviewModal();
      }

      // Fechar modal (clique no backdrop)
      if (e.target.classList.contains("review-modal")) {
        this.closeReviewModal();
      }

      // Paginação anterior
      if (e.target.closest(".pagination-btn-prev")) {
        e.preventDefault();
        if (this.currentPage > 1) {
          this.currentPage--;
          await this.loadData();
        }
      }

      // Paginação próximo
      if (e.target.closest(".pagination-btn-next")) {
        e.preventDefault();
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
          await this.loadData();
        }
      }

      // Star rating
      if (e.target.classList.contains("star-rating-input")) {
        const value = parseInt(e.target.dataset.value);
        this.setStarRating(value);
      }
    });

    // Form submit
    this.addEventListener("submit", async (e) => {
      if (e.target.classList.contains("review-form")) {
        e.preventDefault();
        await this.handleSubmit(e.target);
      }
    });
  }

  async openReviewModal() {
    // Verifica autenticação de forma assíncrona
    const isAuth = await authService.isAuthenticatedAsync();
    if (!isAuth) {
      toast.warning("Faça login para avaliar este produto");
      // Fecha e redireciona para login
      setTimeout(() => router.navigate("/login"), 500);
      return;
    }

    // Verifica se já avaliou
    if (this.hasUserReviewed) {
      toast.info("Você já avaliou este produto");
      return;
    }

    const modal = this.querySelector(".review-modal");
    if (modal) {
      // Pré-preenche nome do usuário
      const user = authService.getCachedUser();
      const nameInput = this.querySelector('input[name="reviewer-name"]');
      if (nameInput && user?.user_metadata?.name) {
        nameInput.value = user.user_metadata.name;
      }

      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  closeReviewModal() {
    const modal = this.querySelector(".review-modal");
    const form = this.querySelector(".review-form");

    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "auto";
      document.body.style.overflowX = "hidden";
    }

    if (form) {
      form.reset();
      this.resetStarRating();
    }
  }

  setStarRating(value) {
    const stars = this.querySelectorAll(".star-rating-input");
    stars.forEach((star, index) => {
      if (index < value) {
        star.classList.add("selected");
        star.textContent = "★";
      } else {
        star.classList.remove("selected");
        star.textContent = "☆";
      }
    });

    // Guarda o valor
    this._selectedRating = value;
  }

  resetStarRating() {
    this._selectedRating = 0;
    const stars = this.querySelectorAll(".star-rating-input");
    stars.forEach((star) => {
      star.classList.remove("selected");
      star.textContent = "☆";
    });
  }

  async handleSubmit(form) {
    const formData = new FormData(form);
    const rating = this._selectedRating || 0;
    const text = formData.get("review-text")?.trim();
    const recommend = formData.get("recommend") === "sim";
    const authorName = formData.get("reviewer-name")?.trim();

    // Validações
    if (rating < 1 || rating > 5) {
      toast.error("Selecione uma nota de 1 a 5 estrelas");
      return;
    }

    if (!text || text.length < 10) {
      toast.error("A avaliação deve ter pelo menos 10 caracteres");
      return;
    }

    if (!authorName || authorName.length < 2) {
      toast.error("Informe seu nome ou apelido");
      return;
    }

    // Desabilita botão
    const submitBtn = form.querySelector(".submit-review-btn");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "ENVIANDO...";
    }

    try {
      await reviewService.createReview({
        productId: this.productId,
        rating,
        text,
        recommend,
        authorName,
      });

      toast.success("Avaliação enviada com sucesso!");
      this.closeReviewModal();
      this.hasUserReviewed = true;

      // Dados serão atualizados via real-time, mas força reload também
      await this.loadData();
    } catch (error) {
      toast.error(error.message || "Erro ao enviar avaliação");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "ENVIAR AVALIAÇÃO";
      }
    }
  }

  updateLoadingState() {
    const list = this.querySelector(".reviews-list");
    if (list && this.isLoading) {
      list.innerHTML = `
        <div class="reviews-loading">
          <div class="loading-spinner"></div>
          <p>Carregando avaliações...</p>
        </div>
      `;
    }
  }

  renderContent() {
    // Atualiza sumário
    const summary = this.querySelector(".reviews-summary");
    if (summary) {
      const avg = this.stats?.average_rating || 0;
      const total = this.stats?.total_reviews || 0;

      summary.innerHTML = `
        <p class="reviews-label">Avaliações</p>
        <div class="reviews-stars-display">
          ${reviewService.generateStarsHTML(avg)}
        </div>
        <p class="reviews-count">${total} avaliação${total !== 1 ? "ões" : ""}</p>
      `;
    }

    // Atualiza lista
    const list = this.querySelector(".reviews-list");
    if (list) {
      if (this.reviews.length === 0) {
        list.innerHTML = `
          <div class="reviews-empty">
            <p>Nenhuma avaliação ainda. Seja o primeiro a avaliar!</p>
          </div>
        `;
      } else {
        list.innerHTML = this.reviews
          .map((review) => this.renderReviewCard(review))
          .join("");
      }
    }

    // Atualiza paginação
    const pagination = this.querySelector(".reviews-pagination");
    if (pagination) {
      const total = this.stats?.total_reviews || 0;
      const start = total > 0 ? (this.currentPage - 1) * this.limit + 1 : 0;
      const end = Math.min(this.currentPage * this.limit, total);

      pagination.innerHTML = `
        <span class="pagination-info">${total > 0 ? `${start}-${end} de ${total}` : "0 avaliações"}</span>
        <div class="pagination-arrows">
          <button class="pagination-btn pagination-btn-prev" ${this.currentPage <= 1 ? "disabled" : ""} aria-label="Anterior">‹</button>
          <button class="pagination-btn pagination-btn-next" ${this.currentPage >= this.totalPages ? "disabled" : ""} aria-label="Próximo">›</button>
        </div>
      `;
    }

    // Atualiza botão de escrever
    const writeBtn = this.querySelector(".reviews-load-more");
    if (writeBtn) {
      if (this.hasUserReviewed) {
        writeBtn.textContent = "Você já avaliou este produto";
        writeBtn.disabled = true;
        writeBtn.classList.add("disabled");
      } else {
        writeBtn.textContent = "Escrever avaliação...";
        writeBtn.disabled = false;
        writeBtn.classList.remove("disabled");
      }
    }
  }

  renderReviewCard(review) {
    return `
      <div class="review-item-card" data-id="${review.id}">
        <div class="review-stars-rating">
          ${reviewService.generateStarsHTML(review.rating)}
        </div>
        <p class="review-date">${reviewService.formatRelativeDate(review.created_at)}</p>
        <p class="review-text">${this.escapeHtml(review.text)}</p>
        <p class="review-recommendation">
          Você recomendaria esse produto a um amigo?<br>
          <strong>${review.recommend ? "Sim" : "Não"}</strong>
        </p>
        <p class="review-author">Por ${this.escapeHtml(review.author_name)}</p>
      </div>
    `;
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  render() {
    const safeProductId = this.productId.replace(/[^a-zA-Z0-9-_]/g, "");
    
    this.innerHTML = `
      <section class="reviews-section-product">
        <div class="reviews-container">
          <div class="reviews-header-product">
            <p class="reviews-gama-text">${this.collection} <span class="miss-dior-highlight">${this.productName}</span> por intensidade</p>
            <a href="#" class="reviews-discover-link">Descubra</a>
          </div>

          <div class="reviews-title-area">
            <h3 class="reviews-main-title">Avaliações sobre o produto</h3>
          </div>

          <div class="reviews-box-product">
            <div class="reviews-summary">
              <p class="reviews-label">Avaliações</p>
              <div class="reviews-stars-display">
                <span class="review-star-empty">☆</span>
                <span class="review-star-empty">☆</span>
                <span class="review-star-empty">☆</span>
                <span class="review-star-empty">☆</span>
                <span class="review-star-empty">☆</span>
              </div>
              <p class="reviews-count">Carregando...</p>
            </div>

            <div class="reviews-list">
              <div class="reviews-loading">
                <div class="loading-spinner"></div>
                <p>Carregando avaliações...</p>
              </div>
            </div>

            <div class="reviews-pagination">
              <span class="pagination-info">-</span>
              <div class="pagination-arrows">
                <button class="pagination-btn pagination-btn-prev" disabled aria-label="Anterior">‹</button>
                <button class="pagination-btn pagination-btn-next" disabled aria-label="Próximo">›</button>
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
                    <span class="star-rating-input" data-value="1">☆</span>
                    <span class="star-rating-input" data-value="2">☆</span>
                    <span class="star-rating-input" data-value="3">☆</span>
                    <span class="star-rating-input" data-value="4">☆</span>
                    <span class="star-rating-input" data-value="5">☆</span>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label" for="review-text-${safeProductId}">Sua avaliação do produto *</label>
                  <textarea 
                    id="review-text-${safeProductId}" 
                    name="review-text" 
                    class="form-textarea" 
                    placeholder="Dê detalhes sobre o produto e por que deu a nota acima. Se possível, fale como você usa o produto e dê dicas para outros consumidores."
                    required
                    minlength="10"
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
                  <label class="form-label" for="reviewer-name-${safeProductId}">Entre com seu nome ou apelido *</label>
                  <input 
                    type="text" 
                    id="reviewer-name-${safeProductId}" 
                    name="reviewer-name" 
                    class="form-input" 
                    placeholder="Seu nome ou apelido"
                    required
                    minlength="2"
                  >
                </div>

                <button type="submit" class="submit-review-btn">ENVIAR AVALIAÇÃO</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define("product-reviews", ProductReviews);
