import "../components/AppNavigation.js";
import "../components/FooterSection.js";
import "../components/PerfumeProductDetailContent.js";
import "../styles/compras-miss-dior.css";
import { getPerfumeById } from "../data/perfume-products.js";
import { router } from "../router/router.js";

export class PerfumeProductDetailPage extends HTMLElement {
  constructor() {
    super();
    this.product = null;
    this.productId = null;
  }

  connectedCallback() {
    this.productId = this.routeParams?.id || router.getParams()?.id;

    if (this.productId) {
      this.product = getPerfumeById(this.productId);
    }

    if (!this.product) {
      console.error(`Perfume não encontrado: ${this.productId}`);

      router.navigate("/home");
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

      const pageAnim = window.gsap.from(".compras-miss-dior-page", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
      });
      this.animations.push(pageAnim);

      const infoAnim = window.gsap.from(".product-info-wrapper > *", {
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

  animateOut() {
    return new Promise((resolve) => {
      if (!window.gsap) {
        resolve();
        return;
      }

      window.gsap.to(this, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: resolve,
      });
    });
  }

  render() {
    this.innerHTML = `
      <div class="all-content" id="all-content" role="main">
        <!-- Navigation -->
        <app-navigation></app-navigation>

        <main>
          <!-- Componente de conteúdo do produto dinâmico -->
          <perfume-product-detail-content 
            data-product-id="${this.productId}">
          </perfume-product-detail-content>
        </main>

        <!-- Footer -->
        <footer-section></footer-section>
      </div>
    `;
  }
}

customElements.define("perfume-product-detail-page", PerfumeProductDetailPage);
