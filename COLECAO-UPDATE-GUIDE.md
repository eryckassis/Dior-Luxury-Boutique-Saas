# Guia de Atualização - ColecaoProductDetailContent.js

Aplicar as mesmas mudanças do ProductDetailContent.js:

## 1. No método render(), substituir:

### Adicionar Font Awesome no início do HTML:

```javascript
this.innerHTML = `
  <!-- Font Awesome para ícones -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

  <div class="product-detail-container">
```

### Trocar product.images por this.currentImages:

- Na galeria: `${this.currentImages.map(...`
- Na paginação: `${this.currentImages.map(...`

### Trocar product.price por this.currentPrice:

```javascript
<p class="product-price">${this.currentPrice}</p>
```

### Atualizar as tabs para incluir ícones:

```javascript
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
```

### Atualizar conteúdo das tabs (copiar exatamente de ProductDetailContent.js):

- Tab 0: Adicionar seções de material e care com ícones
- Tab 1: Nova estrutura com size-info-list
- Tab 2: Nova estrutura com store-info-section

## 2. Verificar se todos os métodos estão implementados:

✅ constructor - atualizado
✅ connectedCallback - atualizado  
✅ selectColor - atualizado
✅ selectSize - ok
✅ updateGallery - adicionado
✅ switchTab - ok

## Status

- Métodos JavaScript: ✅ Completos
- Render method: ⏳ Precisa atualizar tabs
