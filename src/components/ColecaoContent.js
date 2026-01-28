import { colecaoProducts } from "../data/colecao-products.js";
import { router } from "../router/router.js";
import { filterService } from "../services/FilterService.js";
import "./FilterSidebar.js";

export class ColecaoContent extends HTMLElement {
  constructor() {
    super();
    this.draggableInstance = null;
    this.productCarousels = [];
    this.animations = [];
    this.resizeHandler = null;
    this.intersectionObserver = null;
    this.renderedProducts = new Set(); // Track produtos já renderizados
    this.filteredProducts = [...colecaoProducts]; // Produtos filtrados
    this.unsubscribeFilter = null;
  }

  connectedCallback() {
    this.render();
    this.initFilterButton();
    this.initFilterListeners();
    this.initVirtualScrolling(); // Virtual Scrolling PRIMEIRO
    this.initDraggableCards();
  }

  disconnectedCallback() {
    // Cleanup filter subscription
    if (this.unsubscribeFilter) {
      this.unsubscribeFilter();
    }

    // Cleanup intersection observer
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }

    // Cleanup draggable
    if (this.draggableInstance) {
      this.draggableInstance.kill();
      this.draggableInstance = null;
    }

    // Cleanup product carousels
    if (this.productCarousels && this.productCarousels.length > 0) {
      this.productCarousels.forEach((carousel) => {
        if (carousel && typeof carousel.kill === "function") {
          carousel.kill();
        }
      });
      this.productCarousels = [];
    }

    // Remove resize listener
    if (this.resizeHandler) {
      window.removeEventListener("resize", this.resizeHandler);
      this.resizeHandler = null;
    }

    // Clear rendered products
    this.renderedProducts.clear();
  }

  initDraggableCards() {
    setTimeout(() => {
      if (!window.gsap || !window.Draggable) {
        console.warn("⚠️ GSAP ou Draggable não encontrado!");
        return;
      }

      const container = this.querySelector(".drag-cards-container");
      const track = this.querySelector(".drag-cards-track");
      const cards = this.querySelectorAll(".drag-card");
      const progressBar = this.querySelector(".drag-progress-bar");
      const progressFill = this.querySelector(".drag-progress-fill");

      if (!container || !track || cards.length === 0) {
        console.warn("⚠️ Elementos de drag não encontrados!");
        return;
      }

      // Função para calcular bounds corretamente
      const calculateBounds = () => {
        const containerWidth = container.offsetWidth;
        const trackRect = track.getBoundingClientRect();
        const firstCard = cards[0].getBoundingClientRect();
        const lastCard = cards[cards.length - 1].getBoundingClientRect();

        const trackStyles = getComputedStyle(track);
        const paddingLeft = parseFloat(trackStyles.paddingLeft) || 0;
        const paddingRight = parseFloat(trackStyles.paddingRight) || 0;

        const contentWidth = lastCard.right - firstCard.left + paddingLeft + paddingRight;

        const maxDrag = Math.min(0, -(contentWidth - containerWidth));

        return { minX: maxDrag, maxX: 0 };
      };

      let bounds = calculateBounds();

      // Função para atualizar a barra de progresso
      const updateProgress = (x) => {
        if (bounds.minX >= 0) return;
        const progress = Math.abs(x / bounds.minX);
        const percentage = Math.min(100, Math.max(0, progress * 100));
        window.gsap.set(progressFill, { width: `${percentage}%` });
      };

      if (bounds.minX >= 0) {
        console.warn("⚠️ Não há espaço suficiente para arrastar");
        return;
      }

      // Criar Draggable
      this.draggableInstance = window.Draggable.create(track, {
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
          window.gsap.killTweensOf(track);
        },
        onDrag: function () {
          updateProgress(this.x);
        },
        onThrowUpdate: function () {
          updateProgress(this.x);
        },
      })[0];

      // Recalcular bounds no resize
      this.resizeHandler = () => {
        bounds = calculateBounds();
        if (this.draggableInstance) {
          this.draggableInstance.applyBounds(bounds);
          const currentX = this.draggableInstance.x;
          if (currentX < bounds.minX) {
            window.gsap.to(track, { x: bounds.minX, duration: 0.3 });
          }
        }
      };

      window.addEventListener("resize", this.resizeHandler);

      // Clique na barra de progresso
      progressBar.addEventListener("click", (e) => {
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        const targetX = bounds.minX * percentage;

        window.gsap.to(track, {
          x: targetX,
          duration: 0.8,
          ease: "power2.out",
          onUpdate: () => updateProgress(window.gsap.getProperty(track, "x")),
        });
      });

      console.log("✅ Drag inicializado! Bounds:", bounds);
    }, 300);
  }

  initProductCarousels() {
    setTimeout(() => {
      if (!window.gsap || !window.Draggable) {
        console.warn("⚠️ GSAP ou Draggable não disponível para carrosséis");
        return;
      }

      const productItems = this.querySelectorAll(".product-showcase-item");

      productItems.forEach((item, index) => {
        const wrapper = item.querySelector(".product-showcase-image-wrapper");
        const track = item.querySelector(".product-images-track");
        const images = track?.querySelectorAll(".product-showcase-image");

        if (!wrapper || !track || !images || images.length <= 1) {
          return;
        }

        const imageCount = images.length;

        // Criar setas
        const leftArrow = document.createElement("button");
        leftArrow.className = "product-arrow product-arrow--left";
        leftArrow.setAttribute("aria-label", "Anterior");
        leftArrow.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>`;

        const rightArrow = document.createElement("button");
        rightArrow.className = "product-arrow product-arrow--right";
        rightArrow.setAttribute("aria-label", "Próximo");
        rightArrow.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>`;

        wrapper.appendChild(leftArrow);
        wrapper.appendChild(rightArrow);

        // Configurar dimensões
        const setupDimensions = () => {
          const wrapperWidth = wrapper.offsetWidth;
          window.gsap.set(track, { width: wrapperWidth * imageCount });
          window.gsap.set(images, { width: wrapperWidth });
        };

        setupDimensions();

        const getSlideWidth = () => wrapper.offsetWidth;
        const getMaxDrag = () => -(imageCount - 1) * getSlideWidth();

        // Criar barra de progresso
        const progressBar = document.createElement("div");
        progressBar.className = "product-carousel-progress";
        const progressFill = document.createElement("div");
        progressFill.className = "product-carousel-progress-fill";
        progressBar.appendChild(progressFill);
        wrapper.appendChild(progressBar);

        // Atualizar progresso
        const updateProgress = () => {
          const currentX = window.gsap.getProperty(track, "x");
          const progress = Math.abs(currentX / getMaxDrag());
          const percentage = Math.min(100, Math.max(0, progress * 100));
          window.gsap.set(progressFill, { width: `${percentage}%` });

          leftArrow.style.opacity = currentX >= -10 ? "0.5" : "1";
          leftArrow.style.pointerEvents = currentX >= -10 ? "none" : "auto";
          rightArrow.style.opacity = currentX <= getMaxDrag() + 10 ? "0.5" : "1";
          rightArrow.style.pointerEvents = currentX <= getMaxDrag() + 10 ? "none" : "auto";
        };

        // Navegação por setas
        const navigateByArrow = (direction) => {
          const currentX = window.gsap.getProperty(track, "x");
          const slideWidth = getSlideWidth();
          const targetX = direction === "left" ? currentX + slideWidth : currentX - slideWidth;
          const clampedX = Math.max(getMaxDrag(), Math.min(0, targetX));

          window.gsap.to(track, {
            x: clampedX,
            duration: 0.5,
            ease: "power2.out",
            onUpdate: updateProgress,
          });
        };

        leftArrow.addEventListener("click", (e) => {
          e.stopPropagation();
          navigateByArrow("left");
        });

        rightArrow.addEventListener("click", (e) => {
          e.stopPropagation();
          navigateByArrow("right");
        });

        // Criar Draggable
        const draggable = window.Draggable.create(track, {
          type: "x",
          bounds: { minX: getMaxDrag(), maxX: 0 },
          inertia: true,
          edgeResistance: 0.5,
          throwResistance: 1500,
          allowNativeTouchScrolling: false,
          onPress: function () {
            window.gsap.killTweensOf(track);
          },
          onDrag: updateProgress,
          onThrowUpdate: updateProgress,
          onThrowComplete: updateProgress,
        })[0];

        this.productCarousels.push(draggable);

        // Resize handler
        const handleResize = () => {
          setupDimensions();
          draggable.applyBounds({ minX: getMaxDrag(), maxX: 0 });
          updateProgress();
        };

        window.addEventListener("resize", handleResize);

        updateProgress();
      });

      console.log("✅ Product carousels inicializados!");
    }, 500);
  }

  initProductNavigation() {
    setTimeout(() => {
      const productItems = this.querySelectorAll(".product-showcase-item");

      productItems.forEach((item) => {
        const productId = item.getAttribute("data-product-id");
        if (!productId) return;

        let startX = 0;
        let startY = 0;
        let isDragging = false;

        item.addEventListener("mousedown", (e) => {
          startX = e.clientX;
          startY = e.clientY;
          isDragging = false;
        });

        item.addEventListener("touchstart", (e) => {
          startX = e.touches[0].clientX;
          startY = e.touches[0].clientY;
          isDragging = false;
        });

        item.addEventListener("mousemove", (e) => {
          const deltaX = Math.abs(e.clientX - startX);
          const deltaY = Math.abs(e.clientY - startY);
          if (deltaX > 5 || deltaY > 5) {
            isDragging = true;
          }
        });

        item.addEventListener("touchmove", (e) => {
          const deltaX = Math.abs(e.touches[0].clientX - startX);
          const deltaY = Math.abs(e.touches[0].clientY - startY);
          if (deltaX > 5 || deltaY > 5) {
            isDragging = true;
          }
        });

        item.addEventListener("click", (e) => {
          if (isDragging) return;

          const isArrow = e.target.closest(".product-arrow");
          const isProgressBar = e.target.closest(".product-carousel-progress");

          if (isArrow || isProgressBar) return;

          router.navigate(`/colecao/product/${productId}`);
        });

        item.style.cursor = "pointer";
      });

      console.log("✅ Navegação de produtos inicializada!");
    }, 600);
  }

  // ============================================================================
  // VIRTUAL SCROLLING - Renderiza apenas elementos visíveis
  // ============================================================================
  initVirtualScrolling() {
    setTimeout(() => {
      const productItems = this.querySelectorAll(".product-showcase-item");

      if (productItems.length === 0) {
        console.warn("⚠️ Nenhum produto encontrado para Virtual Scrolling");
        return;
      }

      // Intersection Observer: detecta quando produto entra na viewport
      const observerOptions = {
        root: null, // viewport
        rootMargin: "200px", // Pre-load 200px antes
        threshold: 0.01, // 1% visível já renderiza
      };

      this.intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const productId = entry.target.getAttribute("data-product-id");

          if (entry.isIntersecting && !this.renderedProducts.has(productId)) {
            // Marca como renderizado
            this.renderedProducts.add(productId);

            // Renderiza o conteúdo do produto
            this.renderProductContent(entry.target);

            // Para de observar (já foi renderizado)
            this.intersectionObserver.unobserve(entry.target);
          }
        });
      }, observerOptions);

      // Observa todos os produtos
      productItems.forEach((item) => {
        this.intersectionObserver.observe(item);
      });

      console.log(`✅ Virtual Scrolling ativo - ${productItems.length} produtos`);
    }, 100);
  }

  // Renderiza conteúdo do produto quando entra na viewport
  renderProductContent(productElement) {
    const productId = productElement.getAttribute("data-product-id");
    const product = colecaoProducts.find((p) => p.id === productId);

    if (!product) return;

    // Inicializa carrossel para este produto específico
    this.initSingleProductCarousel(productElement);

    // Inicializa navegação para este produto
    this.initSingleProductNavigation(productElement);
  }

  // Inicializa carrossel de um único produto
  initSingleProductCarousel(item) {
    if (!window.gsap || !window.Draggable) return;

    const wrapper = item.querySelector(".product-showcase-image-wrapper");
    const track = item.querySelector(".product-images-track");
    const images = track?.querySelectorAll(".product-showcase-image");

    if (!wrapper || !track || !images || images.length <= 1) {
      return;
    }

    const imageCount = images.length;

    // Criar setas
    const leftArrow = document.createElement("button");
    leftArrow.className = "product-arrow product-arrow--left";
    leftArrow.setAttribute("aria-label", "Anterior");
    leftArrow.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>`;

    const rightArrow = document.createElement("button");
    rightArrow.className = "product-arrow product-arrow--right";
    rightArrow.setAttribute("aria-label", "Próximo");
    rightArrow.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>`;

    wrapper.appendChild(leftArrow);
    wrapper.appendChild(rightArrow);

    // Configurar dimensões
    const setupDimensions = () => {
      const wrapperWidth = wrapper.offsetWidth;
      window.gsap.set(track, { width: wrapperWidth * imageCount });
      window.gsap.set(images, { width: wrapperWidth });
    };

    setupDimensions();

    const getSlideWidth = () => wrapper.offsetWidth;
    const getMaxDrag = () => -(imageCount - 1) * getSlideWidth();

    // Criar barra de progresso
    const progressBar = document.createElement("div");
    progressBar.className = "product-carousel-progress";
    const progressFill = document.createElement("div");
    progressFill.className = "product-carousel-progress-fill";
    progressBar.appendChild(progressFill);
    wrapper.appendChild(progressBar);

    // Atualizar progresso
    const updateProgress = () => {
      const currentX = window.gsap.getProperty(track, "x");
      const progress = Math.abs(currentX / getMaxDrag());
      const percentage = Math.min(100, Math.max(0, progress * 100));
      window.gsap.set(progressFill, { width: `${percentage}%` });

      leftArrow.style.opacity = currentX >= -10 ? "0.5" : "1";
      leftArrow.style.pointerEvents = currentX >= -10 ? "none" : "auto";
      rightArrow.style.opacity = currentX <= getMaxDrag() + 10 ? "0.5" : "1";
      rightArrow.style.pointerEvents = currentX <= getMaxDrag() + 10 ? "none" : "auto";
    };

    // Navegação por setas
    const navigateByArrow = (direction) => {
      const currentX = window.gsap.getProperty(track, "x");
      const slideWidth = getSlideWidth();
      const targetX = direction === "left" ? currentX + slideWidth : currentX - slideWidth;
      const clampedX = Math.max(getMaxDrag(), Math.min(0, targetX));

      window.gsap.to(track, {
        x: clampedX,
        duration: 0.5,
        ease: "power2.out",
        onUpdate: updateProgress,
      });
    };

    leftArrow.addEventListener("click", (e) => {
      e.stopPropagation();
      navigateByArrow("left");
    });

    rightArrow.addEventListener("click", (e) => {
      e.stopPropagation();
      navigateByArrow("right");
    });

    // Criar Draggable
    const draggable = window.Draggable.create(track, {
      type: "x",
      bounds: { minX: getMaxDrag(), maxX: 0 },
      inertia: true,
      edgeResistance: 0.5,
      throwResistance: 1500,
      allowNativeTouchScrolling: false,
      onPress: function () {
        window.gsap.killTweensOf(track);
      },
      onDrag: updateProgress,
      onThrowUpdate: updateProgress,
      onThrowComplete: updateProgress,
    })[0];

    this.productCarousels.push(draggable);

    updateProgress();
  }

  // Inicializa navegação de um único produto
  initSingleProductNavigation(item) {
    const productId = item.getAttribute("data-product-id");
    if (!productId) return;

    let startX = 0;
    let startY = 0;
    let isDragging = false;

    item.addEventListener("mousedown", (e) => {
      startX = e.clientX;
      startY = e.clientY;
      isDragging = false;
    });

    item.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDragging = false;
    });

    item.addEventListener("mousemove", (e) => {
      const deltaX = Math.abs(e.clientX - startX);
      const deltaY = Math.abs(e.clientY - startY);
      if (deltaX > 5 || deltaY > 5) {
        isDragging = true;
      }
    });

    item.addEventListener("touchmove", (e) => {
      const deltaX = Math.abs(e.touches[0].clientX - startX);
      const deltaY = Math.abs(e.touches[0].clientY - startY);
      if (deltaX > 5 || deltaY > 5) {
        isDragging = true;
      }
    });

    item.addEventListener("click", (e) => {
      if (isDragging) return;

      const isArrow = e.target.closest(".product-arrow");
      const isProgressBar = e.target.closest(".product-carousel-progress");

      if (isArrow || isProgressBar) return;

      router.navigate(`/colecao/product/${productId}`);
    });

    item.style.cursor = "pointer";
  }

  initAnimations() {
    // SEM ANIMAÇÕES - Virtual Scrolling otimizado
  }

  // ============================================================================
  // FILTER SYSTEM
  // ============================================================================

  initFilterButton() {
    const filterBtn = this.querySelector(".filter-trigger-btn");
    if (filterBtn) {
      filterBtn.addEventListener("click", () => this.openFilterSidebar());
    }
  }

  initFilterListeners() {
    // Subscribe para mudanças nos filtros
    this.unsubscribeFilter = filterService.subscribe(() => {
      this.applyFilters();
    });

    // Listener para quando o sidebar aplicar filtros
    this.addEventListener("filters-applied", () => {
      this.applyFilters();
    });
  }

  openFilterSidebar() {
    const sidebar = this.querySelector("filter-sidebar");
    if (sidebar) {
      sidebar.setProductCount(this.filteredProducts.length);
      sidebar.open();
    }
  }

  applyFilters() {
    // Aplica filtros e ordenação
    this.filteredProducts = filterService.applyFilters(colecaoProducts);

    // Atualiza a contagem no sidebar
    const sidebar = this.querySelector("filter-sidebar");
    if (sidebar) {
      sidebar.setProductCount(this.filteredProducts.length);
    }

    // Atualiza o contador na página
    this.updateProductCount();

    // Re-renderiza os produtos
    this.updateProductsGrid();
  }

  updateProductCount() {
    const countElement = document.querySelector(".colecao-hero-count");
    if (countElement) {
      countElement.textContent = `${this.filteredProducts.length} Artigos`;
    }

    // Atualiza também o botão de filtro
    const filterCount = filterService.getActiveFilterCount();
    const filterBtnCount = this.querySelector(".filter-trigger-count");
    if (filterBtnCount) {
      filterBtnCount.style.display = filterCount > 0 ? "inline-flex" : "none";
      filterBtnCount.textContent = filterCount;
    }
  }

  updateProductsGrid() {
    const grid = this.querySelector(".products-showcase-grid");
    if (!grid) return;

    // Limpa observadores existentes
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    this.renderedProducts.clear();

    // Re-renderiza grid
    grid.innerHTML = this.generateProducts();

    // Re-inicializa virtual scrolling
    this.initVirtualScrolling();
  }

  render() {
    const filterCount = filterService.getActiveFilterCount();
    this.innerHTML = `
      <div class="colecao-page-content">
      <section class="presente-ela-section">
        <div class="presente-ela-intro">
          <h2 class="presente-ela-section-title">Seleção Exclusiva</h2>
          <p class="presente-ela-section-description">
            Uma curadoria especial que celebra o savoir-faire da Maison Dior. Peças icônicas que combinam tradição e modernidade.
          </p>
        </div>

        <!-- Filter Button -->
        <div class="filter-bar">
          <button class="filter-trigger-btn">
            <svg width="35" height="35" viewBox="0 0 24 24" fill="none">
              <path fill="currentColor" fill-rule="evenodd" d="M8.2 6a.7.7 0 0 0-1.4 0v.3H5.497a.7.7 0 0 0 0 1.4H6.8V8a.7.7 0 1 0 1.4 0v-.3h9.297a.7.7 0 1 0 0-1.4H8.2zm-2.703 5.3a.7.7 0 0 0 0 1.4H14.8v.3a.7.7 0 1 0 1.4 0v-.3h1.297a.7.7 0 1 0 0-1.4H16.2V11a.7.7 0 1 0-1.4 0v.3zm0 5a.7.7 0 0 0 0 1.4H10.8v.3a.7.7 0 1 0 1.4 0v-.3h5.297a.7.7 0 1 0 0-1.4H12.2V16a.7.7 0 1 0-1.4 0v.3z" clip-rule="evenodd"></path>
            </svg>
            <span>Filtrar e ordenar</span>
            <span class="filter-trigger-count" style="display: ${
              filterCount > 0 ? "inline-flex" : "none"
            }">${filterCount}</span>
          </button>
        </div>

        <!-- Filter Sidebar Component -->
        <filter-sidebar></filter-sidebar>

        <!-- Drag Cards Section -->
        <div class="drag-cards-section">
          <div class="drag-cards-container">
            <div class="drag-cards-track">
              <div class="drag-card">
                <div class="drag-card-image-wrapper">
                  <img src="/images/bolsa.jpg" alt="Bolsas" class="drag-card-image" />
                  <div class="drag-card-overlay"></div>
                </div>
                <h3 class="drag-card-title">Bolsas</h3>
              </div>

              <div class="drag-card">
                <div class="drag-card-image-wrapper">
                  <img src="/images/joias.jpg" alt="Joias" class="drag-card-image" />
                  <div class="drag-card-overlay"></div>
                </div>
                <h3 class="drag-card-title">Joias</h3>
              </div>

              <div class="drag-card">
                <div class="drag-card-image-wrapper">
                  <img src="/images/couro.jpg" alt="Pequenos artigos de couro" class="drag-card-image" />
                  <div class="drag-card-overlay"></div>
                </div>
                <h3 class="drag-card-title">Pequenos artigos de couro</h3>
              </div>

              <div class="drag-card">
                <div class="drag-card-image-wrapper">
                  <img src="/images/acessorio.jpg" alt="Acessórios" class="drag-card-image" />
                  <div class="drag-card-overlay"></div>
                </div>
                <h3 class="drag-card-title">Acessórios</h3>
              </div>

              <div class="drag-card">
                <div class="drag-card-image-wrapper">
                  <img src="/images/sapatos.jpg" alt="Sapatos" class="drag-card-image" />
                  <div class="drag-card-overlay"></div>
                </div>
                <h3 class="drag-card-title">Sapatos</h3>
              </div>

              <div class="drag-card">
                <div class="drag-card-image-wrapper">
                  <img src="/images/especiais.jpg" alt="Presentes especiais" class="drag-card-image" />
                  <div class="drag-card-overlay"></div>
                </div>
                <h3 class="drag-card-title">Presentes especiais</h3>
              </div>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="drag-progress-bar">
            <div class="drag-progress-fill"></div>
          </div>
        </div>

        <!-- Products Grid Section -->
        <section class="products-showcase-section">
          <div class="products-showcase-grid">
            ${this.generateProducts()}
          </div>
        </section>
       
      </section>
      </div>
    `;
  }

  generateProducts() {
    return this.filteredProducts
      .map((product) => {
        // Se for um card destacado (highlight)
        if (product.isHighlight) {
          return this.generateHighlightCard(product);
        }

        // Card normal
        const imagesHtml = product.images
          .map(
            (img, i) =>
              `<img src="${img}" alt="${product.name} - Vista ${
                i + 1
              }" class="product-showcase-image" />`,
          )
          .join("\n                  ");

        const colorsHtml = product.colors
          .map(
            (color) =>
              `<button class="color-dot color-dot--${color.name}" data-color="${color.name}" aria-label="${color.label}"></button>`,
          )
          .join("\n                  ");

        const moreHtml = product.moreColors
          ? `<span class="color-dot-more">+${product.moreColors}</span>`
          : "";

        return `
        <article class="product-showcase-item" data-product-id="${product.id}">
          <div class="product-showcase-image-wrapper">
            <div class="product-images-track">
              ${imagesHtml}
            </div>
          </div>
          <div class="product-showcase-info">
            <h3 class="product-showcase-name">${product.name}</h3>
            <p class="product-showcase-price">${product.price}</p>
            <div class="product-showcase-colors">
              ${colorsHtml}
              ${moreHtml}
            </div>
          </div>
        </article>`;
      })
      .join("\n");
  }

  generateHighlightCard(product) {
    return `
      <article class="product-highlight-card" data-product-id="${product.id}">
        <div class="product-highlight-image-wrapper">
          <img src="${product.images[0]}" alt="${product.name}" class="product-highlight-image" />
        </div>
        <div class="product-highlight-content">
          <h3 class="product-highlight-name">${product.name}</h3>
          <p class="product-highlight-description">${product.description}</p>
          <p class="product-highlight-price">${product.price}</p>
          <button class="product-highlight-button">Descobrir</button>
        </div>
      </article>`;
  }
}

customElements.define("colecao-content", ColecaoContent);
