import Lenis from "lenis";

class SmoothScroll {
  constructor(options = {}) {
    this.lenis = null;
    this.rafId = null;
    this.isActive = false;

    // Opções padrão
    this.options = {
      duration: 1.2, // Duração do easing
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing exponencial
      orientation: "vertical", // 'vertical' ou 'horizontal'
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
      ...options,
    };
  }

  init() {
    if (this.isActive) return this;

    // Criar instância do Lenis
    this.lenis = new Lenis(this.options);

    // Integrar com GSAP ScrollTrigger
    if (window.ScrollTrigger) {
      this.lenis.on("scroll", window.ScrollTrigger.update);

      window.gsap.ticker.add((time) => {
        this.lenis.raf(time * 1000);
      });

      window.gsap.ticker.lagSmoothing(0);
    } else {
      // Fallback sem GSAP
      const raf = (time) => {
        this.lenis.raf(time);
        this.rafId = requestAnimationFrame(raf);
      };
      this.rafId = requestAnimationFrame(raf);
    }

    this.isActive = true;
    console.log("✓ SmoothScroll initialized");

    return this;
  }

  // Destruir instância (importante para SPA)
  destroy() {
    if (!this.isActive) return;

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }

    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
    }

    this.isActive = false;
    console.log("✓ SmoothScroll destroyed");
  }

  // Pausar scroll
  stop() {
    if (this.lenis) {
      this.lenis.stop();
    }
  }

  // Retomar scroll
  start() {
    if (this.lenis) {
      this.lenis.start();
    }
  }

  // Scroll para elemento ou posição
  scrollTo(target, options = {}) {
    if (this.lenis) {
      this.lenis.scrollTo(target, {
        offset: 0,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        immediate: false,
        lock: false,
        ...options,
      });
    }
  }

  // Obter instância do Lenis
  getInstance() {
    return this.lenis;
  }
}

// Singleton para uso global
let smoothScrollInstance = null;

export const getSmoothScroll = (options) => {
  if (!smoothScrollInstance) {
    smoothScrollInstance = new SmoothScroll(options);
  }
  return smoothScrollInstance;
};

export { SmoothScroll };
export default SmoothScroll;
