// ============================================================================
// SERVICES DRAG CARDS - Módulo reutilizável para carrossel com drag GSAP
// Baseado na implementação funcional do ModaEAcessoriosPage
// ============================================================================

/**
 * Inicializa o drag horizontal em um container de cards
 * @param {Object} options - Configurações do drag
 * @param {HTMLElement} options.container - Container principal (.services-drag-container)
 * @param {HTMLElement} options.track - Track com os cards (.services-drag-track)
 * @param {NodeList} options.cards - Cards arrastáveis (.services-drag-card)
 * @param {Function} options.onUpdate - Callback chamado ao atualizar posição (currentIndex, totalCards)
 * @returns {Object|null} Instância do Draggable ou null se falhar
 */
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

  setTimeout(() => {
    // Função para calcular bounds corretamente
    const calculateBounds = () => {
      const containerWidth = container.offsetWidth;

      if (cards.length === 0) return { minX: 0, maxX: 0 };

      // Calcular largura total do track somando cards + gaps
      const trackStyles = getComputedStyle(track);
      const gap = parseFloat(trackStyles.gap) || 20;
      const paddingLeft = parseFloat(trackStyles.paddingLeft) || 0;
      const paddingRight = parseFloat(trackStyles.paddingRight) || 0;

      // Somar largura de todos os cards
      let totalCardsWidth = 0;
      cards.forEach((card) => {
        totalCardsWidth += card.offsetWidth;
      });

      // Gaps entre cards
      const totalGaps = (cards.length - 1) * gap;

      // Largura total do conteúdo
      const contentWidth =
        totalCardsWidth + totalGaps + paddingLeft + paddingRight;

      // MaxDrag negativo para mover para esquerda
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

    let bounds = calculateBounds();

    // Função para calcular o card atual visível
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

    // Função para atualizar o indicador
    const updateIndicator = (x) => {
      if (onUpdate) {
        const currentIndex = calculateCurrentCard(x);
        onUpdate(currentIndex, totalCards);
      }
    };

    // Criar Draggable
    draggableInstance = window.Draggable.create(track, {
      type: "x",
      bounds: bounds,
      inertia: true,
      edgeResistance: 0.65,
      dragResistance: 0,
      throwResistance: 2000,
      cursor: "grab",
      activeCursor: "grabbing",
      allowNativeTouchScrolling: false,
      onPress: function () {
        window.gsap.killTweensOf(track);
      },
      onDrag: function () {
        updateIndicator(this.x);
      },
      onDragEnd: function () {
        console.log(
          "🎯 Services Drag finalizado em:",
          this.x,
          "/ minX:",
          bounds.minX,
        );
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

    // Recalcular bounds on resize
    resizeHandler = () => {
      bounds = calculateBounds();
      if (draggableInstance) {
        draggableInstance.applyBounds(bounds);
        const currentX = draggableInstance.x;
        if (currentX < bounds.minX) {
          window.gsap.to(track, { x: bounds.minX, duration: 0.3 });
        }
      }
    };
    window.addEventListener("resize", resizeHandler);

    // Recalcular após imagens carregarem
    setTimeout(() => {
      bounds = calculateBounds();
      if (draggableInstance) {
        draggableInstance.applyBounds(bounds);
      }
    }, 500);

    updateIndicator(0);

    console.log("✅ Services Drag inicializado!", bounds);
  }, 300);

  // Retornar cleanup function
  return {
    get instance() {
      return draggableInstance;
    },
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

/**
 * Inicializa animação do botão com linha underline
 * @param {NodeList} buttons - Botões para animar
 */
export function initButtonUnderlineAnimation(buttons) {
  if (!window.gsap || !buttons || buttons.length === 0) return;

  buttons.forEach((button) => {
    // Mouseenter - linha diminui para 0
    button.addEventListener("mouseenter", () => {
      window.gsap.to(button, {
        "--underline-width": "0%",
        duration: 0.35,
        ease: "power2.inOut",
      });
    });

    // Mouseleave - linha volta a 100%
    button.addEventListener("mouseleave", () => {
      window.gsap.to(button, {
        "--underline-width": "100%",
        duration: 0.35,
        ease: "power2.inOut",
      });
    });
  });
}
