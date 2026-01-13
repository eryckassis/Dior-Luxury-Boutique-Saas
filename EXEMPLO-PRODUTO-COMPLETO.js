// ============================================================================
// EXEMPLO DE PRODUTO COMPLETO
// Com todas as novas funcionalidades implementadas
// ============================================================================

export const exemploProdu completo = {
  id: "blazer-exemplo",
  name: "Blazer Bar 30 Montaigne",
  price: "R$ 33.000,00", // Preço da primeira cor (branco)
  description: "Lã e seda brancas com abotoamento simples",
  fullDescription:
    "Este blazer Bar 30 Montaigne é uma peça emblemática da coleção New Look, criada por Christian Dior em 1947. Confeccionado em mescla de lã e seda leve, possui gola notched e bolsos que realçam discretamente a cintura. O blazer Bar combina com todo o guarda-roupa Dior, criando uma silhueta elegante e refinada.",
  reference: "841V01AT060_X0200",
  category: "blazer",

  // Imagens base (da primeira cor - branco)
  images: [
    "/images/blaze1.webp",
    "/images/blaze2.webp",
    "/images/blaze4.webp",
    "/images/blaze3.webp",
  ],

  // 🎨 CORES - Cada cor tem preço e imagens próprias
  colors: [
    {
      name: "white",
      label: "Branco",
      image: "/images/blaze1.webp", // Miniatura para o seletor
      price: "R$ 33.000,00", // Preço do branco
      images: [
        // Galeria completa do branco
        "/images/blaze1.webp",
        "/images/blaze2.webp",
        "/images/blaze4.webp",
        "/images/blaze3.webp",
      ],
    },
    {
      name: "black",
      label: "Preto",
      image: "/images/blazer-black-thumb.webp",
      price: "R$ 34.000,00", // Preço diferente para o preto!
      images: [
        // Galeria diferente para o preto
        "/images/blazer-black-1.webp",
        "/images/blazer-black-2.webp",
        "/images/blazer-black-3.webp",
        "/images/blazer-black-4.webp",
      ],
    },
    {
      name: "navy",
      label: "Azul Marinho",
      image: "/images/blazer-navy-thumb.webp",
      price: "R$ 33.500,00", // Outro preço diferente!
      images: [
        "/images/blazer-navy-1.webp",
        "/images/blazer-navy-2.webp",
        "/images/blazer-navy-3.webp",
      ],
    },
  ],

  // Mais cores disponíveis (opcional)
  moreColors: 2,

  // 📏 TAMANHOS
  sizes: ["34", "36", "38", "40", "42", "44"],

  // 📐 INFORMAÇÕES DE TAMANHO E CORTE (Nova seção!)
  sizeInfo: {
    fit: "Corte casual",
    sleeves: "Mangas longas",
    model: "A modelo mede 178 cm e o item mostrado é tamanho 36 (FR)",
    guide: "Para mais informações, consulte o guia de tamanhos",
  },

  // 🏷️ MATERIAL E CUIDADOS
  material: "70% Lã, 30% Seda",
  care: "Lavagem a seco recomendada",
};

// ============================================================================
// COMPORTAMENTO ESPERADO
// ============================================================================

/*
AO SELECIONAR COR "BRANCO":
- Preço exibido: R$ 33.000,00
- Galeria: 4 imagens do blazer branco
- Título: "Cor: Branco"

AO SELECIONAR COR "PRETO":
- Preço muda para: R$ 34.000,00  ← ATUALIZA AUTOMATICAMENTE!
- Galeria muda para: 4 imagens do blazer preto  ← ATUALIZA AUTOMATICAMENTE!
- Título: "Cor: Preto"

AO SELECIONAR COR "AZUL MARINHO":
- Preço muda para: R$ 33.500,00
- Galeria muda para: 3 imagens do blazer azul
- Título: "Cor: Azul Marinho"

TABS EXIBIDAS:
1. [📄] Descrição
   - Descrição completa
   - [🏷️] Material: 70% Lã, 30% Seda
   - [❤️] Cuidados: Lavagem a seco recomendada

2. [📏] Tamanho e corte
   - [👕] Corte casual
   - [↔️] Mangas longas
   - [👤] A modelo mede 178 cm e o item mostrado é tamanho 36 (FR)
   - [ℹ️] Para mais informações, consulte o guia de tamanhos

3. [🏪] Contato e disponibilidade na loja
   - [🔍] Disponibilidade nas boutiques [Botão: Ver boutiques]
   - [📅] Agende seu atendimento em loja [Botão: Agendar]
   - [📍] As boutiques [Botão: Localizar]
*/

// ============================================================================
// EXEMPLO SIMPLIFICADO (Produto sem variação de preço)
// ============================================================================

export const exemploProdutoSimples = {
  id: "bolsa-exemplo",
  name: "Bolsa Lady Dior",
  price: "R$ 28.000,00",
  description: "Couro de bezerro preto com cannage",
  fullDescription: "A icônica bolsa Lady Dior...",
  reference: "M0505ONGH_M900",
  category: "bolsa",

  images: ["/images/bolsa-1.webp"],

  // Cores sem preços diferentes (todas R$ 28.000,00)
  colors: [
    {
      name: "black",
      label: "Preto",
      image: "/images/bolsa-black-thumb.webp",
      // price não especificado = usa o preço base do produto
      images: ["/images/bolsa-black-1.webp", "/images/bolsa-black-2.webp"],
    },
    {
      name: "cream",
      label: "Creme",
      image: "/images/bolsa-cream-thumb.webp",
      images: ["/images/bolsa-cream-1.webp", "/images/bolsa-cream-2.webp"],
    },
  ],

  sizes: ["Único"],

  // Bolsa não tem sizeInfo (tab mostra mensagem padrão)
  // sizeInfo: null,

  material: "Couro de bezerro com cannage",
  care: "Armazenar em saco de proteção",
};
