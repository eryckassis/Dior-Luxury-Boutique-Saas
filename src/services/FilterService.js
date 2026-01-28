export const FILTER_CONFIG = {
  sortOptions: [
    { id: "recommended", label: "Recomendado", default: true },
    { id: "newest", label: "Novidade" },
    { id: "price_asc", label: "Menor preço" },
    { id: "price_desc", label: "Maior preço" },
  ],

  categories: [
    { id: "bolsa", label: "Bolsas" },
    { id: "bolsa_cabas", label: "Bolsas Cabas" },
    { id: "blazer", label: "Blazers" },
    { id: "vestido", label: "Vestidos" },
    { id: "casaco", label: "Casacos" },
    { id: "camisa", label: "Camisas" },
    { id: "calca", label: "Calças" },
    { id: "saia", label: "Saias" },
    { id: "sapato", label: "Sapatos" },
    { id: "oculos", label: "Óculos" },
    { id: "joias", label: "Joias" },
    { id: "relojoaria", label: "Relógios" },
    { id: "brincos", label: "Brincos" },
    { id: "colares", label: "Colares" },
    { id: "aneis", label: "Anéis" },
    { id: "lencos", label: "Lenços" },
  ],

  lines: [
    { id: "dior_book_tote", label: "Dior Book Tote" },
    { id: "dior_bow", label: "Dior Bow" },
    { id: "dior_trianon", label: "Dior Trianon" },
    { id: "dior_tribales", label: "Dior Tribales" },
    { id: "jadior", label: "J'Adior" },
    { id: "lady_djoy", label: "Lady D-Joy" },
    { id: "lady_dior", label: "Lady Dior" },
    { id: "lucky_dior", label: "Lucky Dior" },
    { id: "my_dior", label: "My Dior" },
    { id: "oblique_bow", label: "Oblique Bow" },
    { id: "saddle", label: "Saddle" },
    { id: "rose_des_vents", label: "Rose des Vents" },
    { id: "dior_mariniere", label: "Dior Marinière" },
  ],

  colors: [
    { id: "amarelo", label: "Amarelo", hex: "#E5C946" },
    { id: "azul", label: "Azul", hex: "#4A7BB5" },
    { id: "bege", label: "Bege", hex: "#D4C5A9" },
    { id: "branco", label: "Branco", hex: "#F8F8F8" },
    { id: "cinza", label: "Cinza", hex: "#B5B5B5" },
    { id: "dourado", label: "Dourado", hex: "#D4AF37" },
    { id: "marrom", label: "Marrom", hex: "#8B5A2B" },
    { id: "multicolorido", label: "Multicolorido", hex: "multicolor" },
    { id: "preto", label: "Preto", hex: "#1A1A1A" },
    { id: "rosa", label: "Rosa", hex: "#F5C6D6" },
    { id: "vermelho", label: "Vermelho", hex: "#C41E3A" },
    { id: "verde", label: "Verde", hex: "#4A7C59" },
    { id: "nude", label: "Nude", hex: "#E8D5C4" },
    { id: "prata", label: "Prata", hex: "#C0C0C0" },
  ],

  materials: [
    { id: "acetato", label: "Acetato" },
    { id: "algodao", label: "Algodão" },
    { id: "caxemira", label: "Caxemira" },
    { id: "couro", label: "Couro" },
    { id: "couro_bordado", label: "Couro bordado" },
    { id: "couro_estampa", label: "Couro com estampa" },
    { id: "couro_envernizado", label: "Couro envernizado" },
    { id: "la", label: "Lã" },
    { id: "latao", label: "Latão" },
    { id: "resina", label: "Resina" },
    { id: "seda", label: "Seda" },
    { id: "tecido_tecnico", label: "Tecido técnico" },
    { id: "ouro", label: "Ouro" },
    { id: "aco", label: "Aço inoxidável" },
    { id: "renda", label: "Renda" },
  ],

  sizeGroups: [
    {
      id: "roupa_superior",
      label: "Tamanho da parte superior",
      sizes: ["34", "36", "38", "40", "42", "44", "46"],
    },
    {
      id: "joia",
      label: "Tamanho da joia",
      sizes: ["Único", "P", "M", "G"],
    },
    {
      id: "calcado",
      label: "Tamanho do calçado",
      sizes: ["35", "36", "37", "38", "39", "40", "41", "42"],
    },
    {
      id: "saia",
      label: "Tamanho da saia",
      sizes: ["34", "36", "38", "40", "42"],
    },
    {
      id: "calca",
      label: "Calças e shorts",
      sizes: ["34", "36", "38", "40", "42", "44"],
    },
    {
      id: "casaco",
      label: "Jaquetas / Casacos",
      sizes: ["34", "36", "38", "40", "42", "44", "46"],
    },
  ],
};

export class FilterService {
  constructor() {
    this.activeFilters = {
      sort: "recommended",
      categories: [],
      lines: [],
      colors: [],
      materials: [],
      sizes: [],
    };
    this.listeners = new Set();
  }

  subscribe(callback) {
    if (typeof callback !== "function") {
      console.error("[FilterService] Subscribe requer uma função callback");
      return;
    }
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners() {
    this.listeners.forEach((callback) => {
      try {
        callback(this.getActiveFilters());
      } catch (error) {
        console.error("[FilterService] Erro no listener:", error);
      }
    });
  }

  validateFilter(filterType, value) {
    if (!filterType || !value) return false;

    const config = FILTER_CONFIG[filterType];
    if (!config) {
      console.warn(`[FilterService] Tipo de filtro inválido: ${filterType}`);
      return false;
    }

    if (filterType === "sizes") {
      const allSizes = FILTER_CONFIG.sizeGroups.flatMap((g) => g.sizes);
      return allSizes.includes(value);
    }

    return config.some((item) => item.id === value);
  }

  setSort(sortId) {
    const validSort = FILTER_CONFIG.sortOptions.find((s) => s.id === sortId);
    if (!validSort) {
      console.warn(`[FilterService] Ordenação inválida: ${sortId}`);
      return false;
    }
    this.activeFilters.sort = sortId;
    this.notifyListeners();
    return true;
  }

  toggleFilter(filterType, value) {
    if (!this.activeFilters.hasOwnProperty(filterType)) {
      console.warn(`[FilterService] Tipo de filtro inexistente: ${filterType}`);
      return false;
    }

    if (filterType === "sort") {
      return this.setSort(value);
    }

    if (!this.validateFilter(filterType, value)) {
      console.warn(`[FilterService] Valor inválido para ${filterType}: ${value}`);
      return false;
    }

    const filterArray = this.activeFilters[filterType];
    const index = filterArray.indexOf(value);

    if (index === -1) {
      filterArray.push(value);
    } else {
      filterArray.splice(index, 1);
    }

    this.notifyListeners();
    return true;
  }

  isFilterActive(filterType, value) {
    if (filterType === "sort") {
      return this.activeFilters.sort === value;
    }
    return this.activeFilters[filterType]?.includes(value) || false;
  }

  clearAllFilters() {
    this.activeFilters = {
      sort: "recommended",
      categories: [],
      lines: [],
      colors: [],
      materials: [],
      sizes: [],
    };
    this.notifyListeners();
  }

  clearFilterType(filterType) {
    if (filterType === "sort") {
      this.activeFilters.sort = "recommended";
    } else if (this.activeFilters.hasOwnProperty(filterType)) {
      this.activeFilters[filterType] = [];
    }
    this.notifyListeners();
  }

  getActiveFilters() {
    return { ...this.activeFilters };
  }

  getActiveFilterCount() {
    return (
      this.activeFilters.categories.length +
      this.activeFilters.lines.length +
      this.activeFilters.colors.length +
      this.activeFilters.materials.length +
      this.activeFilters.sizes.length
    );
  }

  parsePrice(priceStr) {
    if (!priceStr || typeof priceStr !== "string") return 0;

    const cleaned = priceStr
      .replace(/R\$\s*/gi, "")
      .replace(/A partir de\s*/gi, "")
      .replace(/\./g, "")
      .replace(",", ".")
      .trim();

    const price = parseFloat(cleaned);
    return isNaN(price) ? 0 : price;
  }

  normalizeString(str) {
    if (!str) return "";
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");
  }

  productHasColor(product, colorId) {
    if (!product.colors || !Array.isArray(product.colors)) return false;

    const normalizedColorId = this.normalizeString(colorId);

    return product.colors.some((color) => {
      const normalizedLabel = this.normalizeString(color.label);
      const normalizedName = this.normalizeString(color.name);
      return normalizedLabel === normalizedColorId || normalizedName === normalizedColorId;
    });
  }

  productHasMaterial(product, materialId) {
    if (!product.material) return false;

    const normalizedMaterial = this.normalizeString(product.material);
    const normalizedMaterialId = this.normalizeString(materialId);

    return normalizedMaterial.includes(normalizedMaterialId);
  }

  productHasSize(product, size) {
    if (!product.sizes || !Array.isArray(product.sizes)) return false;
    return product.sizes.includes(size);
  }

  productHasLine(product, lineId) {
    const searchFields = [
      product.name || "",
      product.description || "",
      product.reference || "",
      product.line || "",
    ].join(" ");

    const lineConfig = FILTER_CONFIG.lines.find((l) => l.id === lineId);
    if (!lineConfig) return false;

    const normalizedSearch = this.normalizeString(searchFields);
    const normalizedLine = this.normalizeString(lineConfig.label);

    return normalizedSearch.includes(normalizedLine);
  }

  applyFilters(products) {
    if (!Array.isArray(products)) {
      console.error("[FilterService] applyFilters requer um array de produtos");
      return [];
    }

    let filtered = [...products];
    const filters = this.activeFilters;

    if (filters.categories.length > 0) {
      filtered = filtered.filter((product) => {
        const normalizedCategory = this.normalizeString(product.category);
        return filters.categories.some((cat) => this.normalizeString(cat) === normalizedCategory);
      });
    }

    if (filters.lines.length > 0) {
      filtered = filtered.filter((product) =>
        filters.lines.some((line) => this.productHasLine(product, line)),
      );
    }

    if (filters.colors.length > 0) {
      filtered = filtered.filter((product) =>
        filters.colors.some((color) => this.productHasColor(product, color)),
      );
    }

    if (filters.materials.length > 0) {
      filtered = filtered.filter((product) =>
        filters.materials.some((material) => this.productHasMaterial(product, material)),
      );
    }

    if (filters.sizes.length > 0) {
      filtered = filtered.filter((product) =>
        filters.sizes.some((size) => this.productHasSize(product, size)),
      );
    }

    filtered = this.sortProducts(filtered, filters.sort);

    return filtered;
  }

  sortProducts(products, sortType) {
    const sorted = [...products];

    switch (sortType) {
      case "price_asc":
        sorted.sort((a, b) => this.parsePrice(a.price) - this.parsePrice(b.price));
        break;

      case "price_desc":
        sorted.sort((a, b) => this.parsePrice(b.price) - this.parsePrice(a.price));
        break;

      case "newest":
        sorted.reverse();
        break;

      case "recommended":
      default:
        break;
    }

    return sorted;
  }

  extractUniqueValues(products, field) {
    const values = new Set();

    products.forEach((product) => {
      if (field === "colors" && Array.isArray(product.colors)) {
        product.colors.forEach((color) => {
          if (color.label) values.add(color.label);
        });
      } else if (field === "sizes" && Array.isArray(product.sizes)) {
        product.sizes.forEach((size) => values.add(size));
      } else if (product[field]) {
        values.add(product[field]);
      }
    });

    return Array.from(values).sort();
  }
}

export const filterService = new FilterService();
