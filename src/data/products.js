// ============================================================================
// CATEGORIAS E CONFIGURAÇÕES
// ============================================================================

/**
 * Categorias de produtos e suas configurações de exibição
 * @type {Object}
 */
export const PRODUCT_CATEGORIES = {
  // Roupas - Mostram cores E tamanhos
  BLAZER: {
    key: 'blazer',
    label: 'Blazers',
    showColors: true,
    showSizes: true,
    sizeType: 'alpha', // 34, 36, 38, 40...
    description: 'Peças de alfaiataria que requerem tamanho específico'
  },
  VESTIDO: {
    key: 'vestido',
    label: 'Vestidos',
    showColors: true,
    showSizes: true,
    sizeType: 'alpha',
    description: 'Vestidos que requerem tamanho específico'
  },
  CASACO: {
    key: 'casaco',
    label: 'Casacos',
    showColors: true,
    showSizes: true,
    sizeType: 'alpha',
    description: 'Casacos e jaquetas que requerem tamanho específico'
  },
  CAMISA: {
    key: 'camisa',
    label: 'Camisas',
    showColors: true,
    showSizes: true,
    sizeType: 'alpha',
    description: 'Camisas que requerem tamanho específico'
  },
  CALCA: {
    key: 'calca',
    label: 'Calças',
    showColors: true,
    showSizes: true,
    sizeType: 'alpha',
    description: 'Calças que requerem tamanho específico'
  },
  SAIA: {
    key: 'saia',
    label: 'Saias',
    showColors: true,
    showSizes: true,
    sizeType: 'alpha',
    description: 'Saias que requerem tamanho específico'
  },
  
  // Sapatos - Mostram cores E tamanhos numéricos
  SAPATO: {
    key: 'sapato',
    label: 'Sapatos',
    showColors: true,
    showSizes: true,
    sizeType: 'numeric', // 35, 36, 37...
    description: 'Calçados que requerem tamanho específico'
  },
  
  // Acessórios - Apenas cores, SEM tamanhos
  BOLSA: {
    key: 'bolsa',
    label: 'Bolsas',
    showColors: true,
    showSizes: false,
    sizeType: 'none',
    description: 'Bolsas disponíveis em cores, tamanho único'
  },
  OCULOS: {
    key: 'oculos',
    label: 'Óculos',
    showColors: true,
    showSizes: false,
    sizeType: 'none',
    description: 'Óculos disponíveis em cores, tamanho único'
  },
  JOIAS: {
    key: 'joias',
    label: 'Joias',
    showColors: true,
    showSizes: false,
    sizeType: 'none',
    description: 'Joias disponíveis em diferentes acabamentos'
  },
  RELOJOARIA: {
    key: 'relojoaria',
    label: 'Relógios',
    showColors: true,
    showSizes: false,
    sizeType: 'none',
    description: 'Relógios de pulso, tamanho ajustável'
  },
  FRAGRANCIA: {
    key: 'fragrancia',
    label: 'Fragrâncias',
    showColors: false,
    showSizes: false,
    sizeType: 'none',
    description: 'Perfumes e fragrâncias'
  }
};

/**
 * Obtém configuração de uma categoria
 * @param {string} categoryKey - Chave da categoria (ex: 'bolsa', 'sapato')
 * @returns {Object|null} Configuração da categoria ou null
 */
export function getCategoryConfig(categoryKey) {
  const normalizedKey = categoryKey?.toLowerCase();
  return Object.values(PRODUCT_CATEGORIES).find(cat => cat.key === normalizedKey) || null;
}

/**
 * Valida se uma categoria existe
 * @param {string} categoryKey - Chave da categoria
 * @returns {boolean}
 */
export function isValidCategory(categoryKey) {
  return getCategoryConfig(categoryKey) !== null;
}

/**
 * Obtém lista de categorias válidas
 * @returns {Array<string>}
 */
export function getValidCategories() {
  return Object.values(PRODUCT_CATEGORIES).map(cat => cat.key);
}

/**
 * Atualiza a categoria de um produto
 * @param {string} productId - ID do produto
 * @param {string} newCategory - Nova categoria
 * @returns {Object} Resultado da operação
 */
export function updateProductCategory(productId, newCategory) {
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return {
      success: false,
      error: `Produto com ID '${productId}' não encontrado`
    };
  }
  
  if (!isValidCategory(newCategory)) {
    return {
      success: false,
      error: `Categoria '${newCategory}' inválida. Categorias válidas: ${getValidCategories().join(', ')}`
    };
  }
  
  const oldCategory = product.category;
  product.category = newCategory;
  
  const categoryConfig = getCategoryConfig(newCategory);
  
  // Ajusta sizes baseado na nova categoria
  if (!categoryConfig.showSizes) {
    product.sizes = ['Único'];
  }
  
  return {
    success: true,
    message: `Categoria do produto '${product.name}' alterada de '${oldCategory}' para '${newCategory}'`,
    product,
    categoryConfig
  };
}

// ============================================================================
// PRODUTOS
// ============================================================================

export const products = [
  {
    id: "blazer-1",
    name: "Blazer Bar 30 Montaigne",
    price: "R$ 33.000,00",
    description: "Lã e seda brancas com abotoamento simples",
    fullDescription:
      "Este blazer Bar 30 Montaigne é uma peça emblemática da coleção New Look, criada por Christian Dior em 1947. Confeccionado em mescla de lã e seda leve branca, ele tem gola notched e bolsos que realçam discretamente a cintura. O blazer Bar combina com todo o guarda-roupa Dior, criando uma silhueta elegante e refinada.",
    reference: "841V01AT060_X0200",
    category: "blazer",
    images: [
      "/images/blaze1.webp",
      "/images/blaze2.webp",
      "/images/blaze4.webp",
      "/images/blaze3.webp",
    ],
    colors: [
      { name: "black", label: "Preto", image: "/images/logoPreto.webp" },
      { name: "beige", label: "Bege", image: "/images/logo.webp" },
    ],
    sizes: ["34", "36", "38", "40", "42", "44"],
    material: "70% Lã, 30% Seda",
    care: "Lavagem a seco",
  },
  {
    id: "sapato-1",
    name: "Scarpin slingback J'Adior",
    price: "R$ 8.300,00",
    description: "Couro de bezerro técnico preto",
    fullDescription:
      "O icônico scarpin slingback J'Adior apresenta uma silhueta elegante e atemporal. Confeccionado em couro de bezerro técnico preto, possui a assinatura J'ADIOR na tira do calcanhar. O salto kitten de 6,5 cm oferece conforto e sofisticação para uso diário.",
    reference: "KCB453CNP_S900",
    category: "sapato",
    images: [
      "/images/sapato1.webp",
      "/images/sapato2.webp",
      "/images/sapato3.webp",
      "/images/sapato4.webp",
    ],
    colors: [{ name: "black", label: "Preto", image: "/images/sapato1.webp" }],
    sizes: ["35", "36", "37", "38", "39", "40", "41"],
    material: "Couro de bezerro",
    care: "Proteger da umidade",
  },
  {
    id: "bolsa-1",
    name: "Bolsa tote vertical Dior Toujours",
    price: "R$ 24.000,00",
    description: "Couro de bezerro granulado azul",
    fullDescription:
      "A bolsa Dior Toujours apresenta um design sofisticado com linhas limpas. Confeccionada em couro de bezerro granulado, possui compartimento principal espaçoso, bolso interno com zíper e alças duplas. O emblema CD em metal dourado adiciona um toque de luxo.",
    reference: "M2821OTLL_M928",
    category: "bolsa",
    images: [
      "/images/bolsa1.webp",
      "/images/bolsa2.webp",
      "/images/bolsa4.webp",
    ],
    colors: [
      { name: "blue", label: "Azul", image: "/images/bolsa1.webp" },
      { name: "cream", label: "Creme", image: "/images/bolsa2.webp" },
      { name: "pink", label: "Rosa", image: "/images/bolsa4.webp" },
    ],
    moreColors: 3,
    sizes: ["Único"],
    material: "Couro de bezerro granulado",
    care: "Armazenar em saco de proteção",
  },
  {
    id: "oculos-1",
    name: "Óculos Dior Signature",
    price: "R$ 6.600,00",
    description: "Armação de acetato tartaruga",
    fullDescription:
      "Os óculos Dior Signature apresentam uma armação oversized em acetato tartaruga. As hastes largas exibem o logotipo DIOR em metal dourado. As lentes degradê marrom oferecem proteção UV400.",
    reference: "DIORSIGNATURE_S7I",
    category: "oculos",
    images: [
      "/images/oculos.webp",
      "/images/oculos2.webp",
      "/images/oculos3.webp",
      "/images/oculos4.webp",
    ],
    colors: [
      { name: "black", label: "Preto", image: "/images/oculos.webp" },
      { name: "brown", label: "Marrom", image: "/images/oculos2.webp" },
    ],
    sizes: ["Único"],
    material: "Acetato",
    care: "Guardar em estojo rígido",
  },

  {
    id: "blazer-2",
    name: "Camisa polo com mangas longas Dior marinière",
    price: "R$ 16.000,00",
    description: "Lã e seda azul marinho com abotoamento simples",
    fullDescription:
      "Este blazer Bar 30 Montaigne é uma peça emblemática da coleção New Look, criada por Christian Dior em 1947. Confeccionado em mescla de lã e seda azul marinho, ele tem gola notched e bolsos que realçam discretamente a cintura.",
    reference: "841V01AT060_X0300",
    category: "blazer",
    images: ["/images/polo.avif", "/images/polo2.webp", "/images/polo3.webp"],
    colors: [
      { name: "navy", label: "Azul Marinho", image: "/images/polo.avif" },
      { name: "white", label: "Branco", image: "/images/polo2.webp" },
    ],
    sizes: ["34", "36", "38", "40", "42", "44"],
    material: "70% Lã, 30% Seda",
    care: "Lavagem a seco",
  },
  {
    id: "sapato-2",
    name: "Scarpin slingback J'Adior",
    price: "R$ 8.300,00",
    description: "Couro de bezerro técnico vermelho",
    fullDescription:
      "O icônico scarpin slingback J'Adior em vermelho vibrante. Confeccionado em couro de bezerro técnico, possui a assinatura J'ADIOR na tira do calcanhar. O salto kitten de 6,5 cm oferece conforto e sofisticação.",
    reference: "KCB453CNP_S901",
    category: "sapato",
    images: [
      "/images/sapato1.webp",
      "/images/sapato2.webp",
      "/images/sapato3.webp",
      "/images/sapato4.webp",
    ],
    colors: [
      { name: "red", label: "Vermelho", image: "/images/sapato1.webp" },
      { name: "black", label: "Preto", image: "/images/sapato2.webp" },
    ],
    sizes: ["35", "36", "37", "38", "39", "40", "41"],
    material: "Couro de bezerro",
    care: "Proteger da umidade",
  },
  {
    id: "bolsa-2",
    name: "Bolsa tote vertical Dior Toujours",
    price: "R$ 24.000,00",
    description: "Couro de bezerro granulado preto",
    fullDescription:
      "A bolsa Dior Toujours em preto clássico. Confeccionada em couro de bezerro granulado, possui compartimento principal espaçoso, bolso interno com zíper e alças duplas.",
    reference: "M2821OTLL_M900",
    category: "bolsa",
    images: [
      "/images/bolsa1.webp",
      "/images/bolsa2.webp",
      "/images/bolsa4.webp",
    ],
    colors: [
      { name: "black", label: "Preto", image: "/images/bolsa1.webp" },
      { name: "beige", label: "Bege", image: "/images/bolsa2.webp" },
    ],
    sizes: ["Único"],
    material: "Couro de bezerro granulado",
    care: "Armazenar em saco de proteção",
  },
  {
    id: "oculos-2",
    name: "Óculos Dior Signature",
    price: "R$ 6.600,00",
    description: "Armação de acetato dourado",
    fullDescription:
      "Os óculos Dior Signature com armação em acetato dourado. As hastes largas exibem o logotipo DIOR em metal dourado. Lentes degradê marrom com proteção UV400.",
    reference: "DIORSIGNATURE_S7I_G",
    category: "oculos",
    images: [
      "/images/oculos.webp",
      "/images/oculos2.webp",
      "/images/oculos3.webp",
      "/images/oculos4.webp",
    ],
    colors: [{ name: "gold", label: "Dourado", image: "/images/oculos.webp" }],
    sizes: ["Único"],
    material: "Acetato",
    care: "Guardar em estojo rígido",
  },

  {
    id: "blazer-3",
    name: "Blazer Bar 30 Montaigne",
    price: "R$ 33.000,00",
    description: "Lã e seda creme com abotoamento simples",
    fullDescription:
      "Este blazer Bar 30 Montaigne em creme sofisticado. Confeccionado em mescla de lã e seda, ele tem gola notched e bolsos que realçam discretamente a cintura.",
    reference: "841V01AT060_X0400",
    category: "blazer",
    images: [
      "/images/blaze1.webp",
      "/images/blaze2.webp",
      "/images/blaze4.webp",
      "/images/blaze3.webp",
    ],
    colors: [{ name: "cream", label: "Creme", image: "/images/blaze1.webp" }],
    sizes: ["34", "36", "38", "40", "42", "44"],
    material: "70% Lã, 30% Seda",
    care: "Lavagem a seco",
  },
  {
    id: "sapato-3",
    name: "Scarpin slingback J'Adior",
    price: "R$ 8.300,00",
    description: "Couro de bezerro técnico bege",
    fullDescription:
      "O icônico scarpin slingback J'Adior em bege nude. Confeccionado em couro de bezerro técnico, possui a assinatura J'ADIOR na tira do calcanhar.",
    reference: "KCB453CNP_S902",
    category: "sapato",
    images: [
      "/images/sapato1.webp",
      "/images/sapato2.webp",
      "/images/sapato3.webp",
      "/images/sapato4.webp",
    ],
    colors: [
      { name: "beige", label: "Bege", image: "/images/sapato1.webp" },
      { name: "gold", label: "Dourado", image: "/images/sapato2.webp" },
    ],
    sizes: ["35", "36", "37", "38", "39", "40", "41"],
    material: "Couro de bezerro",
    care: "Proteger da umidade",
  },
  {
    id: "bolsa-3",
    name: "Bolsa tote vertical Dior Toujours",
    price: "R$ 24.000,00",
    description: "Couro de bezerro granulado verde",
    fullDescription:
      "A bolsa Dior Toujours em verde sofisticado. Confeccionada em couro de bezerro granulado, possui compartimento principal espaçoso e alças duplas.",
    reference: "M2821OTLL_M930",
    category: "bolsa",
    images: [
      "/images/bolsa1.webp",
      "/images/bolsa2.webp",
      "/images/bolsa4.webp",
    ],
    colors: [
      { name: "green", label: "Verde", image: "/images/bolsa1.webp" },
      { name: "brown", label: "Marrom", image: "/images/bolsa2.webp" },
    ],
    moreColors: 2,
    sizes: ["Único"],
    material: "Couro de bezerro granulado",
    care: "Armazenar em saco de proteção",
  },
  {
    id: "oculos-3",
    name: "Óculos Dior Signature",
    price: "R$ 6.600,00",
    description: "Armação de acetato prata",
    fullDescription:
      "Os óculos Dior Signature com armação em acetato prata. Design moderno com hastes largas e logotipo DIOR.",
    reference: "DIORSIGNATURE_S7I_S",
    category: "oculos",
    images: [
      "/images/oculos.webp",
      "/images/oculos2.webp",
      "/images/oculos3.webp",
      "/images/oculos4.webp",
    ],
    colors: [
      { name: "silver", label: "Prata", image: "/images/oculos.webp" },
      { name: "black", label: "Preto", image: "/images/oculos2.webp" },
    ],
    sizes: ["Único"],
    material: "Acetato",
    care: "Guardar em estojo rígido",
  },

  {
    id: "blazer-4",
    name: "Blazer Bar 30 Montaigne",
    price: "R$ 33.000,00",
    description: "Lã e seda rosa com abotoamento simples",
    fullDescription:
      "Este blazer Bar 30 Montaigne em rosa delicado. Confeccionado em mescla de lã e seda, ele tem gola notched e bolsos elegantes.",
    reference: "841V01AT060_X0500",
    category: "blazer",
    images: [
      "/images/blaze1.webp",
      "/images/blaze2.webp",
      "/images/blaze4.webp",
      "/images/blaze3.webp",
    ],
    colors: [
      { name: "pink", label: "Rosa", image: "/images/blaze1.webp" },
      { name: "white", label: "Branco", image: "/images/blaze2.webp" },
    ],
    sizes: ["34", "36", "38", "40", "42", "44"],
    material: "70% Lã, 30% Seda",
    care: "Lavagem a seco",
  },
  {
    id: "sapato-4",
    name: "Scarpin slingback J'Adior",
    price: "R$ 8.300,00",
    description: "Couro de bezerro técnico azul marinho",
    fullDescription:
      "O icônico scarpin slingback J'Adior em azul marinho sofisticado. Confeccionado em couro de bezerro técnico premium.",
    reference: "KCB453CNP_S903",
    category: "sapato",
    images: [
      "/images/sapato1.webp",
      "/images/sapato2.webp",
      "/images/sapato3.webp",
      "/images/sapato4.webp",
    ],
    colors: [
      { name: "navy", label: "Azul Marinho", image: "/images/sapato1.webp" },
    ],
    sizes: ["35", "36", "37", "38", "39", "40", "41"],
    material: "Couro de bezerro",
    care: "Proteger da umidade",
  },
  {
    id: "bolsa-4",
    name: "Bolsa tote vertical Dior Toujours",
    price: "R$ 24.000,00",
    description: "Couro de bezerro granulado vermelho",
    fullDescription:
      "A bolsa Dior Toujours em vermelho vibrante. Confeccionada em couro de bezerro granulado premium.",
    reference: "M2821OTLL_M901",
    category: "bolsa",
    images: [
      "/images/bolsa1.webp",
      "/images/bolsa2.webp",
      "/images/bolsa4.webp",
    ],
    colors: [{ name: "red", label: "Vermelho", image: "/images/bolsa1.webp" }],
    sizes: ["Único"],
    material: "Couro de bezerro granulado",
    care: "Armazenar em saco de proteção",
  },
  {
    id: "oculos-4",
    name: "Óculos Dior Signature",
    price: "R$ 6.600,00",
    description: "Armação de acetato azul",
    fullDescription:
      "Os óculos Dior Signature com armação em acetato azul. Lentes degradê com proteção UV400.",
    reference: "DIORSIGNATURE_S7I_B",
    category: "oculos",
    images: [
      "/images/oculos.webp",
      "/images/oculos2.webp",
      "/images/oculos3.webp",
      "/images/oculos4.webp",
    ],
    colors: [
      { name: "blue", label: "Azul", image: "/images/oculos.webp" },
      { name: "cream", label: "Creme", image: "/images/oculos2.webp" },
    ],
    sizes: ["Único"],
    material: "Acetato",
    care: "Guardar em estojo rígido",
  },

  {
    id: "blazer-5",
    name: "Blazer Bar 30 Montaigne",
    price: "R$ 33.000,00",
    description: "Lã e seda marrom com abotoamento simples",
    fullDescription:
      "Este blazer Bar 30 Montaigne em marrom elegante. Confeccionado em mescla de lã e seda, ele tem gola notched e bolsos que realçam a cintura.",
    reference: "841V01AT060_X0600",
    category: "blazer",
    images: [
      "/images/blaze1.webp",
      "/images/blaze2.webp",
      "/images/blaze4.webp",
      "/images/blaze3.webp",
    ],
    colors: [
      { name: "brown", label: "Marrom", image: "/images/blaze1.webp" },
      { name: "beige", label: "Bege", image: "/images/blaze2.webp" },
    ],
    sizes: ["34", "36", "38", "40", "42", "44"],
    material: "70% Lã, 30% Seda",
    care: "Lavagem a seco",
  },
  {
    id: "sapato-5",
    name: "Scarpin slingback J'Adior",
    price: "R$ 8.300,00",
    description: "Couro de bezerro técnico prata",
    fullDescription:
      "O icônico scarpin slingback J'Adior em acabamento prata metalizado. Confeccionado em couro de bezerro técnico premium.",
    reference: "KCB453CNP_S904",
    category: "sapato",
    images: [
      "/images/sapato1.webp",
      "/images/sapato2.webp",
      "/images/sapato3.webp",
      "/images/sapato4.webp",
    ],
    colors: [
      { name: "silver", label: "Prata", image: "/images/sapato1.webp" },
      { name: "black", label: "Preto", image: "/images/sapato2.webp" },
    ],
    moreColors: 4,
    sizes: ["35", "36", "37", "38", "39", "40", "41"],
    material: "Couro de bezerro",
    care: "Proteger da umidade",
  },
  {
    id: "bolsa-5",
    name: "Bolsa tote vertical Dior Toujours",
    price: "R$ 24.000,00",
    description: "Couro de bezerro granulado dourado",
    fullDescription:
      "A bolsa Dior Toujours em dourado sofisticado. Confeccionada em couro de bezerro granulado com acabamento metalizado.",
    reference: "M2821OTLL_M950",
    category: "bolsa",
    images: [
      "/images/bolsa1.webp",
      "/images/bolsa2.webp",
      "/images/bolsa4.webp",
    ],
    colors: [
      { name: "gold", label: "Dourado", image: "/images/bolsa1.webp" },
      { name: "black", label: "Preto", image: "/images/bolsa2.webp" },
    ],
    sizes: ["Único"],
    material: "Couro de bezerro granulado",
    care: "Armazenar em saco de proteção",
  },
  {
    id: "oculos-5",
    name: "Óculos Dior Signature",
    price: "R$ 6.600,00",
    description: "Armação de acetato verde",
    fullDescription:
      "Os óculos Dior Signature com armação em acetato verde sofisticado. Lentes degradê com proteção UV400.",
    reference: "DIORSIGNATURE_S7I_V",
    category: "oculos",
    images: [
      "/images/oculos.webp",
      "/images/oculos2.webp",
      "/images/oculos3.webp",
      "/images/oculos4.webp",
    ],
    colors: [{ name: "green", label: "Verde", image: "/images/oculos.webp" }],
    sizes: ["Único"],
    material: "Acetato",
    care: "Guardar em estojo rígido",
  },
];

// ============================================================================
// FUNÇÕES DE BUSCA DE PRODUTOS
// ============================================================================

/**
 * Busca um produto pelo ID
 * @param {string} id - ID do produto
 * @returns {Object|null} - Produto encontrado ou null
 */
export function getProductById(id) {
  return products.find((product) => product.id === id) || null;
}

/**
 * Busca produtos por categoria
 * @param {string} category - Categoria (blazer, sapato, bolsa, oculos)
 * @returns {Array} - Array de produtos da categoria
 */
export function getProductsByCategory(category) {
  return products.filter((product) => product.category === category);
}

/**
 * Busca produtos relacionados com estratégia de máxima diversidade
 * @param {string} currentId - ID do produto atual
 * @param {number} limit - Limite de produtos a retornar
 * @param {boolean} mixedCategories - Se true, mescla categorias quando não houver produtos suficientes
 * @returns {Array} - Array de produtos relacionados embaralhados e únicos
 */
export function getRelatedProducts(
  currentId,
  limit = 4,
  mixedCategories = true
) {
  const currentProduct = getProductById(currentId);
  if (!currentProduct) return [];

  // Shuffle function usando Fisher-Yates
  const shuffle = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Remove duplicados por ID E nome (evita variações de cor do mesmo produto)
  const removeDuplicates = (array) => {
    const seen = new Map(); // Usa Map para rastrear nome + categoria
    return array.filter((item) => {
      const key = `${item.name}-${item.category}`;
      if (seen.has(key)) {
        return false;
      }
      seen.set(key, true);
      return true;
    });
  };

  // Filtra todos os produtos exceto o atual E variações dele
  const allOtherProducts = products.filter(
    (p) => p.id !== currentId && p.name !== currentProduct.name
  );

  // Se queremos mixed, embaralha tudo junto para máxima diversidade
  if (mixedCategories) {
    return removeDuplicates(shuffle(allOtherProducts)).slice(0, limit);
  }

  // Se não mixed, apenas mesma categoria (sem variações de cor)
  const sameCategory = allOtherProducts.filter(
    (p) => p.category === currentProduct.category
  );

  return removeDuplicates(shuffle(sameCategory)).slice(0, limit);
}

/**
 * Lista de cores disponíveis para referência
 */
export const availableColors = [
  { name: "black", label: "Preto" },
  { name: "white", label: "Branco" },
  { name: "beige", label: "Bege" },
  { name: "navy", label: "Azul Marinho" },
  { name: "red", label: "Vermelho" },
  { name: "pink", label: "Rosa" },
  { name: "blue", label: "Azul" },
  { name: "cream", label: "Creme" },
  { name: "brown", label: "Marrom" },
  { name: "gold", label: "Dourado" },
  { name: "silver", label: "Prata" },
  { name: "green", label: "Verde" },
];
