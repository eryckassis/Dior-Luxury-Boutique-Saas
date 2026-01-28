// ============================================================================
// KEYHOLE SECTION WEB COMPONENT - Seção com efeito keyhole
// ============================================================================

export class KeyholeSection extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const image = this.getAttribute("image") || "/images/Image 2 Dior.jpg";
    const subtitle = this.getAttribute("subtitle") || "Dior Backstage Glow Maximizer Palette";
    const title = this.getAttribute("title") || "Uma nova visão da icônica paleta de iluminadores";
    const buttonText = this.getAttribute("button-text") || "Descubra";

    this.render(image, subtitle, title, buttonText);
    this.initButtonFlairEffect();
  }

  render(image, subtitle, title, buttonText) {
    this.innerHTML = `
      <section class="keyhole-section">
        <div class="keyhole-container">
          <div class="keyhole-image">
            <img
              src="${image}"
              alt="Dior product reveal"
              loading="lazy"
            />
          </div>
          <div class="keyhole-overlay"></div>
          <div class="keyhole-content">
            <p class="keyhole-subtitle">${subtitle}</p>
            <h2 class="keyhole-title">
              ${title}
            </h2>
            <a href="#" class="keyhole-button" data-block="button">
              <span class="button__label">${buttonText}</span>
              <span class="button__flair"></span>
            </a>
          </div>
        </div>
      </section>
    `;
  }

  // ============================================================================
  // BUTTON FLAIR EFFECT - Efeito de hover seguindo o mouse (igual SplashPage)
  // ============================================================================
  initButtonFlairEffect() {
    if (!window.gsap) return;

    const button = this.querySelector(".keyhole-button");
    if (!button) return;

    const flair = button.querySelector(".button__flair");
    if (!flair) return;

    const xSet = gsap.quickSetter(flair, "xPercent");
    const ySet = gsap.quickSetter(flair, "yPercent");

    // Calcula posição relativa do mouse no botão
    const getXY = (e) => {
      const { left, top, width, height } = button.getBoundingClientRect();

      const xTransformer = gsap.utils.pipe(
        gsap.utils.mapRange(0, width, 0, 100),
        gsap.utils.clamp(0, 100),
      );

      const yTransformer = gsap.utils.pipe(
        gsap.utils.mapRange(0, height, 0, 100),
        gsap.utils.clamp(0, 100),
      );

      return {
        x: xTransformer(e.clientX - left),
        y: yTransformer(e.clientY - top),
      };
    };

    // Mouse Enter - Flair aparece
    button.addEventListener("mouseenter", (e) => {
      const { x, y } = getXY(e);
      xSet(x);
      ySet(y);

      gsap.to(flair, {
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
      });
    });

    // Mouse Leave - Flair desaparece
    button.addEventListener("mouseleave", (e) => {
      const { x, y } = getXY(e);

      gsap.killTweensOf(flair);

      gsap.to(flair, {
        xPercent: x > 90 ? x + 20 : x < 10 ? x - 20 : x,
        yPercent: y > 90 ? y + 20 : y < 10 ? y - 20 : y,
        scale: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    // Mouse Move - Flair segue o mouse
    button.addEventListener("mousemove", (e) => {
      const { x, y } = getXY(e);

      gsap.to(flair, {
        xPercent: x,
        yPercent: y,
        duration: 0.4,
        ease: "power2",
      });
    });
  }
}

customElements.define("keyhole-section", KeyholeSection);
