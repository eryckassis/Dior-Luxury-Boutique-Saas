// ============================================================================
// SERVICES DRAG CARDS - Módulo reutilizável para carrossel com drag GSAP
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

  setTimeout(() => {
    // Função para calcular bounds corretamente
    const calculateBounds = () => {
      // Usar getBoundingClientRect para pegar a largura VISÍVEL real do container
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      
      // Ler gap do CSS
      const trackStyles = getComputedStyle(track);
      const gap = parseFloat(trackStyles.gap) || 20;
      const paddingLeft = parseFloat(trackStyles.paddingLeft) || 0;
      const paddingRight = parseFloat(trackStyles.paddingRight) || 0;
      
      // Somar largura de todos os cards
      let totalCardsWidth = 0;
      cards.forEach(card => {
        totalCardsWidth += card.offsetWidth;
      });
      
      // Adicionar gaps entre cards
      const totalGaps = (cards.length - 1) * gap;
      
      // Largura total do conteúdo do track
      const contentWidth = totalCardsWidth + totalGaps + paddingLeft + paddingRight;

      // MaxDrag: quanto precisa mover para ver o último card completamente
      // Negativo = quanto pode arrastar para a esquerda
      const maxDrag = -(contentWidth - containerWidth);

      console.log("📏 Services Bounds calculados:", {
        containerWidth,
        contentWidth,
        totalCardsWidth,
        totalGaps,
        paddingLeft,
        paddingRight,
        maxDrag,
        cardCount: cards.length,
        firstCardWidth: cards[0]?.offsetWidth
      });

      return { minX: Math.min(0, maxDrag), maxX: 0 };
    };

    let bounds = calculateBounds();
    
    // Forçar que haja sempre espaço para arrastar se tiver mais de 1 card
    if (bounds.minX >= 0 && cards.length > 1) {
      console.warn("⚠️ Forçando bounds negativos para permitir drag");
      bounds.minX = -(cards.length * 500); // Fallback
    }

    // Função para calcular o card atual visível
    const calculateCurrentCard = (x) => {
      if (!cards.length) return 1;
      const cardWidth = cards[0].offsetWidth;
      const gap = 20;
      const absX = Math.abs(x);
      const currentIndex = Math.min(
        totalCards,
        Math.max(1, Math.floor(absX / (cardWidth + gap)) + 1)
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

    // Criar Draggable (igual PresenteParaElaContent)
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
        console.log("🎯 Services Drag finalizado em:", this.x, "/ minX:", bounds.minX);
        updateIndicator(this.x);
      },
      onThrowUpdate: function () {
        updateIndicator(this.x);
      },
    })[0];

    // Recalcular bounds no resize
    window.addEventListener("resize", () => {
      bounds = calculateBounds();
      if (draggableInstance) {
        draggableInstance.applyBounds(bounds);
      }
    });

    // Atualizar indicador inicial
    updateIndicator(0);

    console.log("✅ Services Drag inicializado! Bounds:", bounds);
  }, 300);

  // Retornar cleanup function
  return {
    get instance() { return draggableInstance; },
    destroy: () => {
      if (draggableInstance) {
        draggableInstance.kill();
      }
    }
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
