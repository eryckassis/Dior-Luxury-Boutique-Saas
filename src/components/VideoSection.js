export class VideoSection extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const videoSrc = this.getAttribute("video") || "/videos/videosection1.2.mp4";
    const id = this.getAttribute("section-id") || "depth-meaning";

    this.render(videoSrc, id);
  }

  render(videoSrc, id) {
    this.innerHTML = `
      <article class="grid-item" id="${id}">
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
        </figure>
      </article>
    `;
  }
}

customElements.define("video-section", VideoSection);
