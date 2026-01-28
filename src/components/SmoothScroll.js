import Lenis from "lenis";

class SmoothScroll {
  constructor(options = {}) {
    this.lenis = null;
    this.rafId = null;
    this.isActive = false;

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

    this.lenis = new Lenis(this.options);

    if (window.ScrollTrigger) {
      this.lenis.on("scroll", window.ScrollTrigger.update);

      window.gsap.ticker.add((time) => {
        if (this.lenis && typeof this.lenis.raf === "function") {
          this.lenis.raf(time * 1000);
        }
      });

      window.gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (time) => {
        if (this.lenis && typeof this.lenis.raf === "function") {
          this.lenis.raf(time);
        }
        if (this.isActive) {
          this.rafId = requestAnimationFrame(raf);
        }
      };
      this.rafId = requestAnimationFrame(raf);
    }

    this.isActive = true;
    console.log("✓ SmoothScroll initialized");

    return this;
  }

  destroy() {
    if (!this.isActive) return;

    this.isActive = false;

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    if (window.gsap && window.gsap.ticker) {
      window.gsap.ticker.remove((time) => {
        if (this.lenis) {
          this.lenis.raf(time * 1000);
        }
      });
    }

    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
    }

    console.log("✓ SmoothScroll destroyed");
  }

  stop() {
    if (this.lenis) {
      this.lenis.stop();
    }
  }

  start() {
    if (this.lenis) {
      this.lenis.start();
    }
  }

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

  getInstance() {
    return this.lenis;
  }
}

let smoothScrollInstance = null;

export const getSmoothScroll = (options) => {
  if (!smoothScrollInstance) {
    smoothScrollInstance = new SmoothScroll(options);
  }
  return smoothScrollInstance;
};

export { SmoothScroll };
export default SmoothScroll;
