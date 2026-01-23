// ============================================================================
// PRODUCT DETAIL CONTENT - Conteúdo da página de detalhes do produto
// Galeria com drag horizontal + Informações do produto com tabs
// ============================================================================

import { getProductById, getRelatedProducts } from "../data/products.js";
import { router } from "../router/router.js";

export class ProductDetailContent extends HTMLElement {
  constructor() {
    super();
    this.product = null;
    this.currentSlide = 0;
    this.draggable = null;
    this.selectedColor = 0;
    this.selectedSize = null;
    this.activeTab = 0;
    this.currentPrice = "";
    this.currentImages = [];
  }

  // ============================================================================
  // HELPER METHODS - Lógica de exibição baseada na categoria
  // ============================================================================

  /**
   * Determina se o produto deve mostrar seletor de tamanho
   * @returns {boolean}
   */
  shouldShowSizeSelector() {
    if (!this.product) return false;

    const category = this.product.category?.toLowerCase();

    // Produtos com seleção de tamanho
    const categoriesWithSize = [
      "sapato",
      "blazer",
      "vestido",
      "casaco",
      "camisa",
      "calca",
      "saia",
      "jaqueta",
      "roupa",
    ];

    return categoriesWithSize.includes(category);
  }

  /**
   * Determina se o produto deve mostrar seletor de cores
   * @returns {boolean}
   */
  shouldShowColorSelector() {
    if (
      !this.product ||
      !this.product.colors ||
      this.product.colors.length === 0
    ) {
      return false;
    }
    return true;
  }

  /**
   * Determina se o produto usa tamanhos numéricos (sapatos) ou letras (roupas)
   * @returns {string} 'numeric' | 'alpha' | 'none'
   */
  getSizeType() {
    if (!this.product) return "none";

    const category = this.product.category?.toLowerCase();

    if (category === "sapato") {
      return "numeric"; // 35, 36, 37...
    } else if (
      [
        "blazer",
        "vestido",
        "casaco",
        "camisa",
        "calca",
        "saia",
        "jaqueta",
        "roupa",
      ].includes(category)
    ) {
      return "alpha"; // P, M, G, GG ou 34, 36, 38...
    }

    return "none";
  }

  connectedCallback() {
    const productId = this.getAttribute("data-product-id");
    this.product = getProductById(productId);

    if (!this.product) {
      this.innerHTML = `<div class="product-not-found">Produto não encontrado</div>`;
      return;
    }

    // Inicializa preço e imagens com a primeira cor (ou valores base)
    this.currentPrice = this.product.colors?.[0]?.price || this.product.price;
    this.currentImages =
      this.product.colors?.[0]?.images || this.product.images;

    this.render();
    this.initGalleryDrag();
    this.initEventListeners();
    this.initRelatedProductsDrag();
  }

  disconnectedCallback() {
    // Cleanup do Draggable
    if (this.draggable) {
      this.draggable.kill();
      this.draggable = null;
    }

    // Cleanup do Draggable de produtos relacionados
    if (this.relatedDraggable) {
      this.relatedDraggable.kill();
      this.relatedDraggable = null;
    }

    // Cleanup do ResizeObserver
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    // Cleanup do event listener de resize
    if (this.handleResize) {
      window.removeEventListener("resize", this.handleResize);
      this.handleResize = null;
    }
  }

  initGalleryDrag() {
    // Aguarda o DOM estar pronto e imagens carregadas
    requestAnimationFrame(() => {
      const track = this.querySelector(".product-gallery-track");
      const wrapper = this.querySelector(".product-gallery-wrapper");

      if (!track || !wrapper || !window.gsap || !window.Draggable) return;

      const slides = track.querySelectorAll(".product-gallery-slide");
      if (slides.length === 0) return;

      // Função para calcular bounds corretamente
      const calculateBounds = () => {
        const wrapperWidth = wrapper.offsetWidth;
        const slideWidth = slides[0]?.offsetWidth || wrapperWidth;
        const gap = 0; // Sem gap entre slides
        const totalWidth = slides.length * slideWidth;
        const maxDrag = Math.min(0, -(totalWidth - wrapperWidth));

        return { minX: maxDrag, maxX: 0 };
      };

      // Função para configurar dimensões
      const setupDimensions = () => {
        const wrapperWidth = wrapper.offsetWidth;

        // Define largura de cada slide = largura do wrapper
        slides.forEach((slide) => {
          slide.style.width = `${wrapperWidth}px`;
          slide.style.minWidth = `${wrapperWidth}px`;
          slide.style.flexShrink = "0";
        });

        // Define largura do track
        track.style.width = `${slides.length * wrapperWidth}px`;
        track.style.display = "flex";
        track.style.willChange = "transform";
      };

      // Configura dimensões iniciais
      setupDimensions();
      let bounds = calculateBounds();

      // Função para snap ao slide mais próximo
      const snapToNearestSlide = () => {
        const wrapperWidth = wrapper.offsetWidth;
        const currentX = gsap.getProperty(track, "x") || 0;
        const slideIndex = Math.round(Math.abs(currentX) / wrapperWidth);
        this.currentSlide = Math.max(
          0,
          Math.min(slideIndex, slides.length - 1)
        );

        gsap.to(track, {
          x: -(this.currentSlide * wrapperWidth),
          duration: 0.4,
          ease: "power2.out",
          overwrite: true,
          onComplete: () => {
            this.updateProgress();
            this.updateDots();
          },
        });
      };

      // Criar Draggable
      this.draggable = Draggable.create(track, {
        type: "x",
        bounds: bounds,
        inertia: true,
        edgeResistance: 0.65,
        throwResistance: 2000,
        cursor: "grab",
        activeCursor: "grabbing",
        allowNativeTouchScrolling: false,
        force3D: true,
        onPress: function () {
          // Parar qualquer animação em andamento para evitar conflito
          gsap.killTweensOf(track);
        },
        onDrag: () => {
          this.updateProgress();
        },
        onThrowUpdate: () => {
          this.updateProgress();
        },
        onDragEnd: () => {
          snapToNearestSlide();
        },
        onThrowComplete: () => {
          snapToNearestSlide();
        },
      })[0];

      // Handler de resize com debounce
      let resizeTimeout;
      this.handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          setupDimensions();
          bounds = calculateBounds();

          if (this.draggable) {
            this.draggable.applyBounds(bounds);

            // Reposiciona no slide atual
            const wrapperWidth = wrapper.offsetWidth;
            gsap.set(track, { x: -(this.currentSlide * wrapperWidth) });
          }

          this.updateProgress();
        }, 100);
      };

      window.addEventListener("resize", this.handleResize);

      // Aguarda imagens carregarem para recalcular
      const images = track.querySelectorAll("img");
      let loadedCount = 0;
      const totalImages = images.length;

      const onImageLoad = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setupDimensions();
          bounds = calculateBounds();
          if (this.draggable) {
            this.draggable.applyBounds(bounds);
          }
          this.updateProgress();
        }
      };

      images.forEach((img) => {
        if (img.complete) {
          onImageLoad();
        } else {
          img.addEventListener("load", onImageLoad);
          img.addEventListener("error", onImageLoad);
        }
      });

      // Inicializa progresso
      this.updateProgress();
    });
  }

  snapToSlide() {
    const track = this.querySelector(".product-gallery-track");
    const wrapper = this.querySelector(".product-gallery-wrapper");
    if (!track || !wrapper) return;

    const wrapperWidth = wrapper.offsetWidth;
    const slides = track.querySelectorAll(".product-gallery-slide");
    const currentX = gsap.getProperty(track, "x") || 0;

    // Calcula o slide mais próximo
    const slideIndex = Math.round(Math.abs(currentX) / wrapperWidth);
    this.currentSlide = Math.max(0, Math.min(slideIndex, slides.length - 1));

    // Anima para o slide
    gsap.to(track, {
      x: -(this.currentSlide * wrapperWidth),
      duration: 0.4,
      ease: "power2.out",
      overwrite: true,
      onComplete: () => {
        this.updateProgress();
        this.updateDots();
      },
    });
  }

  updateProgress() {
    const track = this.querySelector(".product-gallery-track");
    const wrapper = this.querySelector(".product-gallery-wrapper");
    const progressBar = this.querySelector(".gallery-progress-bar");
    if (!track || !wrapper || !progressBar) return;

    const slides = track.querySelectorAll(".product-gallery-slide");
    if (slides.length <= 1) {
      progressBar.style.width = "100%";
      return;
    }

    const wrapperWidth = wrapper.offsetWidth;
    const maxScroll = wrapperWidth * (slides.length - 1);
    const currentX = Math.abs(gsap.getProperty(track, "x") || 0);

    const progress = maxScroll > 0 ? (currentX / maxScroll) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }

  updateDots() {
    const dots = this.querySelectorAll(".gallery-dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === this.currentSlide);
    });
  }

  goToSlide(index) {
    const track = this.querySelector(".product-gallery-track");
    const wrapper = this.querySelector(".product-gallery-wrapper");
    if (!track || !wrapper) return;

    const slides = track.querySelectorAll(".product-gallery-slide");
    const wrapperWidth = wrapper.offsetWidth;

    this.currentSlide = Math.max(0, Math.min(index, slides.length - 1));

    gsap.to(track, {
      x: -(this.currentSlide * wrapperWidth),
      duration: 0.5,
      ease: "power2.out",
      overwrite: true,
      onComplete: () => {
        this.updateProgress();
        this.updateDots();
      },
    });
  }

  initEventListeners() {
    // Navegação da galeria
    this.querySelector(".gallery-nav-prev")?.addEventListener("click", () => {
      this.goToSlide(this.currentSlide - 1);
    });

    this.querySelector(".gallery-nav-next")?.addEventListener("click", () => {
      this.goToSlide(this.currentSlide + 1);
    });

    // Dots da galeria
    this.querySelectorAll(".gallery-dot").forEach((dot, index) => {
      dot.addEventListener("click", () => this.goToSlide(index));
    });

    // Seleção de cor
    this.querySelectorAll(".product-color-item").forEach((item, index) => {
      item.addEventListener("click", () => this.selectColor(index));
    });

    // Seleção de tamanho
    this.querySelectorAll(".product-size-item:not(.unavailable)").forEach(
      (item) => {
        item.addEventListener("click", () => this.selectSize(item));
      }
    );

    // Tabs
    this.querySelectorAll(".product-tab-btn").forEach((btn, index) => {
      btn.addEventListener("click", () => this.switchTab(index));
    });

    // Botão Ver Mais na descrição
    this.querySelector(".product-ver-mais")?.addEventListener("click", (e) => {
      e.preventDefault();
      this.toggleDescription();
    });

    // Botão Adicionar ao Carrinho
    this.querySelector(".product-btn-primary")?.addEventListener(
      "click",
      () => {
        this.addToCart();
      }
    );

    // Event listeners dos produtos relacionados são tratados no drag
  }

  toggleDescription() {
    const descriptionText = this.querySelector(".product-description-text");
    const verMaisBtn = this.querySelector(".product-ver-mais");
    const verMaisText = verMaisBtn?.querySelector(".ver-mais-text");
    const chevron = verMaisBtn?.querySelector(".fa-chevron-down");

    if (descriptionText && verMaisBtn) {
      const isCollapsed = descriptionText.classList.contains("collapsed");

      if (isCollapsed) {
        descriptionText.classList.remove("collapsed");
        if (verMaisText) verMaisText.textContent = "Ver menos";
        if (chevron) {
          chevron.classList.remove("fa-chevron-down");
          chevron.classList.add("fa-chevron-up");
        }
      } else {
        descriptionText.classList.add("collapsed");
        if (verMaisText) verMaisText.textContent = "Ver mais";
        if (chevron) {
          chevron.classList.remove("fa-chevron-up");
          chevron.classList.add("fa-chevron-down");
        }
      }
    }
  }

  selectColor(index) {
    this.selectedColor = index;

    // Atualiza visual
    this.querySelectorAll(".product-color-item").forEach((item, i) => {
      item.classList.toggle("active", i === index);
    });

    // Atualiza imagens e preço baseado na cor selecionada
    const color = this.product.colors[index];
    if (color) {
      // Atualiza preço
      this.currentPrice = color.price || this.product.price;
      const priceElement = this.querySelector(".product-price");
      if (priceElement) {
        priceElement.textContent = this.currentPrice;
      }

      // Atualiza título da cor
      const colorTitleElement = this.querySelector(".product-colors-title");
      if (colorTitleElement) {
        colorTitleElement.textContent = `Cor: ${color.label}`;
      }

      // Atualiza galeria de imagens se a cor tiver imagens próprias
      if (color.images && color.images.length > 0) {
        this.currentImages = color.images;
        this.updateGallery();
      }
    }
  }

  selectSize(item) {
    const size = item.getAttribute("data-size");
    this.selectedSize = size;

    this.querySelectorAll(".product-size-item").forEach((s) => {
      s.classList.toggle("active", s.getAttribute("data-size") === size);
    });
  }

  updateGallery() {
    const track = this.querySelector(".product-gallery-track");
    const pagination = this.querySelector(".gallery-pagination");

    if (!track || !this.currentImages) return;

    // Destrói o draggable existente
    if (this.draggable) {
      this.draggable.kill();
      this.draggable = null;
    }

    // Atualiza o HTML dos slides
    track.innerHTML = this.currentImages
      .map(
        (img, index) => `
        <div class="product-gallery-slide">
          <img src="${img}" alt="${this.product.name} - Imagem ${index + 1}" />
        </div>
      `
      )
      .join("");

    // Atualiza dots de paginação
    if (pagination) {
      pagination.innerHTML = this.currentImages
        .map(
          (_, index) => `
          <div class="gallery-dot ${
            index === 0 ? "active" : ""
          }" data-index="${index}"></div>
        `
        )
        .join("");
    }

    // Reseta slide atual
    this.currentSlide = 0;

    // Reinicializa o draggable
    setTimeout(() => {
      this.initGalleryDrag();
    }, 100);
  }

  switchTab(index) {
    this.activeTab = index;

    // Atualiza botões
    this.querySelectorAll(".product-tab-btn").forEach((btn, i) => {
      btn.classList.toggle("active", i === index);
    });

    // Atualiza painéis
    this.querySelectorAll(".product-tab-panel").forEach((panel, i) => {
      panel.classList.toggle("active", i === index);
    });
  }

  addToCart() {
    // Valida tamanho apenas se o produto requer seleção de tamanho
    if (
      this.shouldShowSizeSelector() &&
      !this.selectedSize &&
      this.product.sizes &&
      this.product.sizes.length > 1 &&
      this.product.sizes[0] !== "Único"
    ) {
      alert("Por favor, selecione um tamanho");
      return;
    }

    // Valida cor apenas se o produto tem cores disponíveis
    if (
      this.shouldShowColorSelector() &&
      !this.product.colors[this.selectedColor]
    ) {
      alert("Por favor, selecione uma cor");
      return;
    }

    // Adiciona ao carrinho
    const cartItem = {
      product: this.product,
      color: this.shouldShowColorSelector()
        ? this.product.colors[this.selectedColor]
        : null,
      size: this.shouldShowSizeSelector()
        ? this.selectedSize || this.product.sizes[0]
        : null,
    };

    alert(`${this.product.name} adicionado ao carrinho!`);
  }

  getCategoryLabel(category) {
    const labels = {
      blazer: "Blazers",
      sapato: "Sapatos",
      bolsa: "Bolsas",
      oculos: "Óculos",
    };
    return labels[category] || "Produtos";
  }

  initRelatedProductsDrag() {
    setTimeout(() => {
      if (!window.gsap || !window.Draggable) return;

      const container = this.querySelector(".related-drag-container");
      const slider = this.querySelector(".related-products-grid");
      const progressFill = this.querySelector(".related-drag-progress-fill");
      const cards = this.querySelectorAll(".related-product-card");

      if (!container || !slider || cards.length === 0) {
        return;
      }

      // Função para calcular bounds
      const calculateBounds = () => {
        const containerWidth = container.offsetWidth;
        const firstCard = cards[0].getBoundingClientRect();
        const lastCard = cards[cards.length - 1].getBoundingClientRect();
        const contentWidth = lastCard.right - firstCard.left;
        const padding =
          parseFloat(getComputedStyle(container).paddingLeft) || 0;
        const totalWidth = contentWidth + padding;
        const maxDrag = Math.min(0, -(totalWidth - containerWidth + padding));

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
      this.relatedDraggable = window.Draggable.create(slider, {
        type: "x",
        bounds: bounds,
        inertia: true,
        edgeResistance: 0.65,
        dragResistance: 0,
        throwResistance: 2000,
        cursor: "grab",
        activeCursor: "grabbing",
        allowNativeTouchScrolling: false,
        onClick: function (e) {
          // Previne click durante drag
          if (this.isDragging) return;

          const card = e.target.closest(".related-product-card");
          if (card) {
            e.preventDefault();
            e.stopPropagation();
            const productId = card.getAttribute("data-product-id");
            if (productId) {
              // Scroll suave para o topo antes de navegar
              window.scrollTo({ top: 0, behavior: "smooth" });
              setTimeout(() => {
                router.navigate(`/produto/${productId}`);
              }, 300);
            }
          }
        },
        onPress: function () {
          window.gsap.killTweensOf(slider);
          this.isDragging = false;
        },
        onDragStart: function () {
          this.isDragging = true;
        },
        onDrag: function () {
          updateProgress(this.x);
        },
        onThrowUpdate: function () {
          updateProgress(this.x);
        },
        onDragEnd: function () {
          // Reseta flag após um pequeno delay
          setTimeout(() => {
            this.isDragging = false;
          }, 100);
        },
      })[0];

      // Recalcular bounds on resize
      window.addEventListener("resize", () => {
        bounds = calculateBounds();
        if (this.relatedDraggable) {
          this.relatedDraggable.applyBounds(bounds);
          const currentX = this.relatedDraggable.x;
          if (currentX < bounds.minX) {
            window.gsap.to(slider, { x: bounds.minX, duration: 0.3 });
          }
        }
      });

      // Initial progress
      updateProgress(0);
    }, 300);
  }

  render() {
    const { product } = this;
    // Pega produtos relacionados misturando categorias quando necessário
    const relatedProducts = getRelatedProducts(product.id, 8, true);

    this.innerHTML = `
      <!-- Font Awesome para ícones -->
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
      
      <div class="product-detail-container">
        <!-- Galeria de Imagens -->
        <div class="product-gallery">
          <div class="product-gallery-wrapper">
            <div class="product-gallery-track">
              ${this.currentImages
                .map(
                  (img, index) => `
                <div class="product-gallery-slide">
                  <img src="${img}" alt="${product.name} - Imagem ${
                    index + 1
                  }" />
                </div>
              `
                )
                .join("")}
            </div>
          </div>

          <!-- Navegação -->
          <button class="gallery-nav gallery-nav-prev" aria-label="Imagem anterior">
            <svg viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button class="gallery-nav gallery-nav-next" aria-label="Próxima imagem">
            <svg viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          <!-- Indicadores -->
          <div class="gallery-pagination">
            ${this.currentImages
              .map(
                (_, index) => `
              <div class="gallery-dot ${
                index === 0 ? "active" : ""
              }" data-index="${index}"></div>
            `
              )
              .join("")}
          </div>

          <!-- Progress Bar -->
          <div class="gallery-progress">
            <div class="gallery-progress-bar" style="width: 0%"></div>
          </div>
        </div>

        <!-- Informações do Produto -->
        <div class="product-info">
          <!-- Breadcrumb -->
          <nav class="product-breadcrumb">
            <a href="/" data-route="/">Home</a>
            <span>/</span>
            <a href="/para-ela" data-route="/para-ela">${this.getCategoryLabel(
              product.category
            )}</a>
            <span>/</span>
            <span>${product.name}</span>
          </nav>

          <!-- Cabeçalho -->
          <header class="product-header">
            <h1 class="product-name">${product.name}</h1>
            <p class="product-description">${product.description}</p>
            <p class="product-price">${this.currentPrice}</p>
            <p class="product-reference">Ref. ${product.reference}</p>
          </header>

          <!-- Seleção de Cores -->
          ${
            this.shouldShowColorSelector()
              ? `
            <div class="product-colors">
              <p class="product-colors-title">Cor: ${
                product.colors[0].label
              }</p>
              <div class="product-colors-list">
                ${product.colors
                  .map(
                    (color, index) => `
                  <div class="product-color-item ${
                    index === 0 ? "active" : ""
                  }" 
                       data-color="${color.name}" 
                       title="${color.label}">
                    <img src="${color.image}" alt="${color.label}" />
                  </div>
                `
                  )
                  .join("")}
                ${
                  product.moreColors
                    ? `
                  <div class="product-more-colors">+${product.moreColors}</div>
                `
                    : ""
                }
              </div>
            </div>
          `
              : ""
          }

          <!-- Seleção de Tamanho -->
          ${
            this.shouldShowSizeSelector() &&
            product.sizes &&
            product.sizes.length > 0 &&
            product.sizes[0] !== "Único"
              ? `
            <div class="product-sizes">
              <div class="product-sizes-header">
                <p class="product-sizes-title">Tamanho</p>
                <span class="product-size-guide">Guia de tamanhos</span>
              </div>
              <div class="product-sizes-list">
                ${product.sizes
                  .map(
                    (size) => `
                  <div class="product-size-item" data-size="${size}">${size}</div>
                `
                  )
                  .join("")}
              </div>
            </div>
          `
              : ""
          }

          <!-- Botões de Ação -->
          <div class="product-actions">
            <button class="product-btn product-btn-secondary">
              Disponibilidade na(s) boutique(s)
            </button>
            <button class="product-btn product-btn-primary">
              Contato
            </button>
          </div>

          <!-- Tabs -->
          <div class="product-tabs">
            <div class="product-tabs-nav">
              <button class="product-tab-btn active" data-tab="0">
                <i class="fas fa-align-left"></i>
                <span>Descrição</span>
              </button>
              <button class="product-tab-btn" data-tab="1">
                <i class="fas fa-ruler"></i>
                <span>Tamanho e corte</span>
              </button>
              <button class="product-tab-btn" data-tab="2">
                <i class="fas fa-store"></i>
                <span>Contato e disponibilidade na loja</span>
              </button>
            </div>
            <div class="product-tabs-content">
              <!-- Tab Descrição -->
              <div class="product-tab-panel active" data-panel="0">
                <div class="description-content">
                  <p class="product-description-text collapsed">${
                    product.fullDescription
                  }</p>
                  <button class="product-ver-mais">
                    <span class="ver-mais-text">Ver mais</span>
                    <i class="fas fa-chevron-down"></i>
                  </button>
                </div>
                ${
                  product.material
                    ? `
                <div class="product-detail-info">
                  <h4><i class="fas fa-tag"></i> Material</h4>
                  <p>${product.material}</p>
                </div>
                `
                    : ""
                }
                ${
                  product.care
                    ? `
                <div class="product-detail-info">
                  <h4><i class="fas fa-heart"></i> Cuidados</h4>
                  <p>${product.care}</p>
                </div>
                `
                    : ""
                }
              </div>
              
              <!-- Tab Tamanho e Corte -->
              <div class="product-tab-panel" data-panel="1">
                ${
                  product.sizeInfo
                    ? `
                  <div class="size-info-section">
                    <ul class="size-info-list">
                      ${
                        product.sizeInfo.fit
                          ? `
                        <li>
                          <i class="fas fa-tshirt"></i>
                          <span>${product.sizeInfo.fit}</span>
                        </li>
                      `
                          : ""
                      }
                      ${
                        product.sizeInfo.sleeves
                          ? `
                        <li>
                          <i class="fas fa-ruler-horizontal"></i>
                          <span>${product.sizeInfo.sleeves}</span>
                        </li>
                      `
                          : ""
                      }
                      ${
                        product.sizeInfo.model
                          ? `
                        <li>
                          <i class="fas fa-user"></i>
                          <span>${product.sizeInfo.model}</span>
                        </li>
                      `
                          : ""
                      }
                      ${
                        product.sizeInfo.guide
                          ? `
                        <li>
                          <i class="fas fa-info-circle"></i>
                          <span>${product.sizeInfo.guide}</span>
                        </li>
                      `
                          : ""
                      }
                    </ul>
                  </div>
                `
                    : `
                  <div class="size-info-section">
                    <p><i class="fas fa-info-circle"></i> Informações de tamanho não disponíveis para este produto.</p>
                  </div>
                `
                }
              </div>
              
              <!-- Tab Contato e disponibilidade -->
              <div class="product-tab-panel" data-panel="2">
                <div class="store-info-section">
                  <div class="store-option-link">
                    <i class="fas fa-search"></i>
                    <div class="store-option-content">
                      <h4>Disponibilidade nas boutiques</h4>
                    </div>
                    <i class="fas fa-chevron-right"></i>
                  </div>
                  
                  <div class="store-option-link">
                    <svg class="store-icon" viewBox="0 0 24 24" width="20" height="20">
                      <path fill="currentColor" fill-rule="evenodd" d="M15.321 5a.7.7 0 1 0-1.4 0v1.3H9.7V5a.7.7 0 1 0-1.4 0v1.3H5.4a1.1 1.1 0 0 0-1.1 1.1v11.2a1.1 1.1 0 0 0 1.1 1.1h13.2a1.1 1.1 0 0 0 1.1-1.1V7.4a1.1 1.1 0 0 0-1.1-1.1h-3.279zm-7.02 3v-.3H5.7v2.6h12.6V7.7h-2.979V8a.7.7 0 1 1-1.4 0v-.3H9.7V8a.7.7 0 1 1-1.4 0m9.999 3.7H5.7v6.6h12.6z" clip-rule="evenodd"></path>
                    </svg>
                    <div class="store-option-content">
                      <h4>Agende seu atendimento em loja</h4>
                    </div>
                    <i class="fas fa-chevron-right"></i>
                  </div>
                  
                  <div class="store-option-link" data-route="/boutiques">
                    <svg class="store-icon" viewBox="0 0 24 24" width="20" height="20">
                      <path fill="currentColor" fill-rule="evenodd" d="M7.288 5.652a6.664 6.664 0 0 1 11.376 4.712c0 2.582-1.677 5.07-3.49 6.984A24 24 0 0 1 12 20.142a24.185 24.185 0 0 1-3.174-2.794c-1.813-1.914-3.49-4.402-3.49-6.984 0-1.768.702-3.463 1.952-4.712m4.323 15.93L12 21l.388.582a.7.7 0 0 1-.777 0m0 0L12 21c.388.582.39.582.39.582v-.001l.006-.004.018-.012.067-.046q.087-.06.245-.174a25.605 25.605 0 0 0 3.464-3.034c1.869-1.973 3.874-4.802 3.874-7.947a8.064 8.064 0 0 0-16.128 0c0 3.145 2.005 5.974 3.874 7.947a25.6 25.6 0 0 0 3.464 3.034q.157.114.245.174l.067.046.018.012.005.004zm-1.366-11.218a1.755 1.755 0 1 1 3.51 0 1.755 1.755 0 0 1-3.51 0M12 7.209a3.155 3.155 0 1 0 0 6.31 3.155 3.155 0 0 0 0-6.31" clip-rule="evenodd"></path>
                    </svg>
                    <div class="store-option-content">
                      <h4>As boutiques</h4>
                    </div>
                    <i class="fas fa-chevron-right"></i>
                  </div>
                  
                  <div class="store-contact-info">
                    <p>Em caso de dúvidas, nossos consultores de clientes terão o prazer de ajudar você. Entre em contato conosco pelo número <a href="tel:+33140737373">+33 1 40 73 73 73</a></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Produtos Relacionados -->
      ${
        relatedProducts.length > 0
          ? `
        <section class="related-products-section">
          <h2 class="related-products-title">Você também pode gostar</h2>
          
          <!-- Drag Container -->
          <div class="related-drag-container">
            <div class="related-products-grid">
              ${relatedProducts
                .map(
                  (p) => `
                <div class="related-product-card" data-product-id="${p.id}">
                  <div class="related-product-image">
                    <img src="${p.images[0]}" alt="${p.name}" loading="lazy" />
                  </div>
                  <div class="related-product-info">
                    <h3 class="related-product-name">${p.name}</h3>
                    <p class="related-product-price">${p.price}</p>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="related-drag-progress">
            <div class="related-drag-progress-fill"></div>
          </div>
        </section>
      `
          : ""
      }
    `;
  }
}

customElements.define("product-detail-content", ProductDetailContent);
