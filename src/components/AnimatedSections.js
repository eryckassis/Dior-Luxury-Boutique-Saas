export class AnimatedSections extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <section class="animated-sections-wrapper">
        <section class="first">
          <div class="outer">
            <div class="inner">
              <div class="bg one">
                <video
                  class="bg-video"
                  id="section-video"
                  autoplay
                  muted
                  loop
                  playsinline
                >
                  <source src="/videos/Holiday-Dior.mp4" type="video/mp4" />
                </video>
                <h2 class="section-heading"></h2>

                <!-- Video Controls - Liquid Glass -->
                <div class="video-controls">
                  <button
                    class="glass-button"
                    id="play-pause-btn"
                    aria-label="Play/Pause"
                    data-block="button"
                  >
                    <span class="button__flair"></span>
                    <svg
                      class="icon-play"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    <svg
                      class="icon-pause"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      style="display: none"
                    >
                      <rect x="6" y="4" width="4" height="16"></rect>
                      <rect x="14" y="4" width="4" height="16"></rect>
                    </svg>
                  </button>

                  <button
                    class="glass-button"
                    id="mute-unmute-btn"
                    aria-label="Mute/Unmute"
                    data-block="button"
                  >
                    <span class="button__flair"></span>
                    <svg
                      class="icon-mute"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <polygon
                        points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
                      ></polygon>
                      <line x1="23" y1="9" x2="17" y2="15"></line>
                      <line x1="17" y1="9" x2="23" y2="15"></line>
                    </svg>
                    <svg
                      class="icon-unmute"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      style="display: none"
                    >
                      <polygon
                        points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
                      ></polygon>
                      <path
                        d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
<footer-section></footer-section>
      
    `;
  }
}

customElements.define("animated-sections", AnimatedSections);
