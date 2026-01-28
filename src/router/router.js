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

    window.addEventListener("popstate", () => this.handleRouteChange());

    document.addEventListener("click", (e) => {
      const link = e.target.closest("[data-route]");
      if (link) {
        e.preventDefault();
        const path = link.getAttribute("data-route");
        this.navigate(path);
      }
    });

    this.handleRouteChange();
  }

  register(path, componentName) {
    if (path.includes(":")) {
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

  getParams() {
    return this.currentParams;
  }

  navigate(path, skipPreloader = false) {
    if (skipPreloader || this.isInitialNavigation) {
      this.isInitialNavigation = false; // Reset flag
      window.history.pushState({}, "", path);
      this.handleRouteChange();
      return;
    }

    const menuIsOpen = document.querySelector(".dropdown.open");

    if (menuIsOpen) {
      window.dispatchEvent(new CustomEvent("close-menu-for-navigation"));

      setTimeout(() => {
        this.showPreloader(() => {
          window.history.pushState({}, "", path);
          this.handleRouteChange();
        });
      }, 1500);
    } else {
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

    gsap.set(preloader, { display: "flex", height: "100vh" });

    const tl = gsap.timeline({
      onComplete: () => {
        callback();

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

    let componentName = this.routes[path];
    this.currentParams = {};

    if (!componentName) {
      const dynamicMatch = this.matchDynamicRoute(path);
      if (dynamicMatch) {
        componentName = dynamicMatch.componentName;
        this.currentParams = dynamicMatch.params;
      }
    }

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

    if (this.currentPage) {
      this.currentPage.remove();
    }

    const pageElement = document.createElement(componentName);

    if (Object.keys(this.currentParams).length > 0) {
      pageElement.setAttribute("data-params", JSON.stringify(this.currentParams));

      pageElement.routeParams = this.currentParams;
    }

    appRoot.appendChild(pageElement);
    this.currentPage = pageElement;

    window.scrollTo(0, 0);

    if (componentName !== "splash-page") {
      document.body.style.overflow = "visible";
      document.body.style.overflowX = "hidden";
      document.body.style.overflowY = "auto";
    }

    this.reinitializeFeatures();
  }

  reinitializeFeatures() {
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("page-loaded"));
    }, 100);
  }

  navigateFromSplash(path) {
    this.isInitialNavigation = true;
    this.navigate(path, true);
  }
}

export const router = new Router();
