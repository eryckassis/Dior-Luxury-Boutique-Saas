// ============================================================================
// FILTER SIDEBAR - Componente de filtros e ordenação
// ============================================================================

import { filterService, FILTER_CONFIG } from "../services/FilterService.js";

export class FilterSidebar extends HTMLElement {
  constructor() {
    super();
    this.isOpen = false;
    this.currentPanel = "main"; // main, sort, category, line, color, material, size
    this.panelHistory = [];
    this.productCount = 0;
    this.unsubscribe = null;
  }

  connectedCallback() {
    this.render();
    this.initEventListeners();

    // Subscribe para atualizações dos filtros
    this.unsubscribe = filterService.subscribe(() => {
      this.updateUI();
    });
  }

  disconnectedCallback() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  /**
   * Define a contagem de produtos
   * @param {number} count
   */
  setProductCount(count) {
    this.productCount = count;
    this.updateProductCount();
  }

  /**
   * Abre o sidebar
   */
  open() {
    this.isOpen = true;
    this.currentPanel = "main";
    this.panelHistory = [];
    const sidebar = this.querySelector(".filter-sidebar");
    const overlay = this.querySelector(".filter-overlay");

    if (sidebar && overlay) {
      overlay.classList.add("active");
      sidebar.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  /**
   * Fecha o sidebar
   */
  close() {
    this.isOpen = false;
    const sidebar = this.querySelector(".filter-sidebar");
    const overlay = this.querySelector(".filter-overlay");

    if (sidebar && overlay) {
      sidebar.classList.remove("active");
      overlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  /**
   * Navega para um painel específico
   * @param {string} panel
   */
  navigateToPanel(panel) {
    this.panelHistory.push(this.currentPanel);
    this.currentPanel = panel;
    this.renderPanelContent();
  }

  /**
   * Volta para o painel anterior
   */
  goBack() {
    if (this.panelHistory.length > 0) {
      this.currentPanel = this.panelHistory.pop();
      this.renderPanelContent();
    }
  }

  /**
   * Atualiza a UI após mudança nos filtros
   */
  updateUI() {
    this.updateActiveIndicators();
    this.updateProductCount();
  }

  /**
   * Atualiza indicadores de filtros ativos
   */
  updateActiveIndicators() {
    const filters = filterService.getActiveFilters();

    // Atualiza indicador de ordenação
    const sortIndicator = this.querySelector('[data-panel="sort"] .filter-option-value');
    if (sortIndicator) {
      const sortOption = FILTER_CONFIG.sortOptions.find((s) => s.id === filters.sort);
      sortIndicator.textContent = sortOption ? sortOption.label : "Recomendado";
    }

    // Atualiza contadores em cada opção
    this.updateFilterCount("category", filters.categories.length);
    this.updateFilterCount("line", filters.lines.length);
    this.updateFilterCount("color", filters.colors.length);
    this.updateFilterCount("material", filters.materials.length);
    this.updateFilterCount("size", filters.sizes.length);
  }

  /**
   * Atualiza contador de um tipo de filtro
   */
  updateFilterCount(type, count) {
    const indicator = this.querySelector(`[data-panel="${type}"] .filter-count`);
    if (indicator) {
      indicator.textContent = count > 0 ? `(${count})` : "";
      indicator.style.display = count > 0 ? "inline" : "none";
    }
  }

  /**
   * Atualiza contagem de produtos
   */
  updateProductCount() {
    const countBtn = this.querySelector(".filter-view-btn");
    if (countBtn) {
      countBtn.textContent = `Ver os ${this.productCount} produto(s)`;
    }
  }

  /**
   * Renderiza o conteúdo do painel atual
   */
  renderPanelContent() {
    const contentContainer = this.querySelector(".filter-panel-content");
    if (!contentContainer) return;

    const headerTitle = this.querySelector(".filter-header-title");
    const backBtn = this.querySelector(".filter-back-btn");

    // Mostra/esconde botão voltar
    if (backBtn) {
      backBtn.style.display = this.currentPanel === "main" ? "none" : "flex";
    }

    // Atualiza título
    if (headerTitle) {
      headerTitle.textContent = this.getPanelTitle(this.currentPanel);
    }

    // Renderiza conteúdo baseado no painel
    switch (this.currentPanel) {
      case "main":
        contentContainer.innerHTML = this.renderMainPanel();
        break;
      case "sort":
        contentContainer.innerHTML = this.renderSortPanel();
        break;
      case "category":
        contentContainer.innerHTML = this.renderCategoryPanel();
        break;
      case "line":
        contentContainer.innerHTML = this.renderLinePanel();
        break;
      case "color":
        contentContainer.innerHTML = this.renderColorPanel();
        break;
      case "material":
        contentContainer.innerHTML = this.renderMaterialPanel();
        break;
      case "size":
        contentContainer.innerHTML = this.renderSizePanel();
        break;
      default:
        contentContainer.innerHTML = this.renderMainPanel();
    }

    // Re-adiciona event listeners
    this.initPanelEventListeners();
  }

  /**
   * Obtém título do painel
   */
  getPanelTitle(panel) {
    const titles = {
      main: "Filtrar e ordenar",
      sort: "Ordenar por",
      category: "Categoria",
      line: "Linha",
      color: "Cor",
      material: "Material",
      size: "Tamanho",
    };
    return titles[panel] || "Filtrar e ordenar";
  }

  /**
   * Renderiza o painel principal
   */
  renderMainPanel() {
    const filters = filterService.getActiveFilters();
    const sortOption = FILTER_CONFIG.sortOptions.find((s) => s.id === filters.sort);

    return `
      <div class="filter-options-list">
        <div class="filter-option" data-panel="sort">
          <span class="filter-option-label">Ordenar por</span>
          <div class="filter-option-right">
            <span class="filter-option-value">${
              sortOption ? sortOption.label : "Recomendado"
            }</span>
            <svg class="filter-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <div class="filter-option" data-panel="category">
          <span class="filter-option-label">Categoria <span class="filter-count" style="display:${
            filters.categories.length > 0 ? "inline" : "none"
          }">(${filters.categories.length})</span></span>
          <svg class="filter-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <div class="filter-option" data-panel="line">
          <span class="filter-option-label">Linha <span class="filter-count" style="display:${
            filters.lines.length > 0 ? "inline" : "none"
          }">(${filters.lines.length})</span></span>
          <svg class="filter-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <div class="filter-option" data-panel="color">
          <span class="filter-option-label">Cor <span class="filter-count" style="display:${
            filters.colors.length > 0 ? "inline" : "none"
          }">(${filters.colors.length})</span></span>
          <svg class="filter-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <div class="filter-option" data-panel="material">
          <span class="filter-option-label">Material <span class="filter-count" style="display:${
            filters.materials.length > 0 ? "inline" : "none"
          }">(${filters.materials.length})</span></span>
          <svg class="filter-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <div class="filter-option" data-panel="size">
          <span class="filter-option-label">Tamanho <span class="filter-count" style="display:${
            filters.sizes.length > 0 ? "inline" : "none"
          }">(${filters.sizes.length})</span></span>
          <svg class="filter-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    `;
  }

  /**
   * Renderiza painel de ordenação
   */
  renderSortPanel() {
    const currentSort = filterService.getActiveFilters().sort;

    return `
      <div class="filter-radio-list">
        ${FILTER_CONFIG.sortOptions
          .map(
            (option) => `
          <label class="filter-radio-option">
            <span class="filter-radio-label">${option.label}</span>
            <input 
              type="radio" 
              name="sort" 
              value="${option.id}" 
              ${currentSort === option.id ? "checked" : ""}
              class="filter-radio-input"
            />
            <span class="filter-radio-custom ${currentSort === option.id ? "checked" : ""}"></span>
          </label>
        `,
          )
          .join("")}
      </div>
    `;
  }

  /**
   * Renderiza painel de categorias
   */
  renderCategoryPanel() {
    const activeCategories = filterService.getActiveFilters().categories;

    return `
      <div class="filter-checkbox-list">
        ${FILTER_CONFIG.categories
          .map(
            (category) => `
          <label class="filter-checkbox-option">
            <span class="filter-checkbox-label">${category.label}</span>
            <input 
              type="checkbox" 
              value="${category.id}" 
              data-filter-type="categories"
              ${activeCategories.includes(category.id) ? "checked" : ""}
              class="filter-checkbox-input"
            />
            <span class="filter-checkbox-custom ${
              activeCategories.includes(category.id) ? "checked" : ""
            }"></span>
          </label>
        `,
          )
          .join("")}
      </div>
    `;
  }

  /**
   * Renderiza painel de linhas
   */
  renderLinePanel() {
    const activeLines = filterService.getActiveFilters().lines;

    return `
      <div class="filter-checkbox-list">
        ${FILTER_CONFIG.lines
          .map(
            (line) => `
          <label class="filter-checkbox-option">
            <span class="filter-checkbox-label">${line.label}</span>
            <input 
              type="checkbox" 
              value="${line.id}" 
              data-filter-type="lines"
              ${activeLines.includes(line.id) ? "checked" : ""}
              class="filter-checkbox-input"
            />
            <span class="filter-checkbox-custom ${
              activeLines.includes(line.id) ? "checked" : ""
            }"></span>
          </label>
        `,
          )
          .join("")}
      </div>
    `;
  }

  /**
   * Renderiza painel de cores
   */
  renderColorPanel() {
    const activeColors = filterService.getActiveFilters().colors;

    return `
      <div class="filter-color-list">
        ${FILTER_CONFIG.colors
          .map(
            (color) => `
          <label class="filter-color-option">
            <span class="filter-color-swatch" style="background: ${
              color.hex === "multicolor"
                ? "linear-gradient(135deg, #ff6b6b, #4ecdc4, #ffe66d, #95e1d3)"
                : color.hex
            }"></span>
            <span class="filter-color-label">${color.label}</span>
            <input 
              type="checkbox" 
              value="${color.id}" 
              data-filter-type="colors"
              ${activeColors.includes(color.id) ? "checked" : ""}
              class="filter-checkbox-input"
            />
            <span class="filter-checkbox-custom ${
              activeColors.includes(color.id) ? "checked" : ""
            }"></span>
          </label>
        `,
          )
          .join("")}
      </div>
    `;
  }

  /**
   * Renderiza painel de materiais
   */
  renderMaterialPanel() {
    const activeMaterials = filterService.getActiveFilters().materials;

    return `
      <div class="filter-checkbox-list">
        ${FILTER_CONFIG.materials
          .map(
            (material) => `
          <label class="filter-checkbox-option">
            <span class="filter-checkbox-label">${material.label}</span>
            <input 
              type="checkbox" 
              value="${material.id}" 
              data-filter-type="materials"
              ${activeMaterials.includes(material.id) ? "checked" : ""}
              class="filter-checkbox-input"
            />
            <span class="filter-checkbox-custom ${
              activeMaterials.includes(material.id) ? "checked" : ""
            }"></span>
          </label>
        `,
          )
          .join("")}
      </div>
    `;
  }

  /**
   * Renderiza painel de tamanhos
   */
  renderSizePanel() {
    const activeSizes = filterService.getActiveFilters().sizes;

    return `
      <div class="filter-size-groups">
        ${FILTER_CONFIG.sizeGroups
          .map(
            (group) => `
          <div class="filter-size-group">
            <button class="filter-size-group-header" data-group="${group.id}">
              <span>${group.label}</span>
              <svg class="filter-chevron-down" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div class="filter-size-group-content" data-group-content="${
              group.id
            }" style="display: none;">
              ${group.sizes
                .map(
                  (size) => `
                <label class="filter-checkbox-option">
                  <span class="filter-checkbox-label">${size}</span>
                  <input 
                    type="checkbox" 
                    value="${size}" 
                    data-filter-type="sizes"
                    ${activeSizes.includes(size) ? "checked" : ""}
                    class="filter-checkbox-input"
                  />
                  <span class="filter-checkbox-custom ${
                    activeSizes.includes(size) ? "checked" : ""
                  }"></span>
                </label>
              `,
                )
                .join("")}
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
    `;
  }

  /**
   * Event listeners do painel atual
   */
  initPanelEventListeners() {
    // Radio buttons para ordenação
    const radioInputs = this.querySelectorAll(".filter-radio-input");
    radioInputs.forEach((input) => {
      input.addEventListener("change", (e) => {
        filterService.setSort(e.target.value);
        this.renderPanelContent();
      });
    });

    // Checkboxes para filtros
    const checkboxInputs = this.querySelectorAll(".filter-checkbox-input");
    checkboxInputs.forEach((input) => {
      input.addEventListener("change", (e) => {
        const filterType = e.target.dataset.filterType;
        const value = e.target.value;
        filterService.toggleFilter(filterType, value);

        // Atualiza visual do checkbox
        const customCheckbox = e.target.nextElementSibling;
        if (customCheckbox) {
          customCheckbox.classList.toggle("checked", e.target.checked);
        }
      });
    });

    // Accordion para tamanhos
    const groupHeaders = this.querySelectorAll(".filter-size-group-header");
    groupHeaders.forEach((header) => {
      header.addEventListener("click", () => {
        const groupId = header.dataset.group;
        const content = this.querySelector(`[data-group-content="${groupId}"]`);
        const chevron = header.querySelector(".filter-chevron-down");

        if (content) {
          const isOpen = content.style.display !== "none";
          content.style.display = isOpen ? "none" : "block";
          chevron?.classList.toggle("rotated", !isOpen);
        }
      });
    });

    // Navegação para sub-painéis
    const panelOptions = this.querySelectorAll(".filter-option[data-panel]");
    panelOptions.forEach((option) => {
      option.addEventListener("click", () => {
        const panel = option.dataset.panel;
        this.navigateToPanel(panel);
      });
    });
  }

  /**
   * Inicializa event listeners principais
   */
  initEventListeners() {
    // Botão fechar
    const closeBtn = this.querySelector(".filter-close-btn");
    closeBtn?.addEventListener("click", () => this.close());

    // Overlay
    const overlay = this.querySelector(".filter-overlay");
    overlay?.addEventListener("click", () => this.close());

    // Botão voltar
    const backBtn = this.querySelector(".filter-back-btn");
    backBtn?.addEventListener("click", () => this.goBack());

    // Botão limpar filtros
    const clearBtn = this.querySelector(".filter-clear-btn");
    clearBtn?.addEventListener("click", () => {
      filterService.clearAllFilters();
      this.renderPanelContent();
    });

    // Botão ver produtos
    const viewBtn = this.querySelector(".filter-view-btn");
    viewBtn?.addEventListener("click", () => {
      this.close();
      // Dispara evento para atualizar produtos
      this.dispatchEvent(
        new CustomEvent("filters-applied", {
          bubbles: true,
          detail: filterService.getActiveFilters(),
        }),
      );
    });

    // Event listeners do painel inicial
    this.initPanelEventListeners();
  }

  render() {
    const filters = filterService.getActiveFilters();
    const sortOption = FILTER_CONFIG.sortOptions.find((s) => s.id === filters.sort);

    this.innerHTML = `
      <!-- Overlay -->
      <div class="filter-overlay"></div>

      <!-- Sidebar -->
      <aside class="filter-sidebar">
        <!-- Header -->
        <header class="filter-header">
          <button class="filter-back-btn" style="display: none;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <h2 class="filter-header-title">Filtrar e ordenar</h2>
          <button class="filter-close-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </header>

        <!-- Content -->
        <div class="filter-panel-content">
          ${this.renderMainPanel()}
        </div>

        <!-- Footer -->
        <footer class="filter-footer">
          <button class="filter-clear-btn">apagar todos os filtros</button>
          <button class="filter-view-btn">Ver os ${this.productCount} produto(s)</button>
        </footer>
      </aside>
    `;
  }
}

customElements.define("filter-sidebar", FilterSidebar);
