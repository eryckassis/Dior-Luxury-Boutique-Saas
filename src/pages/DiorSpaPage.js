import "../components/AppNavigation.js";
import "../components/FooterSection.js";
import "../components/SpaSectionCard.js";

export class DiorSpaPage extends HTMLElement {
  constructor() {
    super();

    this.spaSections = [
      {
        image: "/images/cama1.jpg",
        title: "Dior Spa New York",
        description: "O Haute Wellness Atelier, em Nova York",
        buttonText: "Descubra",
        buttonStyle: "line",
        imagePosition: "left",
      },
      {
        image: "/images/cama2.jpg",
        title: "Dior Spa Splendido",
        description:
          "A moment suspended in time on the Italian Riviera for an absolute celebration of the senses.",
        buttonText: "Descubra",
        buttonStyle: "line",
        imagePosition: "right",
      },
      {
        image: "/images/cama3.jpg",
        title: "Dior Spa Cheval Blanc Paris",
        description:
          "Um refúgio de bem-estar no coração de Paris, onde a arte do cuidado encontra a excelência Dior.",
        buttonText: "Descubra",
        buttonStyle: "line",
        imagePosition: "left",
      },
      {
        image: "/images/cama4.webp",
        title: "Dior Spa Plaza Athénée",
        description: "Haute Couture beauty rituals in the heart of the Golden Triangle.",
        buttonText: "Descubra",
        buttonStyle: "line",
        imagePosition: "right",
      },
      {
        image: "/images/cama5.jpg",
        title: "Dior Spa Courchevel",
        description: "Um santuário alpino de bem-estar onde a natureza encontra o luxo.",
        buttonText: "Descubra",
        buttonStyle: "line",
        imagePosition: "left",
      },
      {
        image: "/images/cama6.jpg",
        title: "Dior Spa Saint-Tropez",
        description: "L'art de vivre na Riviera Francesa com tratamentos exclusivos.",
        buttonText: "Descubra",
        buttonStyle: "line",
        imagePosition: "right",
      },
      {
        image: "/images/cama7.jpg",
        title: "Dior Spa Marrakech",
        description: "Uma experiência sensorial única inspirada nas tradições marroquinas.",
        buttonText: "Descubra",
        buttonStyle: "line",
        imagePosition: "left",
      },
      {
        image: "/images/cama8.jpg",
        title: "Dior Spa Maldives",
        description: "O paraíso do bem-estar sobre as águas cristalinas do Oceano Índico.",
        buttonText: "Descubra",
        buttonStyle: "line",
        imagePosition: "right",
      },
      {
        image: "/images/cama9.jpg",
        title: "Dior Spa Tokyo",
        description: "A harmonia entre a tradição japonesa e a elegância francesa.",
        buttonText: "Descubra",
        buttonStyle: "line",
        imagePosition: "left",
      },
    ];
  }

  connectedCallback() {
    this.render();
    this.initAnimations();
  }

  disconnectedCallback() {
    if (window.ScrollTrigger) {
      window.ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger?.closest?.("dior-spa-page")) {
          trigger.kill();
        }
      });
    }
  }

  initAnimations() {
    requestAnimationFrame(() => {
      if (!window.gsap || !window.ScrollTrigger) return;

      const heroImage = this.querySelector(".dior-spa-hero-image");
      if (heroImage) {
        window.gsap.to(heroImage, {
          yPercent: 20,
          ease: "none",
          scrollTrigger: {
            trigger: ".dior-spa-hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      const introElements = this.querySelectorAll(
        ".dior-spa-intro-subtitle, .dior-spa-intro-title, .dior-spa-intro-description",
      );
      if (introElements.length) {
        window.gsap.fromTo(
          introElements,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".dior-spa-intro",
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      const whatsNewElements = this.querySelectorAll(
        ".dior-spa-whats-new-label, .dior-spa-whats-new-title, .dior-spa-whats-new-description",
      );
      if (whatsNewElements.length) {
        window.gsap.fromTo(
          whatsNewElements,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".dior-spa-whats-new",
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      const cardWrapper = this.querySelector(".dior-spa-image-reveal-wrapper");
      if (cardWrapper) {
        const overlay = cardWrapper.querySelector(".dior-spa-image-reveal-overlay");
        const image = cardWrapper.querySelector(".dior-spa-image-reveal");

        if (overlay && image) {
          const revealTl = window.gsap.timeline({
            scrollTrigger: {
              trigger: cardWrapper,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          });

          revealTl
            .fromTo(
              overlay,
              { scaleX: 1 },
              {
                scaleX: 0,
                duration: 1.2,
                ease: "power3.inOut",
                transformOrigin: "right center",
              },
            )
            .fromTo(
              image,
              { scale: 1.3 },
              { scale: 1, duration: 1.4, ease: "power2.out" },
              "-=0.8",
            );
        }
      }

      const cardText = this.querySelector(".dior-spa-card-text");
      if (cardText) {
        window.gsap.fromTo(
          cardText.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cardText,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      const underlineButtons = this.querySelectorAll(".dior-spa-btn-underline");
      underlineButtons.forEach((btn) => {
        btn.addEventListener("mouseenter", () => {
          window.gsap.to(btn, {
            "--underline-width": "0%",
            duration: 0.35,
            ease: "power2.inOut",
          });
        });

        btn.addEventListener("mouseleave", () => {
          window.gsap.to(btn, {
            "--underline-width": "100%",
            duration: 0.35,
            ease: "power2.inOut",
          });
        });
      });
    });
  }

  renderSpaSections() {
    return this.spaSections
      .map(
        (section, index) => `
      <spa-section-card
        image="${section.image}"
        title="${section.title}"
        description="${section.description}"
        button-text="${section.buttonText}"
        button-style="${section.buttonStyle}"
        image-position="${section.imagePosition}"
        section-index="${index}"
      ></spa-section-card>
    `,
      )
      .join("");
  }

  render() {
    this.innerHTML = `
      <app-navigation></app-navigation>

      <main class="dior-spa-main">
        <!-- Section 1: Hero Full Image -->
        <section class="dior-spa-hero">
          <img 
            src="/images/firts.webp" 
            alt="Dior Spa" 
            class="dior-spa-hero-image"
          />
          <div class="dior-spa-hero-overlay"></div>
        </section>

        <!-- Section 2: Intro Text -->
        <section class="dior-spa-intro">
          <p class="dior-spa-intro-subtitle">A Essência do Spa Dior</p>
          <h1 class="dior-spa-intro-title">A ESSÊNCIA DO SPA DIOR</h1>
          <p class="dior-spa-intro-description">
            A Maison Dior capta o caráter único de lugares excepcionais e os preenche com 
            seu espírito e sua expertise para criar spas extraordinários. A filosofia de 
            skincare da Dior é holística, concentrando-se na pele e nos sentidos e 
            abordando corpo, mente e alma.
          </p>
        </section>

        <!-- Section 3: What's New -->
        <section class="dior-spa-whats-new">
          <p class="dior-spa-whats-new-label">What's new</p>
          <h2 class="dior-spa-whats-new-title">Haute Motherhood</h2>
          <p class="dior-spa-whats-new-description">
            Dior presents Haute Motherhood at the Cheval Blanc Paris as of 
            December 2025: a wellness journey dedicated to mothers.
          </p>
        </section>

        <!-- Section 4: Card with Image Reveal -->
        <section class="dior-spa-card-section">
          <div class="dior-spa-card-container">
            <div class="dior-spa-image-reveal-wrapper">
              <div class="dior-spa-image-reveal-overlay"></div>
              <img 
                src="/images/bebe.webp" 
                alt="Haute Motherhood" 
                class="dior-spa-image-reveal"
              />
            </div>
            <div class="dior-spa-card-text">
              <p class="dior-spa-card-description">
                Dior unveils a wellness journey designed to support women during their years of 
                motherhood. This personalized program nurtures women's bodies as they seek 
                fulfillment, with expert treatments designed by wellness specialists.
              </p>
              <a href="#" class="dior-spa-btn-underline">Book your experience</a>
            </div>
          </div>
        </section>

        <!-- Sections 5-13: Spa Locations (using reusable component) -->
        ${this.renderSpaSections()}

        <!-- Section: High Tech Tools -->
        <section class="dior-spa-tech-section">
          <div class="dior-spa-tech-header">
            <h2 class="dior-spa-tech-title">FERRAMENTAS DE ALTA TECNOLOGIA</h2>
            <p class="dior-spa-tech-description">
              Para aumentar a eficácia dos cuidados com a pele nos Spas Dior, a Maison Dior 
              utiliza ferramentas tecnológicas de última geração e segue protocolos de beleza 
              desenvolvidos em colaboração com especialistas de beauté.
            </p>
          </div>
          
          <div class="dior-spa-tech-cards">
            <div class="dior-spa-tech-card">
              <div class="dior-spa-tech-card-image-wrapper">
                <img src="/images/hidra.jpg" alt="Dior Hydrafacial" class="dior-spa-tech-card-image" />
              </div>
              <h3 class="dior-spa-tech-card-title">DIOR POWERED BY HYDRAFACIAL</h3>
              <p class="dior-spa-tech-card-description">
                Um protocolo de skincare feito sob medida usando a inovadora ferramenta 
                Syndeo da Hydrafacial. Este tratamento combina a Loção Peeling Floral, com 
                sua alta dose de princípios ativos, e as técnicas dos especialistas em bem-estar 
                da Dior com a mais recente tecnologia Hydrafacial.
              </p>
              <a href="#" class="spa-btn-line">
                <span class="spa-btn-text">Descubra</span>
              </a>
            </div>

            <div class="dior-spa-tech-card">
              <div class="dior-spa-tech-card-image-wrapper">
                <img src="/images/hidra2.webp" alt="Dior Microdermabrasion" class="dior-spa-tech-card-image" />
              </div>
              <h3 class="dior-spa-tech-card-title">DIOR MICRODERMABRASION</h3>
              <p class="dior-spa-tech-card-description">
                A microdermoabrasão é a técnica icônica do spa Dior para um efeito de pele 
                nova. Este método de regeneração da pele utiliza uma ferramenta de alta 
                tecnologia que combina esfoliação e drenagem linfática. Mais suave que um 
                peeling e mais profunda que uma esfoliação, a microdermoabrasão Dior 
                proporciona à pele um brilho renovado.
              </p>
              <a href="#" class="spa-btn-line">
                <span class="spa-btn-text">Descubra</span>
              </a>
            </div>

            <div class="dior-spa-tech-card">
              <div class="dior-spa-tech-card-image-wrapper">
                <img src="/images/hidra3.jpg" alt="Dior Frequencies" class="dior-spa-tech-card-image" />
              </div>
              <h3 class="dior-spa-tech-card-title">Dior Frequencies By Indiba</h3>
              <p class="dior-spa-tech-card-description">
                O Dior Frequencies é um tratamento exclusivo do spa da Dior para o corpo ou 
                para o rosto. A radiofrequência estimula determinadas células do tecido 
                adiposo, o que aumenta a produção de colágeno para uma silhueta esculpida e 
                uma pele rejuvenescida.
              </p>
              <a href="#" class="spa-btn-line">
                <span class="spa-btn-text">Descubra</span>
              </a>
            </div>
          </div>
        </section>

        <!-- Section: Final Spa Location -->
        <spa-section-card
          image="/images/suite.webp"
          title="Dior Spa Expertise"
          description="Descubra a arte do bem-estar Dior, onde cada tratamento é uma experiência única de luxo e sofisticação."
          button-text="Descubra"
          button-style="line"
          image-position="left"
          section-index="final"
        ></spa-section-card>
      </main>

      <footer-section></footer-section>
    `;
  }
}

customElements.define("dior-spa-page", DiorSpaPage);
