// ============================================================================
// PRIMAVERA-VERÃO 2026 PAGE - Desfile Primavera-Verão 2026
// ============================================================================

import "../components/ModaNavigation.js";
import "../components/FooterSection.js";
import "../components/LooksGallery.js";
import { looksPrimaveraVerao2026 } from "../data/looks-data.js";
import { getSmoothScroll } from "../components/SmoothScroll.js";

export class PrimaveraVerao2026Page extends HTMLElement {
  constructor() {
    super();
    this.audio = null;
    this.isPlaying = false;
  }

  connectedCallback() {
    this.render();
    this.initVideoControls();
    this.initButtonAnimation();
    this.initLooksGallery();
    this.initSmoothScroll();
    this.initSoundButton();
    this.initSoundButtonFlair();
  }

  initSmoothScroll() {
    this.SmoothScroll = getSmoothScroll({
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    this.SmoothScroll.init();
  }

  disconnectedCallback() {
    if (this.SmoothScroll) {
      this.SmoothScroll.destroy();
    }
    // Parar áudio ao sair da página
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  }

  initSoundButtonFlair() {
    requestAnimationFrame(() => {
      if (!window.gsap) return;

      const soundBtn = this.querySelector("#sound-wave-btn");
      const flair = soundBtn?.querySelector(".sound-btn-flair");

      if (!soundBtn || !flair) return;

      const xSet = window.gsap.quickSetter(flair, "xPercent");
      const ySet = window.gsap.quickSetter(flair, "yPercent");

      const getXY = (e) => {
        const { left, top, width, height } = soundBtn.getBoundingClientRect();
        const xTransformer = window.gsap.utils.pipe(
          window.gsap.utils.mapRange(0, width, 0, 100),
          window.gsap.utils.clamp(0, 100),
        );

        const yTransformer = window.gsap.utils.pipe(
          window.gsap.utils.mapRange(0, height, 0, 100),
          window.gsap.utils.clamp(0, 100),
        );

        return {
          x: xTransformer(e.clientX - left),
          y: yTransformer(e.clientY - top),
        };
      };

      soundBtn.addEventListener("mouseenter", (e) => {
        const { x, y } = getXY(e);
        xSet(x);
        ySet(y);

        window.gsap.to(flair, {
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
        });
      });

      soundBtn.addEventListener("mouseleave", (e) => {
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

      soundBtn.addEventListener("mousemove", (e) => {
        const { x, y } = getXY(e);

        window.gsap.to(flair, {
          xPercent: x,
          yPercent: y,
          duration: 0.4,
          ease: "power2",
        });
      });
    });
  }

  initSoundButton() {
    requestAnimationFrame(() => {
      const soundBtn = this.querySelector("#sound-wave-btn");
      const wavePath = this.querySelector(".sound-wave-path");

      if (!soundBtn || !wavePath) return;

      // Criar elemento de áudio
      this.audio = new Audio("/audio/desfile-music.mp3");
      this.audio.loop = true;
      this.audio.volume = 0.5;

      // Timeline para animação da onda
      this.waveTimeline = null;

      soundBtn.addEventListener("click", () => {
        if (this.isPlaying) {
          // Pausar música
          this.audio.pause();
          soundBtn.classList.remove("playing");
          this.isPlaying = false;
          this.stopWaveAnimation(wavePath);
        } else {
          // Tocar música
          this.audio
            .play()
            .then(() => {
              soundBtn.classList.add("playing");
              this.isPlaying = true;
              this.startWaveAnimation(wavePath);
            })
            .catch((err) => {
              console.warn("Não foi possível tocar áudio:", err);
            });
        }
      });
    });
  }

  startWaveAnimation(wavePath) {
    if (!window.gsap) return;

    // Parar animação anterior se existir
    if (this.waveTimeline) {
      this.waveTimeline.kill();
    }

    // Criar timeline infinita para animação da onda
    this.waveTimeline = window.gsap.timeline({ repeat: -1 });

    // Sequência de paths para criar efeito de onda se movendo
    const wavePaths = [
      "M2 12 Q4 8, 6 12 T10 12 T14 12 T18 12 T22 12",
      "M2 12 Q4 12, 6 8 T10 16 T14 8 T18 16 T22 12",
      "M2 12 Q4 16, 6 12 T10 8 T14 16 T18 8 T22 12",
      "M2 12 Q4 12, 6 16 T10 8 T14 16 T18 8 T22 12",
      "M2 12 Q4 8, 6 12 T10 16 T14 8 T18 16 T22 12",
    ];

    wavePaths.forEach((path, index) => {
      this.waveTimeline.to(wavePath, {
        attr: { d: path },
        duration: 0.15,
        ease: "sine.inOut",
      });
    });
  }

  stopWaveAnimation(wavePath) {
    if (!window.gsap) return;

    // Parar timeline
    if (this.waveTimeline) {
      this.waveTimeline.kill();
      this.waveTimeline = null;
    }

    // Voltar para linha reta
    window.gsap.to(wavePath, {
      attr: { d: "M2 12 Q6 12, 6 12 T10 12 T14 12 T18 12 T22 12" },
      duration: 0.3,
      ease: "power2.out",
    });
  }

  initVideoControls() {
    requestAnimationFrame(() => {
      const video = this.querySelector("#desfile-video");
      const btn = this.querySelector("#desfile-video-btn");

      if (!video || !btn) return;

      const playIcon = btn.querySelector(".play-icon");
      const pauseIcon = btn.querySelector(".pause-icon");

      btn.addEventListener("click", () => {
        if (video.paused) {
          video.play();
          btn.classList.add("playing");
          playIcon.style.display = "none";
          pauseIcon.style.display = "block";
        } else {
          video.pause();
          btn.classList.remove("playing");
          playIcon.style.display = "block";
          pauseIcon.style.display = "none";
        }
      });

      // Inicialmente, vídeo está tocando, então mostra o ícone de pause
      video
        .play()
        .then(() => {
          btn.classList.add("playing");
          playIcon.style.display = "none";
          pauseIcon.style.display = "block";
        })
        .catch(() => {
          // Se autoplay falhar, mantém ícone de play
          btn.classList.remove("playing");
          playIcon.style.display = "block";
          pauseIcon.style.display = "none";
        });
    });
  }

  initButtonAnimation() {
    requestAnimationFrame(() => {
      if (!window.gsap) return;

      const buttons = this.querySelectorAll(".desfile-read-more-btn");

      buttons.forEach((button) => {
        // Mouseenter - linha diminui para 0
        button.addEventListener("mouseenter", () => {
          window.gsap.to(button, {
            "--underline-width": "100%",
            duration: 0.35,
            ease: "power2.inOut",
          });
        });

        // Mouseleave - linha volta a 0%
        button.addEventListener("mouseleave", () => {
          window.gsap.to(button, {
            "--underline-width": "0%",
            duration: 0.35,
            ease: "power2.inOut",
          });
        });
      });
    });
  }

  initLooksGallery() {
    requestAnimationFrame(() => {
      const gallery = this.querySelector("looks-gallery");
      if (gallery) {
        gallery.looks = looksPrimaveraVerao2026;
      }
    });
  }

  render() {
    this.innerHTML = `
      <div class="desfile-page-content">
        <!-- Moda Navigation -->
        <moda-navigation></moda-navigation>

        <!-- Sound Wave Button - Fixed Positi
        <section class="desfile-text-section">
          <p class="desfile-text-content">
           Dior Desfile de verão 2026 acompanhe as modelos da Maison
          </p>
          <a href="#" class="desfile-read-more-btn">Leia mais</a>
        </section>on -->
        <!-- Sound Wave Button - Fixed Position -->
<button class="sound-wave-btn" id="sound-wave-btn" aria-label="Toggle Sound">
  <span class="sound-btn-flair"></span>
  <svg class="sound-wave-svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
    <path 
      class="sound-wave-path" 
      d="M2 12 Q6 12, 6 12 T10 12 T14 12 T18 12 T22 12"
      stroke="currentColor" 
      stroke-width="1.5" 
      stroke-linecap="round"
      fill="none"
    />
  </svg>
</button>

        <!-- Section 1: Video Full Width -->
        <section class="desfile-hero-video-section">
          <video
            class="desfile-hero-video"
            id="desfile-video"
            autoplay
            muted
            loop
            playsinline
          >
            <source src="/videos/videomoda.mp4" type="video/webm" />
          </video>
          
          <!-- Video Control Button -->
          <button class="moda-video-control-btn" id="desfile-video-btn" aria-label="Play/Pause">
            <svg class="play-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.2 6.902a.5.5 0 0 1 .765-.424l8.157 5.098a.5.5 0 0 1 0 .848l-8.157 5.098a.5.5 0 0 1-.765-.424z"></path>
            </svg>
            <svg class="pause-icon" width="24" height="24" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style="display: none;">
              <g>
                <path d="m182.4,385.5c-6.6,0-12-5.4-12-12v-218.2c0-6.6 5.4-12 12-12 6.6,0 12,5.4 12,12v218.2c0,6.6-5.4,12-12,12z"/>
                <path d="m329.6,385.5c-6.6,0-12-5.4-12-12v-218.2c0-6.6 5.4-12 12-12s12,5.4 12,12v218.2c0,6.6-5.4,12-12,12z"/>
              </g>
            </svg>
          </button>
        </section>

        <!-- Section 2: Text with Read More Button -->
        <section class="desfile-text-section">
          <p class="desfile-text-content">
            Ousar entrar na Maison Dior requer empatia com sua história, disposição para decodificar sua linguagem, que faz parte do imaginário coletivo...
          </p>
          <a href="#" class="desfile-read-more-btn">Leia mais</a>
        </section>

        <!-- Section 3: Looks Gallery -->
        <looks-gallery title="Looks"></looks-gallery>

        <!-- Footer -->
        <footer-section></footer-section>
      </div>
    `;
  }
}

customElements.define("primavera-verao-2026-page", PrimaveraVerao2026Page);
