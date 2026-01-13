// ============================================================================
// PRODUTOS EXCLUSIVOS DA PÁGINA COLEÇÃO
// Imagens independentes que só aparecem nesta página
// ============================================================================

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
    key: "blazer",
    label: "Blazers",
    showColors: true,
    showSizes: true,
    sizeType: "alpha", // 34, 36, 38, 40...
    description: "Peças de alfaiataria que requerem tamanho específico",
  },
  VESTIDO: {
    key: "vestido",
    label: "Vestidos",
    showColors: true,
    showSizes: true,
    sizeType: "alpha",
    description: "Vestidos que requerem tamanho específico",
  },
  CASACO: {
    key: "casaco",
    label: "Casacos",
    showColors: true,
    showSizes: true,
    sizeType: "alpha",
    description: "Casacos e jaquetas que requerem tamanho específico",
  },
  CAMISA: {
    key: "camisa",
    label: "Camisas",
    showColors: true,
    showSizes: true,
    sizeType: "alpha",
    description: "Camisas que requerem tamanho específico",
  },
  CALCA: {
    key: "calca",
    label: "Calças",
    showColors: true,
    showSizes: true,
    sizeType: "alpha",
    description: "Calças que requerem tamanho específico",
  },
  SAIA: {
    key: "saia",
    label: "Saias",
    showColors: true,
    showSizes: true,
    sizeType: "alpha",
    description: "Saias que requerem tamanho específico",
  },

  // Sapatos - Mostram cores E tamanhos numéricos
  SAPATO: {
    key: "sapato",
    label: "Sapatos",
    showColors: true,
    showSizes: true,
    sizeType: "numeric", // 35, 36, 37...
    description: "Calçados que requerem tamanho específico",
  },

  // Acessórios - Apenas cores, SEM tamanhos
  BOLSA: {
    key: "bolsa",
    label: "Bolsas",
    showColors: true,
    showSizes: false,
    sizeType: "none",
    description: "Bolsas disponíveis em cores, tamanho único",
  },
  OCULOS: {
    key: "oculos",
    label: "Óculos",
    showColors: true,
    showSizes: false,
    sizeType: "none",
    description: "Óculos disponíveis em cores, tamanho único",
  },
  JOIAS: {
    key: "joias",
    label: "Joias",
    showColors: true,
    showSizes: false,
    sizeType: "none",
    description: "Joias disponíveis em diferentes acabamentos",
  },
  RELOJOARIA: {
    key: "relojoaria",
    label: "Relógios",
    showColors: true,
    showSizes: false,
    sizeType: "none",
    description: "Relógios de pulso, tamanho ajustável",
  },
  FRAGRANCIA: {
    key: "fragrancia",
    label: "Fragrâncias",
    showColors: false,
    showSizes: false,
    sizeType: "none",
    description: "Perfumes e fragrâncias",
  },
};

/**
 * Obtém configuração de uma categoria
 * @param {string} categoryKey - Chave da categoria (ex: 'bolsa', 'sapato')
 * @returns {Object|null} Configuração da categoria ou null
 */
export function getCategoryConfig(categoryKey) {
  const normalizedKey = categoryKey?.toLowerCase();
  return (
    Object.values(PRODUCT_CATEGORIES).find(
      (cat) => cat.key === normalizedKey
    ) || null
  );
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
  return Object.values(PRODUCT_CATEGORIES).map((cat) => cat.key);
}

/**
 * Atualiza a categoria de um produto da coleção
 * @param {string} productId - ID do produto
 * @param {string} newCategory - Nova categoria
 * @returns {Object} Resultado da operação
 */
export function updateProductCategory(productId, newCategory) {
  const product = colecaoProducts.find((p) => p.id === productId);

  if (!product) {
    return {
      success: false,
      error: `Produto com ID '${productId}' não encontrado`,
    };
  }

  if (!isValidCategory(newCategory)) {
    return {
      success: false,
      error: `Categoria '${newCategory}' inválida. Categorias válidas: ${getValidCategories().join(
        ", "
      )}`,
    };
  }

  const oldCategory = product.category;
  product.category = newCategory;

  const categoryConfig = getCategoryConfig(newCategory);

  // Ajusta sizes baseado na nova categoria
  if (!categoryConfig.showSizes) {
    product.sizes = ["Único"];
  }

  return {
    success: true,
    message: `Categoria do produto '${product.name}' alterada de '${oldCategory}' para '${newCategory}'`,
    product,
    categoryConfig,
  };
}

// ============================================================================
// PRODUTOS DA COLEÇÃO
// ============================================================================

export const colecaoProducts = [
  {
    id: "colecao-blazer-1",
    name: "Camisa polo com mangas longas Dior Marinière",
    price: "R$ 33.000,00",
    description: "Lã e seda brancas com abotoamento simples",
    fullDescription:
      "A camisa polo Dior Marinière com mangas longas de Jonathan Anderson revisita uma estética esportiva pelo olhar de moda da Maison. Confeccionada em algodão cinza e rosa, a peça destaca-se por um corte descontraído valorizado por uma inscrição Dior bordada e acabamentos canelados.",
    reference: "841V01AT060_X0200",
    category: "blazer",
    images: [
      "/images/vestido1.avif",
      "/images/vestido2.webp",
      "/images/vestido3.webp",
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
    id: "colecao-sapato-1",
    name: "Scarpin slingback J'Adior",
    price: "R$ 8.300,00",
    description: "Couro de bezerro técnico preto",
    fullDescription:
      "O icônico scarpin slingback J'Adior apresenta uma silhueta elegante e atemporal. Confeccionado em couro de bezerro técnico preto, possui a assinatura J'ADIOR na tira do calcanhar. O salto kitten de 6,5 cm oferece conforto e sofisticação para uso diário.",
    reference: "KCB453CNP_S900",
    category: "sapato",
    images: [
      "/images/bolsa1.avif",
      "/images/bolsa22.webp",
      "/images/bolsa3.webp",
    ],
    colors: [{ name: "black", label: "Preto", image: "/images/sapato1.webp" }],
    sizes: ["35", "36", "37", "38", "39", "40", "41"],
    material: "Couro de bezerro",
    care: "Proteger da umidade",
  },
  {
    id: "colecao-bolsa-1",
    name: "Bolsa tote vertical Dior Toujours",
    price: "R$ 24.000,00",
    description: "Couro de bezerro granulado azul",
    fullDescription:
      "A bolsa Dior Toujours apresenta um design sofisticado com linhas limpas. Confeccionada em couro de bezerro granulado, possui compartimento principal espaçoso, bolso interno com zíper e alças duplas. O emblema CD em metal dourado adiciona um toque de luxo.",
    reference: "M2821OTLL_M928",
    category: "bolsa",
    images: [
      "/images/blusinha1.avif",
      "/images/blusinha2.webp",
      "/images/blusinha3.webp",
    ],
    colors: [
      { name: "blue", label: "Azul", image: "/images/bolsa1.webp" },
      { name: "cream", label: "Creme", image: "/images/bolsa2.webp" },
    ],
    moreColors: 3,
    sizes: ["Único"],
    material: "Couro de bezerro granulado",
    care: "Armazenar em saco de proteção",
  },
  {
    id: "colecao-oculos-1",
    name: "Óculos Dior Signature",
    price: "R$ 6.600,00",
    description: "Armação de acetato tartaruga",
    fullDescription:
      "Os óculos Dior Signature apresentam uma armação oversized em acetato tartaruga. As hastes largas exibem o logotipo DIOR em metal dourado. As lentes degradê marrom oferecem proteção UV400.",
    reference: "DIORSIGNATURE_S7I",
    category: "oculos",
    images: [
      "/images/camisa1.avif",
      "/images/camisa2.webp",
      "/images/camisa3.webp",
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
    id: "colecao-vestido-1",
    name: "Vestido Bar Dior Heritage",
    price: "R$ 45.000,00",
    description: "Seda italiana com cintura marcada",
    fullDescription:
      "O vestido Bar Dior Heritage é uma homenagem à icônica silhueta criada por Christian Dior. Confeccionado em seda italiana pura, apresenta cintura marcada e saia rodada que acentua a feminilidade. Um clássico atemporal para ocasiões especiais.",
    reference: "151R52A1234_C099",
    category: "vestido",
    images: [
      "/images/calca1.avif",
      "/images/calca2.webp",
      "/images/calca3.webp",
      "/images/calca4.webp",
    ],
    colors: [
      { name: "black", label: "Preto", image: "/images/logoPreto.webp" },
      { name: "navy", label: "Azul Marinho", image: "/images/logo.webp" },
    ],
    sizes: ["34", "36", "38", "40", "42"],
    material: "100% Seda",
    care: "Lavagem a seco",
  },
  {
    id: "colecao-joia-1",
    name: "Colar Rose des Vents",
    price: "R$ 18.500,00",
    description: "Ouro amarelo 18k com diamantes",
    fullDescription:
      "O colar Rose des Vents combina elegância e simbolismo. Confeccionado em ouro amarelo 18k, o pingente é ornado com diamantes cuidadosamente selecionados. Uma peça de joalheria fina que pode ser usada em qualquer ocasião.",
    reference: "JRDV95003_0000",
    category: "joias",
    images: [
      "/images/trevo1.avif",
      "/images/trevo2.webp",
      "/images/trevo3.webp",
    ],
    colors: [{ name: "gold", label: "Ouro", image: "/images/joias.avif" }],
    sizes: ["Único"],
    material: "Ouro 18k e diamantes",
    care: "Limpar com pano macio",
  },
  {
    id: "colecao-relogio-1",
    name: "Relógio Dior Grand Bal",
    price: "R$ 89.000,00",
    description: "Movimento automático com safiras",
    fullDescription:
      "O relógio Dior Grand Bal é uma obra-prima da relojoaria de luxo. Com movimento automático suíço, caixa em aço inoxidável e mostrador ornado com safiras, este relógio é resistente à água até 50 metros. Uma peça que une funcionalidade e alta joalheria.",
    reference: "CD124BE3C001_0000",
    category: "relojoaria",
    images: ["/images/lenco1.webp", "/images/lenco2.webp"],
    colors: [{ name: "silver", label: "Prata", image: "/images/relogio.avif" }],
    sizes: ["Único"],
    material: "Aço inoxidável e safira",
    care: "Revisão anual recomendada",
  },
  {
    id: "colecao-casaco-1",
    name: "Casaco de Lã com Barra A",
    price: "R$ 38.000,00",
    description: "Lã virgem italiana com forro de seda",
    fullDescription:
      "Este casaco de lã com barra A é uma peça sofisticada para os dias mais frios. Confeccionado em lã virgem italiana de alta qualidade, possui forro em seda pura e fechamento com botões forrados. A silhueta em A oferece elegância e conforto.",
    reference: "143M56A5678_C555",
    category: "casaco",
    images: ["/images/colar1.webp", "/images/colar2.webp"],
    colors: [
      { name: "camel", label: "Camel", image: "/images/logo.webp" },
      { name: "black", label: "Preto", image: "/images/logoPreto.webp" },
    ],
    sizes: ["34", "36", "38", "40", "42", "44"],
    material: "100% Lã virgem",
    care: "Lavagem a seco",
  },
  {
    id: "colecao-highlight-1",
    name: "Camisas",
    price: "R$ 899,00",
    description:
      "Uma fragrância floral e sofisticada que celebra a feminilidade moderna. Notas de íris, rosa e patchouli criam uma composição elegante e atemporal.",
    fullDescription:
      "Coleção exclusiva de camisas Dior com designs sofisticados e materiais premium. Cada peça é confeccionada com atenção aos detalhes, combinando conforto e elegância. Perfeitas para qualquer ocasião, do casual ao formal.",
    reference: "HIGHLIGHT_CAM_001",
    category: "fragrancia",
    images: ["/images/camisaHigh.avif"],
    colors: [],
    sizes: ["P", "M", "G", "GG"],
    material: "Algodão egípcio",
    care: "Lavar à mão ou lavagem a seco",
    isHighlight: true,
  },
  // ============================================================================
  // NOVOS PRODUTOS
  // ============================================================================
  {
    id: "colecao-saia-1",
    name: "Saia Midi Plissada Dior Oblique",
    price: "R$ 19.500,00",
    description: "Seda técnica com estampa Dior Oblique",
    fullDescription:
      "A saia midi plissada Dior Oblique é uma peça statement que combina tradição e modernidade. Confeccionada em seda técnica com a icônica estampa Dior Oblique, apresenta plissado delicado e cintura alta. Perfeita para looks sofisticados do dia à noite.",
    reference: "151S22A8901_X0100",
    category: "saia",
    images: [
      "/images/vestido1.avif",
      "/images/vestido2.webp",
      "/images/vestido3.webp",
    ],
    colors: [
      { name: "navy", label: "Azul Marinho", image: "/images/logoPreto.webp" },
      { name: "beige", label: "Bege", image: "/images/logo.webp" },
    ],
    sizes: ["34", "36", "38", "40", "42"],
    material: "100% Seda técnica",
    care: "Lavagem a seco",
  },
  {
    id: "colecao-calca-1",
    name: "Calça de Alfaiataria Dior",
    price: "R$ 15.800,00",
    description: "Lã fria italiana com corte reto",
    fullDescription:
      "Esta calça de alfaiataria Dior apresenta um corte impecável em lã fria italiana. Com cintura alta, pernas retas e vincos frontais precisos, é uma peça essencial para o guarda-roupa moderno. O acabamento interno em seda garante conforto durante todo o dia.",
    reference: "143P45A6789_C300",
    category: "calca",
    images: [
      "/images/calca1.avif",
      "/images/calca2.webp",
      "/images/calca3.webp",
    ],
    colors: [
      { name: "black", label: "Preto", image: "/images/logoPreto.webp" },
      { name: "gray", label: "Cinza", image: "/images/logo.webp" },
    ],
    sizes: ["34", "36", "38", "40", "42", "44"],
    material: "98% Lã, 2% Elastano",
    care: "Lavagem a seco",
  },
  {
    id: "colecao-camisa-1",
    name: "Camisa de Seda CD Icon",
    price: "R$ 12.200,00",
    description: "Seda pura com bordado CD",
    fullDescription:
      "A camisa de seda CD Icon é uma peça atemporal com detalhes refinados. Confeccionada em seda pura francesa, apresenta o bordado CD discreto no bolso frontal. O corte oversized e os punhos abotoados conferem elegância descontraída.",
    reference: "213C78B4567_X0500",
    category: "camisa",
    images: [
      "/images/camisa1.avif",
      "/images/camisa2.webp",
      "/images/camisa3.webp",
    ],
    colors: [
      { name: "white", label: "Branco", image: "/images/logo.webp" },
      { name: "black", label: "Preto", image: "/images/logoPreto.webp" },
      { name: "pink", label: "Rosa", image: "/images/logo.webp" },
    ],
    sizes: ["34", "36", "38", "40", "42"],
    material: "100% Seda",
    care: "Lavagem a seco ou à mão com água fria",
  },
  {
    id: "colecao-bolsa-2",
    name: "Bolsa Lady Dior Mini",
    price: "R$ 32.000,00",
    description: "Couro cannage com acabamento em ouro",
    fullDescription:
      "A icônica bolsa Lady Dior Mini é um símbolo de elegância atemporal. O padrão cannage é meticulosamente trabalhado em couro de cordeiro, complementado por ferragens em metal dourado e os charms D.I.O.R. que adornam a alça. Uma peça de colecionador.",
    reference: "M0505ONMJ_M323",
    category: "bolsa",
    images: [
      "/images/bolsa1.avif",
      "/images/bolsa22.webp",
      "/images/bolsa3.webp",
    ],
    colors: [
      { name: "black", label: "Preto", image: "/images/logoPreto.webp" },
      { name: "red", label: "Vermelho", image: "/images/logo.webp" },
      { name: "pink", label: "Rosa", image: "/images/logo.webp" },
    ],
    moreColors: 5,
    sizes: ["Único"],
    material: "Couro de cordeiro",
    care: "Armazenar em saco de proteção, evitar luz solar direta",
  },
  {
    id: "colecao-sapato-2",
    name: "Tênis Dior-ID",
    price: "R$ 7.900,00",
    description: "Couro branco com detalhes Oblique",
    fullDescription:
      "O tênis Dior-ID combina esportividade e luxo em um design contemporâneo. Confeccionado em couro de bezerro branco com detalhes em jacquard Dior Oblique, apresenta sola ergonômica e palmilha acolchoada. O logo CD é discretamente posicionado na lateral.",
    reference: "3SN272ZJJ_H065",
    category: "sapato",
    images: [
      "/images/blusinha1.avif",
      "/images/blusinha2.webp",
      "/images/blusinha3.webp",
    ],
    colors: [
      { name: "white", label: "Branco", image: "/images/logo.webp" },
      { name: "black", label: "Preto", image: "/images/logoPreto.webp" },
    ],
    sizes: ["35", "36", "37", "38", "39", "40", "41", "42"],
    material: "Couro de bezerro e jacquard técnico",
    care: "Limpar com pano úmido",
  },
  {
    id: "colecao-joia-2",
    name: "Brincos Tribales Dior",
    price: "R$ 5.800,00",
    description: "Metal dourado com pérolas de resina",
    fullDescription:
      "Os brincos Tribales Dior são um ícone da joalheria fantasia da Maison. Com design assimétrico, combinam uma pérola de resina frontal com uma esfera CD na parte posterior. O acabamento em metal dourado confere sofisticação a qualquer look.",
    reference: "E1045TRICY_D301",
    category: "joias",
    images: [
      "/images/trevo1.avif",
      "/images/trevo2.webp",
      "/images/trevo3.webp",
    ],
    colors: [
      { name: "gold", label: "Dourado", image: "/images/joias.avif" },
      { name: "silver", label: "Prateado", image: "/images/relogio.avif" },
    ],
    sizes: ["Único"],
    material: "Metal banhado a ouro e resina",
    care: "Evitar contato com perfumes e água",
  },
  {
    id: "colecao-vestido-2",
    name: "Vestido Midi em Renda Dior",
    price: "R$ 52.000,00",
    description: "Renda francesa com forro de seda",
    fullDescription:
      "Este vestido midi em renda é uma obra de arte da costura Dior. A renda francesa é delicadamente aplicada sobre um forro de seda pura, criando uma silhueta etérea. Com mangas três-quartos e decote em V, é perfeito para eventos especiais.",
    reference: "151R88A9012_X0800",
    category: "vestido",
    images: [
      "/images/vestido1.avif",
      "/images/vestido2.webp",
      "/images/vestido3.webp",
    ],
    colors: [
      { name: "black", label: "Preto", image: "/images/logoPreto.webp" },
      { name: "nude", label: "Nude", image: "/images/logo.webp" },
    ],
    sizes: ["34", "36", "38", "40", "42"],
    material: "Renda: 65% Algodão, 35% Poliamida / Forro: 100% Seda",
    care: "Lavagem a seco exclusivamente",
  },
  {
    id: "colecao-oculos-2",
    name: "Óculos DiorSoStellaire",
    price: "R$ 4.200,00",
    description: "Armação metálica com lentes espelhadas",
    fullDescription:
      "Os óculos DiorSoStellaire apresentam um design futurista com armação ultraleve em metal. As lentes espelhadas em degradê oferecem proteção UV total enquanto conferem um visual contemporâneo. As hastes finas exibem o logotipo Dior gravado.",
    reference: "DIORSOSTELLAIRE_O1I",
    category: "oculos",
    images: [
      "/images/camisa1.avif",
      "/images/camisa2.webp",
      "/images/camisa3.webp",
    ],
    colors: [
      { name: "gold", label: "Dourado", image: "/images/logo.webp" },
      { name: "silver", label: "Prateado", image: "/images/logoPreto.webp" },
      { name: "rosegold", label: "Rosé", image: "/images/logo.webp" },
    ],
    sizes: ["Único"],
    material: "Metal e lentes de policarbonato",
    care: "Guardar em estojo, limpar com pano de microfibra",
  },
  {
    id: "colecao-highlight-2",
    name: "Bolsas",
    price: "A partir de R$ 15.000,00",
    description:
      "Descubra a coleção de bolsas icônicas da Maison Dior. Do clássico Lady Dior ao moderno Saddle, cada peça é um testemunho da excelência artesanal.",
    fullDescription:
      "A coleção de bolsas Dior representa o auge do savoir-faire da Maison. Cada modelo é criado por artesãos especializados usando os melhores couros e materiais. Das silhuetas atemporais às criações contemporâneas, encontre a bolsa perfeita para completar seu estilo.",
    reference: "HIGHLIGHT_BOL_002",
    category: "bolsa",
    images: ["/images/bolsa.avif"],
    colors: [],
    sizes: ["Único"],
    material: "Diversos couros premium",
    care: "Consulte as instruções específicas de cada modelo",
    isHighlight: true,
  },
  
];

/**
 * Busca um produto da coleção pelo ID
 * @param {string} id - ID do produto
 * @returns {Object|null} - Produto encontrado ou null
 */
export function getColecaoProductById(id) {
  return colecaoProducts.find((product) => product.id === id) || null;
}

/**
 * Busca produtos da coleção por categoria
 * @param {string} category - Categoria (blazer, sapato, bolsa, oculos, etc)
 * @returns {Array} - Array de produtos da categoria
 */
export function getColecaoProductsByCategory(category) {
  return colecaoProducts.filter((product) => product.category === category);
}

/**
 * Busca produtos relacionados da coleção com estratégia de máxima diversidade
 * @param {string} currentId - ID do produto atual
 * @param {number} limit - Limite de produtos a retornar
 * @param {boolean} mixedCategories - Se true, mescla categorias quando não houver produtos suficientes
 * @returns {Array} - Array de produtos relacionados embaralhados e únicos
 */
export function getRelatedColecaoProducts(
  currentId,
  limit = 4,
  mixedCategories = true
) {
  const currentProduct = getColecaoProductById(currentId);
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
  const allOtherProducts = colecaoProducts.filter(
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
