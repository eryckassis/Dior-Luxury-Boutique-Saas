// ============================================================================
// SPA ROUTER - Sistema de Roteamento para Single Page Application
// ============================================================================

class Router {
  constructor() {
    this.routes = {};
    this.dynamicRoutes = []; // Rotas dinâmicas com parâmetros
    this.currentPage = null;
    this.currentParams = {}; // Parâmetros da rota atual
    this.initialized = false;
    this.isInitialNavigation = false; // Flag para primeira navegação do splash
  }

  init() {
    if (this.initialized) return;
    this.initialized = true;

    // Escuta mudanças de URL (botão voltar/avançar)
    window.addEventListener("popstate", () => this.handleRouteChange());

    // Intercepta cliques em links com data-route
    document.addEventListener("click", (e) => {
      const link = e.target.closest("[data-route]");
      if (link) {
        e.preventDefault();
        const path = link.getAttribute("data-route");
        this.navigate(path);
      }
    });

    // Carrega a rota inicial
    this.handleRouteChange();
  }

  register(path, componentName) {
    // Verifica se é uma rota dinâmica (contém :param)
    if (path.includes(":")) {
      // Converte /produto/:id para regex /produto/([^/]+)
      const paramNames = [];
      const regexPattern = path.replace(/:([^/]+)/g, (match, paramName) => {
        paramNames.push(paramName);
        return "([^/]+)";
      });

      this.dynamicRoutes.push({
        regex: new RegExp(`^${regexPattern}$`),
        paramNames,
        componentName,
      });
    } else {
      this.routes[path] = componentName;
    }
  }

  /**
   * Encontra uma rota dinâmica que corresponde ao path
   * Retorna { componentName, params } ou null
   */
  matchDynamicRoute(path) {
    for (const route of this.dynamicRoutes) {
      const match = path.match(route.regex);
      if (match) {
        const params = {};
        route.paramNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });
        return { componentName: route.componentName, params };
      }
    }
    return null;
  }

  /**
   * Retorna os parâmetros da rota atual
   */
  getParams() {
    return this.currentParams;
  }

  navigate(path, skipPreloader = false) {
    // Se for navegação inicial do splash, pula o preloader
    if (skipPreloader || this.isInitialNavigation) {
      this.isInitialNavigation = false; // Reset flag
      window.history.pushState({}, "", path);
      this.handleRouteChange();
      return;
    }

    // Fecha o menu dropdown se estiver aberto antes de navegar
    const menuIsOpen = document.querySelector(".dropdown.open");

    if (menuIsOpen) {
      // Dispara evento para fechar o menu
      window.dispatchEvent(new CustomEvent("close-menu-for-navigation"));

      // Aguarda a animação do menu fechar (1.5s) e então mostra o preloader
      setTimeout(() => {
        this.showPreloader(() => {
          window.history.pushState({}, "", path);
          this.handleRouteChange();
        });
      }, 1500);
    } else {
      // Se o menu não está aberto, mostra preloader imediatamente
      this.showPreloader(() => {
        window.history.pushState({}, "", path);
        this.handleRouteChange();
      });
    }
  }

  showPreloader(callback) {
    const preloader = document.querySelector(".preloader");
    if (!preloader) {
      callback();
      return;
    }

    // Torna o preloader visível
    gsap.set(preloader, { display: "flex", height: "100vh" });

    const tl = gsap.timeline({
      onComplete: () => {
        // Executa o callback (troca de página)
        callback();
        // Aguarda um pouco e esconde o preloader
        setTimeout(() => this.hidePreloader(), 800);
      },
    });

    tl.to(".preloader .text-container", {
      duration: 0,
      visibility: "visible",
      ease: "Power3.easeOut",
    })
      .to(".preloader .imagem-logo svg", {
        duration: 0,
        opacity: 1,
        ease: "Power3.easeOut",
      })
      .to({}, { duration: 0.5 }); // Pausa curta mostrando o logo
  }

  hidePreloader() {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(".preloader", { display: "none" });
        // Libera o scroll do body
        document.body.style.overflow = "visible";
        document.body.style.overflowX = "hidden";
        document.body.style.overflowY = "auto";
      },
    });

    tl.to(".preloader", {
      duration: 1,
      height: "0vh",
      ease: "Power3.easeOut",
    }).to(
      ".preloader .imagem-logo svg",
      {
        opacity: 0,
        duration: 0.3,
      },
      "<",
    );
  }

  async handleRouteChange() {
    const path = window.location.pathname;

    // Primeiro tenta encontrar rota estática exata
    let componentName = this.routes[path];
    this.currentParams = {};

    // Se não encontrou, tenta rotas dinâmicas
    if (!componentName) {
      const dynamicMatch = this.matchDynamicRoute(path);
      if (dynamicMatch) {
        componentName = dynamicMatch.componentName;
        this.currentParams = dynamicMatch.params;
      }
    }

    // Fallback para rota padrão
    if (!componentName) {
      componentName = this.routes["/"];
    }

    if (!componentName) {
      console.error(`Route not found: ${path}`);
      return;
    }

    const appRoot = document.getElementById("app-root");
    if (!appRoot) {
      console.error("app-root element not found");
      return;
    }

    // Remove a página atual
    if (this.currentPage) {
      this.currentPage.remove();
    }

    // Cria e adiciona a nova página
    const pageElement = document.createElement(componentName);

    // Passa os parâmetros para o componente via atributo
    if (Object.keys(this.currentParams).length > 0) {
      pageElement.setAttribute(
        "data-params",
        JSON.stringify(this.currentParams),
      );
      // Também define como propriedade para acesso direto
      pageElement.routeParams = this.currentParams;
    }

    appRoot.appendChild(pageElement);
    this.currentPage = pageElement;

    // Scroll to top
    window.scrollTo(0, 0);

    // Libera o scroll do body (importante para reload/F5 em páginas que não são splash)
    // Splash page tem seu próprio controle de scroll
    if (componentName !== "splash-page") {
      document.body.style.overflow = "visible";
      document.body.style.overflowX = "hidden";
      document.body.style.overflowY = "auto";
    }

    // Reinicializa funcionalidades após carregar página
    this.reinitializeFeatures();
  }

  reinitializeFeatures() {
    // Aguarda um tick para garantir que DOM foi atualizado
    setTimeout(() => {
      // Dispara evento customizado para reinicializar features
      window.dispatchEvent(new CustomEvent("page-loaded"));
    }, 100);
  }

  /**
   * Método para navegação inicial do splash screen
   * Seta flag e navega sem mostrar preloader duplicado
   */
  navigateFromSplash(path) {
    this.isInitialNavigation = true;
    this.navigate(path, true);
  }
}

export const router = new Router();
