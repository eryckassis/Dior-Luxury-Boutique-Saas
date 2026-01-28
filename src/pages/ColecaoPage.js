import "../components/ModaNavigation.js";
import "../components/FooterSection.js";
import "../components/ColecaoContent.js";
import "../styles/presente-para-ela.css";
import "../styles/colecao.css";

export class ColecaoPage extends HTMLElement {
  constructor() {
    super();
    this.animations = [];
  }

  connectedCallback() {
    this.render();
    this.initAnimations();
  }

  disconnectedCallback() {
    if (this.animations && this.animations.length > 0) {
      this.animations.forEach((anim) => {
        if (anim && typeof anim.kill === "function") {
          anim.kill();
        }
      });
      this.animations = [];
    }

    if (window.ScrollTrigger) {
      const triggers = window.ScrollTrigger.getAll();
      triggers.forEach((trigger) => trigger.kill());
    }
  }

  initAnimations() {}

  render() {
    this.innerHTML = `
      <div class="all-content" id="all-content" role="main">
        <!-- Moda Navigation -->
        <moda-navigation></moda-navigation>

        <main>
          <!-- Hero Text Section -->
          <section class="colecao-hero-text-section">
            <div class="colecao-hero-text-container">
              <h1 class="colecao-hero-title">Coleção Primavera-Verão 2026</h1>
              <p class="colecao-hero-description">
                A coleção Primavera-Verão 2026 de Jonathan Anderson explora a tradição da Dior 
                com empatia e criatividade. As peças do arquivo são reinterpretadas para o presente 
                e os códigos da Maison são atualizados.
              </p>
              <p class="colecao-hero-count">78 Artigos</p>
            </div>
          </section>

          <!-- Content Wrapper -->
          <div class="presente-ela-content-wrapper">
            <!-- Componente de conteúdo com drag cards e produtos -->
            <colecao-content></colecao-content>
          </div>
        </main>

        <!-- Footer -->
        <footer-section></footer-section>
      </div>
    `;
  }
}

customElements.define("colecao-page", ColecaoPage);
