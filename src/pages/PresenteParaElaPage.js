import "../components/ModaNavigation.js";
import "../components/FooterSection.js";
import "../components/PresenteParaElaContent.js";
import "../styles/presente-para-ela.css";

export class PresenteParaElaPage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
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

      const heroTl = window.gsap.timeline();
      heroTl
        .from(".presente-ela-hero-title", {
          y: 60,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
        })
        .from(
          ".presente-ela-hero-subtitle",
          {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.8",
        );

      this.animations.push(heroTl);

      const contentAnim = window.gsap.from(".presente-ela-content-wrapper", {
        scrollTrigger: {
          trigger: ".presente-ela-content-wrapper",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      this.animations.push(contentAnim);
    });
  }

  render() {
    this.innerHTML = `
      <div class="all-content" id="all-content" role="main">
        <!-- Moda Navigation -->
        <moda-navigation></moda-navigation>

        <main>
          <section class="presente-ela-hero-section">
            <div class="presente-ela-hero-overlay"></div>
            <video
              class="presente-ela-hero-video"
              autoplay
              muted
              loop
              playsinline
            >
              <source src="/videos/diorama.mp4" type="video/webm" />
            </video>
            
            <div class="presente-ela-hero-content">
              <h1 class="presente-ela-hero-title">Coleção Primavera-Verão 2026</h1>
              <p class="presente-ela-hero-subtitle">
                A coleção Primavera-Verão 2026 de Jonathan Anderson explora a tradição da Dior com empatia e criatividade. As peças do arquivo são reinterpretadas para o presente e os códigos da Maison são atualizados.
              </p>
            </div>
          </section>

          <!-- Content Wrapper -->
          <div class="presente-ela-content-wrapper">
            <!-- Componente de conteúdo com drag cards -->
            <presente-para-ela-content></presente-para-ela-content>
          </div>
        </main>

        <!-- Footer -->
        <footer-section></footer-section>
      </div>
    `;
  }
}

customElements.define("presente-para-ela-page", PresenteParaElaPage);
