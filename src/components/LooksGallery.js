// ============================================================================
// LOOKS GALLERY COMPONENT - Galeria de looks do desfile
// ============================================================================

export class LooksGallery extends HTMLElement {
  constructor() {
    super();
    this._looks = [];
    this._title = "Looks";
    this._viewMode = "grid4"; // grid4 = 4 por linha (grid), drag = modo arrastar
    this.draggableInstance = null;
  }

  static get observedAttributes() {
    return ["title", "view-mode"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "title") this._title = newValue;
    if (name === "view-mode") this._viewMode = newValue;
    if (this.isConnected) this.render();
  }

  set looks(data) {
    this._looks = data;
    if (this.isConnected) {
      this.render();
      this.initHoverEffects();
    }
  }

  get looks() {
    return this._looks;
  }

  connectedCallback() {
    this.render();
    this.initHoverEffects();
  }

  disconnectedCallback() {
    // Cleanup draggable
    if (this.draggableInstance) {
      this.draggableInstance.kill();
      this.draggableInstance = null;
    }
  }

  initDraggableCards() {
    if (!window.gsap || !window.Draggable) {
      console.error("❌ GSAP ou Draggable não encontrado!");
      return;
    }

    const container = this.querySelector(".looks-drag-container");
    const track = this.querySelector(".looks-drag-track");
    const cards = this.querySelectorAll(".looks-drag-card");
    const progressBar = this.querySelector(".looks-progress-bar");
    const progressFill = this.querySelector(".looks-progress-fill");

    if (!container || !track || cards.length === 0) {
      console.error("❌ Elementos drag não encontrados!");
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

      // Largura real do conteúdo
      const contentWidth = lastCard.right - firstCard.left + paddingLeft + paddingRight;

      // MaxDrag: quanto precisa mover para ver o último card completamente
      const maxDrag = Math.min(0, -(contentWidth - containerWidth));

      console.log("📏 Looks Bounds:", {
        containerWidth,
        contentWidth,
        maxDrag,
      });

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
      onDragEnd: function () {
        console.log("🎯 Drag finalizado:", this.x);
      },
      onThrowUpdate: function () {
        updateProgress(this.x);
      },
    })[0];

    // Recalcular bounds no resize
    const handleResize = () => {
      bounds = calculateBounds();
      if (this.draggableInstance) {
        this.draggableInstance.applyBounds(bounds);
      }
    };
    window.addEventListener("resize", handleResize);

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

    console.log("✅ Looks Drag inicializado! Bounds:", bounds);
  }

  initHoverEffects() {
    requestAnimationFrame(() => {
      if (!window.gsap) return;

      const cards = this.querySelectorAll(".look-card, .looks-drag-card");

      cards.forEach((card) => {
        const image = card.querySelector(".look-card-image, .looks-drag-card-image");

        if (!image) return;

        card.addEventListener("mouseenter", () => {
          window.gsap.to(image, {
            scale: 1.05,
            duration: 0.4,
            ease: "power2.out",
          });
        });

        card.addEventListener("mouseleave", () => {
          window.gsap.to(image, {
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
          });
        });
      });
    });
  }

  renderGridCards() {
    return this._looks
      .map(
        (look) => `
        <a href="#look-${look.id}" class="look-card" data-look-id="${look.id}">
          <div class="look-card-image-wrapper">
            <img 
              src="${look.image}" 
              alt="Look ${look.number}" 
              class="look-card-image"
              loading="lazy"
            />
          </div>
        </a>
      `,
      )
      .join("");
  }

  renderDragCards() {
    return this._looks
      .map(
        (look) => `
        <div class="looks-drag-card" data-look-id="${look.id}">
          <div class="looks-drag-card-image-wrapper">
            <img 
              src="${look.image}" 
              alt="Look ${look.number}" 
              class="looks-drag-card-image"
              loading="lazy"
            />
            <div class="looks-drag-card-overlay"></div>
          </div>
          <span class="looks-drag-card-number">Look ${look.number}</span>
        </div>
      `,
      )
      .join("");
  }

  render() {
    const isGrid = this._viewMode === "grid4";

    this.innerHTML = `
      <section class="looks-gallery-section">
        <div class="looks-gallery-header">
          <h2 class="looks-gallery-title">${this._title}</h2>
          <div class="looks-view-toggle">
            <button class="view-toggle-btn ${!isGrid ? "active" : ""}" data-view="drag" aria-label="Drag mode">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <line x1="4" y1="6" x2="20" y2="6"></line>
                <line x1="4" y1="12" x2="20" y2="12"></line>
                <line x1="4" y1="18" x2="20" y2="18"></line>
              </svg>
            </button>
            <button class="view-toggle-btn ${isGrid ? "active" : ""}" data-view="grid4" aria-label="4 columns grid">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Grid Mode -->
        <div class="looks-grid-container" style="display: ${isGrid ? "block" : "none"}">
          <div class="looks-grid grid-4">
            ${this.renderGridCards()}
          </div>
        </div>

        <!-- Drag Mode -->
        <div class="looks-drag-section" style="display: ${!isGrid ? "block" : "none"}">
          <div class="looks-drag-container">
            <div class="looks-drag-track">
              ${this.renderDragCards()}
            </div>
          </div>
          <div class="looks-progress-bar">
            <div class="looks-progress-fill"></div>
          </div>
        </div>
      </section>
    `;

    // Inicializar eventos dos botões de toggle
    this.setupToggleButtons();

    // Se iniciar em drag mode, inicializa o draggable
    if (!isGrid) {
      setTimeout(() => this.initDraggableCards(), 300);
    }
  }

  setupToggleButtons() {
    const btnDrag = this.querySelector("[data-view='drag']");
    const btnGrid4 = this.querySelector("[data-view='grid4']");
    const gridContainer = this.querySelector(".looks-grid-container");
    const dragSection = this.querySelector(".looks-drag-section");

    if (!btnDrag || !btnGrid4 || !gridContainer || !dragSection) {
      console.error("❌ Botões de toggle não encontrados");
      return;
    }

    // Botão esquerdo - Modo Drag
    btnDrag.addEventListener("click", () => {
      console.log("🔄 Mudando para modo Drag");
      this._viewMode = "drag";
      gridContainer.style.display = "none";
      dragSection.style.display = "block";
      btnDrag.classList.add("active");
      btnGrid4.classList.remove("active");

      // Inicializa o drag após mostrar
      setTimeout(() => this.initDraggableCards(), 100);
    });

    // Botão direito - Modo Grid 4 colunas
    btnGrid4.addEventListener("click", () => {
      console.log("🔄 Mudando para modo Grid");
      this._viewMode = "grid4";
      gridContainer.style.display = "block";
      dragSection.style.display = "none";
      btnGrid4.classList.add("active");
      btnDrag.classList.remove("active");

      // Cleanup draggable
      if (this.draggableInstance) {
        this.draggableInstance.kill();
        this.draggableInstance = null;
      }
    });
  }
}

customElements.define("looks-gallery", LooksGallery);
