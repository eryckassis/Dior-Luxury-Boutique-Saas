// ============================================================================
// PRESENTE PARA ELA CONTENT - Componente de conteúdo da página
// ============================================================================

import { products } from "../data/products.js";
import { router } from "../router/router.js";

export class PresenteParaElaContent extends HTMLElement {
  constructor() {
    super();
    this.draggableInstance = null;
    this.productCarousels = [];
  }

  connectedCallback() {
    this.render();
    this.initAnimations();
    this.initDraggableCards();
    this.initProductCarousels();
    this.initProductNavigation();
  }

  disconnectedCallback() {
    // Cleanup draggable
    if (this.draggableInstance) {
      this.draggableInstance.kill();
    }

    // Cleanup product carousels
    if (this.productCarousels) {
      this.productCarousels.forEach((carousel) => carousel.kill());
    }

    if (this.animations) {
      this.animations.forEach((anim) => anim.kill());
    }
  }

  initDraggableCards() {
    setTimeout(() => {
      if (!window.gsap || !window.Draggable) {
        console.error("❌ GSAP ou Draggable não encontrado!");
        return;
      }

      const container = this.querySelector(".drag-cards-container");
      const track = this.querySelector(".drag-cards-track");
      const cards = this.querySelectorAll(".drag-card");
      const progressBar = this.querySelector(".drag-progress-bar");
      const progressFill = this.querySelector(".drag-progress-fill");

      if (!container || !track || cards.length === 0) {
        console.error("❌ Elementos não encontrados!");
        return;
      }

      // Função para calcular bounds corretamente
      const calculateBounds = () => {
        const containerWidth = container.offsetWidth;
        // Usar getBoundingClientRect para pegar a largura REAL do track
        const trackRect = track.getBoundingClientRect();
        const firstCard = cards[0].getBoundingClientRect();
        const lastCard = cards[cards.length - 1].getBoundingClientRect();

        // Calcular largura total: do início do primeiro card ao fim do último + padding
        const trackStyles = getComputedStyle(track);
        const paddingLeft = parseFloat(trackStyles.paddingLeft) || 0;
        const paddingRight = parseFloat(trackStyles.paddingRight) || 0;

        // Largura real do conteúdo
        const contentWidth = lastCard.right - firstCard.left + paddingLeft + paddingRight;

        // MaxDrag: quanto precisa mover para ver o último card completamente
        const maxDrag = Math.min(0, -(contentWidth - containerWidth));

        console.log("📏 Bounds calculados:", {
          containerWidth,
          contentWidth,
          maxDrag,
          paddingLeft,
          paddingRight,
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
          console.log("🎯 Drag finalizado em:", this.x, "/ minX:", bounds.minX);
        },
        onThrowUpdate: function () {
          updateProgress(this.x);
        },
      })[0];

      // Recalcular bounds no resize
      window.addEventListener("resize", () => {
        bounds = calculateBounds();
        if (this.draggableInstance) {
          this.draggableInstance.applyBounds(bounds);
        }
      });

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
        console.warn("GSAP ou Draggable não disponível para carrosséis");
        return;
      }

      const productItems = this.querySelectorAll(".product-showcase-item");

      productItems.forEach((item, index) => {
        const wrapper = item.querySelector(".product-showcase-image-wrapper");
        const track = item.querySelector(".product-images-track");
        const images = track?.querySelectorAll(".product-showcase-image");

        if (!wrapper || !track || !images || images.length <= 1) {
          return; // Skip se só tem 1 imagem
        }

        const imageCount = images.length;

        // Criar setas dinamicamente (após o track para ficarem acima)
        const createArrows = () => {
          // Seta esquerda
          const leftArrow = document.createElement("button");
          leftArrow.className = "product-arrow product-arrow--left";
          leftArrow.setAttribute("aria-label", "Anterior");
          leftArrow.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 19L8 12L15 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>`;

          // Seta direita
          const rightArrow = document.createElement("button");
          rightArrow.className = "product-arrow product-arrow--right";
          rightArrow.setAttribute("aria-label", "Próximo");
          rightArrow.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 5L16 12L9 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>`;

          // Adicionar ao wrapper (depois do track)
          wrapper.appendChild(leftArrow);
          wrapper.appendChild(rightArrow);

          return { leftArrow, rightArrow };
        };

        const { leftArrow, rightArrow } = createArrows();

        // Função para configurar dimensões do track e imagens
        const setupDimensions = () => {
          const wrapperWidth = wrapper.offsetWidth;
          const wrapperHeight = wrapper.offsetHeight;

          // Definir largura do track = número de imagens × largura do wrapper
          track.style.width = `${imageCount * wrapperWidth}px`;
          track.style.height = `${wrapperHeight}px`;

          // Definir largura de cada imagem = largura do wrapper
          images.forEach((img) => {
            img.style.width = `${wrapperWidth}px`;
            img.style.height = `${wrapperHeight}px`;
          });

          console.log(
            `📐 Dimensões card ${index + 1}: ${wrapperWidth}x${wrapperHeight}, Track: ${
              imageCount * wrapperWidth
            }px`,
          );
        };

        // Configurar dimensões iniciais
        setupDimensions();

        // Calcular largura de cada slide (100% do wrapper)
        const getSlideWidth = () => wrapper.offsetWidth;

        // Calcular maxDrag
        const getMaxDrag = () => -(imageCount - 1) * getSlideWidth();

        // Criar barra de progresso
        const createProgressBar = () => {
          if (imageCount <= 1) return null;

          let progressContainer = item.querySelector(".product-progress-bar");
          if (!progressContainer) {
            progressContainer = document.createElement("div");
            progressContainer.className = "product-progress-bar";

            const progressFill = document.createElement("div");
            progressFill.className = "product-progress-fill";
            progressContainer.appendChild(progressFill);

            // Inserir após o wrapper
            wrapper.parentNode.insertBefore(progressContainer, wrapper.nextSibling);
          }
          return progressContainer.querySelector(".product-progress-fill");
        };

        const progressFill = createProgressBar();

        // Atualizar barra de progresso
        const updateProgress = () => {
          if (!progressFill || imageCount <= 1) return;
          const currentX = window.gsap.getProperty(track, "x") || 0;
          const maxDrag = Math.abs(getMaxDrag());
          if (maxDrag === 0) return;

          const progress = Math.abs(currentX) / maxDrag;
          const clampedProgress = Math.min(Math.max(progress, 0), 1);

          window.gsap.set(progressFill, {
            scaleX: Math.max(clampedProgress, 0.1),
          });
        };

        // Navegação por setas
        const navigateByArrow = (direction) => {
          const slideWidth = getSlideWidth();
          const currentX = window.gsap.getProperty(track, "x") || 0;
          const currentSlide = Math.round(Math.abs(currentX) / slideWidth);
          const targetSlide = Math.max(0, Math.min(currentSlide + direction, imageCount - 1));
          const targetX = -targetSlide * slideWidth;

          window.gsap.to(track, {
            x: targetX,
            duration: 0.4,
            ease: "power2.out",
            onUpdate: updateProgress,
          });
        };

        // Eventos das setas
        leftArrow.addEventListener("click", (e) => {
          e.stopPropagation();
          navigateByArrow(-1);
        });

        rightArrow.addEventListener("click", (e) => {
          e.stopPropagation();
          navigateByArrow(1);
        });

        // Criar Draggable para o track
        const draggable = window.Draggable.create(track, {
          type: "x",
          bounds: {
            minX: getMaxDrag(),
            maxX: 0,
          },
          inertia: true,
          edgeResistance: 0.5,
          throwResistance: 1500,
          allowNativeTouchScrolling: false,
          onPress: function () {
            // Parar qualquer animação em andamento
            window.gsap.killTweensOf(track);
          },
          onDrag: function () {
            updateProgress();
          },
          onThrowUpdate: function () {
            updateProgress();
          },
          onThrowComplete: function () {
            updateProgress();
          },
        })[0];

        this.productCarousels.push(draggable);

        // Recalcular bounds e dimensões no resize
        const handleResize = () => {
          setupDimensions();
          draggable.applyBounds({
            minX: getMaxDrag(),
            maxX: 0,
          });
        };

        window.addEventListener("resize", handleResize);

        // Recalcular quando imagens carregarem
        images.forEach((img) => {
          if (!img.complete) {
            img.addEventListener("load", () => {
              setupDimensions();
              draggable.applyBounds({
                minX: getMaxDrag(),
                maxX: 0,
              });
            });
          }
        });

        // Inicializar progresso
        updateProgress();

        console.log(`✅ Carrossel ${index + 1} inicializado com ${imageCount} imagens`);
      });

      console.log("✅ Product carousels inicializados!");
    }, 500);
  }

  // ============================================================================
  // Navegação para página de detalhe do produto
  // ============================================================================
  initProductNavigation() {
    setTimeout(() => {
      const productItems = this.querySelectorAll(".product-showcase-item");

      productItems.forEach((item) => {
        const productId = item.getAttribute("data-product-id");
        if (!productId) return;

        // Variáveis para detectar drag vs click
        let startX = 0;
        let startY = 0;
        let isDragging = false;

        // Ao pressionar, guardar posição inicial
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

        // Durante movimento, detectar se é drag
        item.addEventListener("mousemove", (e) => {
          const deltaX = Math.abs(e.clientX - startX);
          const deltaY = Math.abs(e.clientY - startY);
          if (deltaX > 10 || deltaY > 10) {
            isDragging = true;
          }
        });

        item.addEventListener("touchmove", (e) => {
          const deltaX = Math.abs(e.touches[0].clientX - startX);
          const deltaY = Math.abs(e.touches[0].clientY - startY);
          if (deltaX > 10 || deltaY > 10) {
            isDragging = true;
          }
        });

        // No click, navegar apenas se não foi drag
        item.addEventListener("click", (e) => {
          // Ignorar cliques nas setas e bolinhas de cor
          if (
            e.target.closest(".product-arrow") ||
            e.target.closest(".color-dot") ||
            e.target.closest(".color-dot-more")
          ) {
            return;
          }

          // Se foi drag, não navegar
          if (isDragging) {
            isDragging = false;
            return;
          }

          // Navegar para página de detalhe
          router.navigate(`/produto/${productId}`);
        });

        // Cursor pointer para indicar clicável
        item.style.cursor = "pointer";
      });

      console.log("✅ Navegação de produtos inicializada!");
    }, 600);
  }

  initAnimations() {
    requestAnimationFrame(() => {
      if (!window.gsap || !window.ScrollTrigger) return;

      this.animations = [];

      // Products grid animation
      const products = this.querySelectorAll(".presente-ela-product");

      products.forEach((product, index) => {
        const anim = window.gsap.from(product, {
          scrollTrigger: {
            trigger: product,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          y: 60,
          opacity: 0,
          duration: 0.8,
          delay: index * 0.1,
          ease: "power3.out",
        });

        this.animations.push(anim);
      });
    });
  }

  render() {
    this.innerHTML = `
      <section class="presente-ela-section">
        <div class="presente-ela-intro">
          <h2 class="presente-ela-section-title">Seleção Exclusiva</h2>
          <p class="presente-ela-section-description">
            Uma curadoria especial de fragrâncias, maquiagem e acessórios que celebram a feminilidade
          </p>
        </div>

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
    `;
  }

  // Gerar produtos a partir dos dados centralizados
  generateProducts() {
    // Usa os dados importados do arquivo /data/products.js
    // Gerar HTML a partir dos dados
    return products
      .map((product, index) => {
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
            <!-- ${product.id} -->
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
}

customElements.define("presente-para-ela-content", PresenteParaElaContent);
