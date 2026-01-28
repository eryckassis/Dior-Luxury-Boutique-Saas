import "../components/ModaNavigation.js";
import "../components/FooterSection.js";
import "../components/ProductDetailContent.js";
import "../styles/product-detail.css";
import { getProductById } from "../data/products.js";
import { router } from "../router/router.js";

export class ProductDetailPage extends HTMLElement {
  constructor() {
    super();
    this.product = null;
    this.productId = null;
  }

  connectedCallback() {
    this.productId = this.routeParams?.id || router.getParams()?.id;

    if (this.productId) {
      this.product = getProductById(this.productId);
    }

    if (!this.product) {
      console.error(`Produto não encontrado: ${this.productId}`);

      router.navigate("/para-ela");
      return;
    }

    this.render();
    this.initAnimations();
  }

  disconnectedCallback() {
    if (this.animations) {
      this.animations.forEach((anim) => anim.kill());
    }
  }

  initAnimations() {
    requestAnimationFrame(() => {
      if (!window.gsap) return;

      this.animations = [];

      const pageAnim = window.gsap.from(".product-detail-container", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
      });
      this.animations.push(pageAnim);

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
            <!-- Componente de conteúdo do produto -->
            <product-detail-content 
              data-product-id="${this.productId}">
            </product-detail-content>
          </section>
        </main>

        <!-- Footer -->
        <footer-section></footer-section>
      </div>
    `;
  }
}

customElements.define("product-detail-page", ProductDetailPage);
