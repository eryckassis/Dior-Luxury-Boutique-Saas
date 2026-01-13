// ============================================================================
// COLECAO PRODUCT DETAIL PAGE - Página de detalhes do produto da coleção
// ============================================================================

import "../components/ModaNavigation.js";
import "../components/FooterSection.js";
import "../components/ColecaoProductDetailContent.js";
import "../styles/product-detail.css";
import { getColecaoProductById } from "../data/colecao-products.js";
import { router } from "../router/router.js";

export class ColecaoProductDetailPage extends HTMLElement {
  constructor() {
    super();
    this.product = null;
    this.productId = null;
  }

  connectedCallback() {
    // Obtém o ID do produto dos parâmetros da rota
    this.productId = this.routeParams?.id || router.getParams()?.id;

    if (this.productId) {
      this.product = getColecaoProductById(this.productId);
    }

    if (!this.product) {
      console.error(`Produto da coleção não encontrado: ${this.productId}`);
      // Redireciona para página da coleção se produto não existir
      router.navigate("/colecao");
      return;
    }

    this.render();
    this.initAnimations();
  }

  disconnectedCallback() {
    // Cleanup animations
    if (this.animations) {
      this.animations.forEach((anim) => anim.kill());
    }
  }

  initAnimations() {
    requestAnimationFrame(() => {
      if (!window.gsap) return;

      this.animations = [];

      // Fade in da página
      const pageAnim = window.gsap.from(".product-detail-container", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
      });
      this.animations.push(pageAnim);

      // Stagger das informações do produto
      const infoAnim = window.gsap.from(".product-info > *", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.3,
      });
      this.animations.push(infoAnim);
    });
  }

  render() {
    this.innerHTML = `
      <div class="all-content" id="all-content" role="main">
        <!-- Moda Navigation -->
        <moda-navigation></moda-navigation>

        <main>
          <section class="product-detail-section">
            <!-- Componente de conteúdo do produto da coleção -->
            <colecao-product-detail-content 
              data-product-id="${this.productId}">
            </colecao-product-detail-content>
          </section>
        </main>

        <!-- Footer -->
        <footer-section></footer-section>
      </div>
    `;
  }
}

customElements.define("colecao-product-detail-page", ColecaoProductDetailPage);
