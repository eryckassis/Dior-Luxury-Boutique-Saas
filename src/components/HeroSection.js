export class HeroSection extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const videoSrc = this.getAttribute("video") || "/videos/VideoSection1.mp4";
    const label = this.getAttribute("label") || "Dior Holiday";
    const title = this.getAttribute("title") || "Bem-vindo ao Circo dos Sonhos Dior";
    const buttonText = this.getAttribute("button-text") || "Chegue mais perto";

    this.render(videoSrc, label, title, buttonText);
  }

  render(videoSrc, label, title, buttonText) {
    this.innerHTML = `
      <article class="grid-item" id="silence-space">
        <figure class="grid-item__wrapper">
          <figcaption class="grid-copy"></figcaption>
          <video
            class="hero-video-hover"
            src="${videoSrc}"
            muted
            loop
            playsinline
            preload="auto"
          ></video>
          <div class="video-overlay-content">
            <p class="video-overlay-label">${label}</p>
            <h2 class="video-overlay-title">
              ${title}
            </h2>
            <a href="#" class="video-overlay-button" data-block="button">
              <span class="button__label">${buttonText}</span>
              <span class="button__flair"></span>
            </a>
          </div>
        </figure>
      </article>
    `;
  }
}

customElements.define("hero-section", HeroSection);
