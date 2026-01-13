# Nova Estrutura de Produtos

## Estrutura com Cores que Mudam Imagens e Preços

```javascript
{
  id: "blazer-1",
  name: "Blazer Bar 30 Montaigne",
  price: "R$ 33.000,00", // Preço base (da primeira cor)
  description: "Lã e seda brancas com abotoamento simples",
  fullDescription: "...",
  reference: "841V01AT060_X0200",
  category: "blazer",

  // Imagens base (da primeira cor)
  images: [
    "/images/blaze1.webp",
    "/images/blaze2.webp",
    "/images/blaze4.webp",
    "/images/blaze3.webp",
  ],

  // Cada cor tem suas próprias imagens e preço
  colors: [
    {
      name: "white",
      label: "Branco",
      image: "/images/blaze1.webp", // Miniatura da cor
      price: "R$ 33.000,00",
      images: [ // Galeria específica desta cor
        "/images/blaze1.webp",
        "/images/blaze2.webp",
        "/images/blaze4.webp",
        "/images/blaze3.webp",
      ]
    },
    {
      name: "black",
      label: "Preto",
      image: "/images/blazer-black-thumb.webp",
      price: "R$ 34.000,00",
      images: [
        "/images/blazer-black-1.webp",
        "/images/blazer-black-2.webp",
        "/images/blazer-black-3.webp",
      ]
    },
  ],

  sizes: ["34", "36", "38", "40", "42", "44"],

  // Nova seção: Informações de Tamanho e Corte
  sizeInfo: {
    fit: "Corte casual",
    sleeves: "Mangas longas",
    model: "A modelo mede 178 cm e o item mostrado é tamanho 36 (FR)",
    guide: "Para mais informações, consulte o guia de tamanhos"
  },

  material: "70% Lã, 30% Seda",
  care: "Lavagem a seco"
}
```

## Comportamento

1. **Ao selecionar uma cor:**

   - Galeria de imagens muda para `colors[index].images`
   - Preço muda para `colors[index].price`
   - Cor ativa é destacada visualmente

2. **Tabs:**

   - Descrição (já existe)
   - **Tamanho e corte** (nova) - Mostra sizeInfo
   - **Contato e disponibilidade na loja** (nova) - Mostra opções de contato e boutiques

3. **Ícones:**
   - Font Awesome ou biblioteca similar para ícones das tabs
