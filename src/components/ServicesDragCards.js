export function initServicesDrag(options) {
  const { container, track, cards, onUpdate } = options;

  if (!window.gsap || !window.Draggable) {
    console.error("❌ GSAP ou Draggable não encontrado!");
    return null;
  }

  if (!container || !track || !cards || cards.length === 0) {
    console.error("❌ Elementos não encontrados para o drag!");
    return null;
  }

  const totalCards = cards.length;
  let draggableInstance = null;
  let resizeHandler = null;
  let bounds = { minX: 0, maxX: 0 };

  const calculateBounds = () => {
    const containerWidth = container.offsetWidth;

    if (cards.length === 0) return { minX: 0, maxX: 0 };

    const trackStyles = getComputedStyle(track);
    const gap = parseFloat(trackStyles.gap) || 20;
    const paddingLeft = parseFloat(trackStyles.paddingLeft) || 0;
    const paddingRight = parseFloat(trackStyles.paddingRight) || 0;

    let totalCardsWidth = 0;
    cards.forEach((card) => {
      totalCardsWidth += card.offsetWidth;
    });

    const totalGaps = (cards.length - 1) * gap;

    const contentWidth = totalCardsWidth + totalGaps + paddingLeft + paddingRight;

    const maxDrag = Math.min(0, -(contentWidth - containerWidth));

    console.log("📏 Services Bounds:", {
      containerWidth,
      contentWidth,
      totalCardsWidth,
      totalGaps,
      maxDrag,
    });

    return { minX: maxDrag, maxX: 0 };
  };

  const updateBounds = () => {
    bounds = calculateBounds();
    if (draggableInstance) {
      draggableInstance.applyBounds(bounds);
      const currentX = draggableInstance.x;
      if (currentX < bounds.minX) {
        window.gsap.to(track, { x: bounds.minX, duration: 0.3 });
      }
    }
  };

  setTimeout(() => {
    bounds = calculateBounds();

    const calculateCurrentCard = (x) => {
      if (!cards.length) return 1;
      const cardWidth = cards[0].offsetWidth;
      const gap = parseFloat(getComputedStyle(track).gap) || 20;
      const absX = Math.abs(x);
      const currentIndex = Math.min(
        totalCards,
        Math.max(1, Math.floor(absX / (cardWidth + gap)) + 1),
      );
      return currentIndex;
    };

    const updateIndicator = (x) => {
      if (onUpdate) {
        const currentIndex = calculateCurrentCard(x);
        onUpdate(currentIndex, totalCards);
      }
    };

    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    draggableInstance = window.Draggable.create(track, {
      type: "x",
      bounds: bounds,
      inertia: true,
      edgeResistance: 0.65,
      dragResistance: 0,
      throwResistance: isTouchDevice ? 1500 : 2000,
      cursor: "grab",
      activeCursor: "grabbing",
      allowNativeTouchScrolling: false,
      zIndexBoost: false,
      onPress: function () {
        window.gsap.killTweensOf(track);
      },
      onDrag: function () {
        updateIndicator(this.x);
      },
      onDragEnd: function () {
        console.log("🎯 Services Drag finalizado em:", this.x, "/ minX:", bounds.minX);
        updateIndicator(this.x);
      },
      onThrowUpdate: function () {
        updateIndicator(this.x);
      },
      onClick: function (e) {
        if (e.target.closest("button") || e.target.closest("a")) {
          e.target.click?.();
        }
      },
    })[0];

    resizeHandler = () => {
      updateBounds();
    };
    window.addEventListener("resize", resizeHandler);

    const images = track.querySelectorAll("img");
    let loadedImages = 0;
    const totalImages = images.length;

    if (totalImages > 0) {
      images.forEach((img) => {
        if (img.complete) {
          loadedImages++;
          if (loadedImages === totalImages) {
            updateBounds();
          }
        } else {
          img.addEventListener("load", () => {
            loadedImages++;
            if (loadedImages === totalImages) {
              updateBounds();
            }
          });
        }
      });
    }

    setTimeout(updateBounds, 500);
    setTimeout(updateBounds, 1000);
    setTimeout(updateBounds, 2000);

    updateIndicator(0);

    console.log("✅ Services Drag inicializado!", bounds);
  }, 300);

  return {
    get instance() {
      return draggableInstance;
    },
    updateBounds: updateBounds,
    destroy: () => {
      if (draggableInstance) {
        draggableInstance.kill();
      }
      if (resizeHandler) {
        window.removeEventListener("resize", resizeHandler);
      }
    },
  };
}

export function initButtonUnderlineAnimation(buttons) {
  if (!window.gsap || !buttons || buttons.length === 0) return;

  buttons.forEach((button) => {
    button.addEventListener("mouseenter", () => {
      window.gsap.to(button, {
        "--underline-width": "0%",
        duration: 0.35,
        ease: "power2.inOut",
      });
    });

    button.addEventListener("mouseleave", () => {
      window.gsap.to(button, {
        "--underline-width": "100%",
        duration: 0.35,
        ease: "power2.inOut",
      });
    });
  });
}
