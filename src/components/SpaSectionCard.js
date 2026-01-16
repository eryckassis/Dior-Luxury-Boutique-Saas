// ============================================================================
// SPA SECTION CARD - Componente reutilizável para sections do Dior Spa
// ============================================================================

export class SpaSectionCard extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return [
      "image",
      "title",
      "description",
      "button-text",
      "button-style",
      "image-position",
      "section-index",
    ];
  }

  connectedCallback() {
    this.render();
    this.initAnimations();
  }

  disconnectedCallback() {
    // Cleanup ScrollTrigger
    if (this.scrollTriggerInstance) {
      this.scrollTriggerInstance.kill();
    }
  }

  get image() {
    return this.getAttribute("image") || "";
  }

  get title() {
    return this.getAttribute("title") || "";
  }

  get description() {
    return this.getAttribute("description") || "";
  }

  get buttonText() {
    return this.getAttribute("button-text") || "Descubra";
  }

  get buttonStyle() {
    // "line" para botão com underline, "filled" para botão preenchido
    return this.getAttribute("button-style") || "line";
  }

  get imagePosition() {
    // "left" ou "right"
    return this.getAttribute("image-position") || "left";
  }

  get sectionIndex() {
    return parseInt(this.getAttribute("section-index") || "0", 10);
  }

  initAnimations() {
    requestAnimationFrame(() => {
      if (!window.gsap || !window.ScrollTrigger) return;

      const imageWrapper = this.querySelector(".spa-card-image-wrapper");
      const overlay = this.querySelector(".spa-card-overlay");
      const image = this.querySelector(".spa-card-image");
      const content = this.querySelector(".spa-card-content");

      if (imageWrapper && overlay && image) {
        // Image reveal animation
        const revealTl = window.gsap.timeline({
          scrollTrigger: {
            trigger: imageWrapper,
            start: "top 80%",
            end: "bottom 20%",
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
              transformOrigin:
                this.imagePosition === "left" ? "right center" : "left center",
            }
          )
          .fromTo(
            image,
            { scale: 1.3 },
            { scale: 1, duration: 1.4, ease: "power2.out" },
            "-=0.8"
          );

        this.scrollTriggerInstance = revealTl.scrollTrigger;
      }

      // Content fade in
      if (content) {
        window.gsap.fromTo(
          content,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: content,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Button hover animation (for filled button style)
      const filledButton = this.querySelector(".spa-btn-filled");
      if (filledButton) {
        const flair = filledButton.querySelector(".spa-btn-flair");
        if (flair) {
          const xSet = window.gsap.quickSetter(flair, "xPercent");
          const ySet = window.gsap.quickSetter(flair, "yPercent");

          const getXY = (e) => {
            const { left, top, width, height } =
              filledButton.getBoundingClientRect();
            const xTransformer = window.gsap.utils.pipe(
              window.gsap.utils.mapRange(0, width, 0, 100),
              window.gsap.utils.clamp(0, 100)
            );
            const yTransformer = window.gsap.utils.pipe(
              window.gsap.utils.mapRange(0, height, 0, 100),
              window.gsap.utils.clamp(0, 100)
            );
            return {
              x: xTransformer(e.clientX - left),
              y: yTransformer(e.clientY - top),
            };
          };

          filledButton.addEventListener("mouseenter", (e) => {
            const { x, y } = getXY(e);
            xSet(x);
            ySet(y);
            window.gsap.to(flair, {
              scale: 1,
              duration: 0.4,
              ease: "power2.out",
            });
          });

          filledButton.addEventListener("mouseleave", (e) => {
            const { x, y } = getXY(e);
            window.gsap.killTweensOf(flair);
            window.gsap.to(flair, {
              xPercent: x > 90 ? x + 20 : x < 10 ? x - 20 : x,
              yPercent: y > 90 ? y + 20 : y < 10 ? y - 20 : y,
              scale: 0,
              duration: 0.3,
              ease: "power2.out",
            });
          });

          filledButton.addEventListener("mousemove", (e) => {
            const { x, y } = getXY(e);
            window.gsap.to(flair, {
              xPercent: x,
              yPercent: y,
              duration: 0.4,
              ease: "power2",
            });
          });
        }
      }
    });
  }

  render() {
    const isLeft = this.imagePosition === "left";

    this.innerHTML = `
      <section class="spa-section-card ${
        isLeft ? "image-left" : "image-right"
      }">
        <div class="spa-card-container">
          ${
            isLeft
              ? `
            <div class="spa-card-image-wrapper">
              <div class="spa-card-overlay"></div>
              <img src="${this.image}" alt="${
                  this.title
                }" class="spa-card-image" />
            </div>
            <div class="spa-card-content">
              <h2 class="spa-card-title">${this.title}</h2>
              <p class="spa-card-description">${this.description}</p>
              ${this.renderButton()}
            </div>
          `
              : `
            <div class="spa-card-content">
              <h2 class="spa-card-title">${this.title}</h2>
              <p class="spa-card-description">${this.description}</p>
              ${this.renderButton()}
            </div>
            <div class="spa-card-image-wrapper">
              <div class="spa-card-overlay"></div>
              <img src="${this.image}" alt="${
                  this.title
                }" class="spa-card-image" />
            </div>
          `
          }
        </div>
      </section>
    `;
  }

  renderButton() {
    if (this.buttonStyle === "line") {
      return `
        <a href="#" class="spa-btn-line">
          <span class="spa-btn-text">${this.buttonText}</span>
          <span class="spa-btn-underline"></span>
        </a>
      `;
    } else {
      return `
        <button class="spa-btn-filled">
          <span class="spa-btn-flair"></span>
          <span class="spa-btn-label">${this.buttonText}</span>
        </button>
      `;
    }
  }
}

customElements.define("spa-section-card", SpaSectionCard);
