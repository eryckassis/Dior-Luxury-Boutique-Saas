// ============================================================================
// PROFILE MENU COMPONENT - Menu lateral de perfil
// ============================================================================

import { router } from "../router/router.js";
import { cartService } from "../services/CartService.js";
import { authService } from "../services/AuthService.js";

export class ProfileMenu extends HTMLElement {
  constructor() {
    super();
    this.isOpen = false;
    this.activeTab = "account";

    // Usa métodos síncronos/cache para inicialização
    this.isAuthenticated = authService.isAuthenticated();
    this.user = authService.getCachedUser();

    this.authListener = ({ user, isAuthenticated }) => {
      this.user = user;
      this.isAuthenticated = isAuthenticated;
      this.updateAccountContent();
    };

    // CartService - pega itens atuais (pode estar vazio inicialmente)
    this.cartItems = cartService.getItems();

    this.cartListener = (items) => {
      this.cartItems = items;
      this.updateCart();
    };
  }

  async connectedCallback() {
    this.render();
    this.initEventListeners();
    this.initButtons();

    // Adiciona listener para mudanças no carrinho
    cartService.addListener(this.cartListener);
    authService.addListener(this.authListener);

    // Aguarda inicialização do carrinho e atualiza se necessário
    await cartService.waitForInit();
    this.cartItems = cartService.getItems();
    this.updateCart();
  }

  disconnectedCallback() {
    // Remove listener do carrinho
    cartService.removeListener(this.cartListener);
    // Removce listener de auth
    authService.removeListener(this.authListener);
  }

  initEventListeners() {
    const closeBtn = this.querySelector(".profile-menu-close");
    const backdrop = this.querySelector(".profile-menu-backdrop");
    const tabs = this.querySelectorAll(".profile-tab");

    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.close());
    }

    if (backdrop) {
      backdrop.addEventListener("click", () => this.close());
    }

    // Tab switching
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const tabType = tab.dataset.tab;
        this.switchTab(tabType);
      });
    });
  }

  initButtons() {
    // Botão de cupom
    const couponBtn = this.querySelector(".bag-coupon-btn");
    if (couponBtn) {
      couponBtn.addEventListener("click", () => this.openCouponModal());
    }

    // Botão de checkout (Comprar)
    const checkoutBtn = this.querySelector(".bag-checkout-btn");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        // Fecha o menu de perfil
        this.close();

        // Aguarda a animação de fechamento do menu
        setTimeout(() => {
          // Navega para a página de finalizar compra
          router.navigate("/finalizar-compra");
        }, 650); // Tempo da animação de fechamento do menu
      });
    }
  }

  switchTab(tabType) {
    this.activeTab = tabType;
    const tabs = this.querySelectorAll(".profile-tab");
    const accountContent = this.querySelector(".profile-account-content");
    const bagContent = this.querySelector(".profile-bag-content");

    // Update active tab
    tabs.forEach((tab) => {
      if (tab.dataset.tab === tabType) {
        tab.classList.add("active");
      } else {
        tab.classList.remove("active");
      }
    });

    // Animate content switch
    if (!window.gsap) {
      accountContent.style.display = tabType === "account" ? "flex" : "none";
      bagContent.style.display = tabType === "bag" ? "flex" : "none";
      return;
    }

    const tl = window.gsap.timeline();

    if (tabType === "account") {
      tl.to(bagContent, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          bagContent.style.display = "none";
          accountContent.style.display = "flex";
        },
      }).fromTo(
        accountContent,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
      );
    } else {
      tl.to(accountContent, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          accountContent.style.display = "none";
          bagContent.style.display = "flex";
        },
      }).fromTo(
        bagContent,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
      );
    }
  }

  async updateQuantity(itemId, newQuantity) {
    await cartService.updateQuantity(itemId, newQuantity);
    this.cartItems = cartService.getItems();
    this.updateCart();
  }

  async removeItem(itemId) {
    await cartService.removeItem(itemId);
    this.cartItems = cartService.getItems();
    this.updateCart();
  }

  updateCart() {
    const bagContent = this.querySelector(".profile-bag-content");
    if (bagContent) {
      // Atualiza os itens do carrinho
      this.cartItems = cartService.getItems();
      bagContent.innerHTML = this.renderBagContent();
      this.initCartEventListeners();
      this.initButtons();

      // Atualiza o badge com a quantidade total
      const badge = this.querySelector(".profile-tab-badge");
      if (badge) {
        const totalItems = cartService.getTotalItems();
        badge.textContent = `(${totalItems})`;
      }
    }
  }

  openCouponModal() {
    const modal = this.querySelector(".coupon-modal");
    const modalBackdrop = this.querySelector(".coupon-modal-backdrop");

    if (!modal || !modalBackdrop) return;

    modalBackdrop.style.display = "block";
    modal.style.display = "block";

    if (window.gsap) {
      window.gsap
        .timeline()
        .to(modalBackdrop, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        })
        .fromTo(
          modal,
          {
            opacity: 0,
            scale: 0.9,
            y: -20,
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.4,
            ease: "back.out(1.7)",
          },
          "-=0.2",
        );
    } else {
      modalBackdrop.style.opacity = "1";
      modal.style.opacity = "1";
    }
  }

  closeCouponModal() {
    const modal = this.querySelector(".coupon-modal");
    const modalBackdrop = this.querySelector(".coupon-modal-backdrop");

    if (!modal || !modalBackdrop) return;

    if (window.gsap) {
      window.gsap
        .timeline({
          onComplete: () => {
            modal.style.display = "none";
            modalBackdrop.style.display = "none";
          },
        })
        .to(modal, {
          opacity: 0,
          scale: 0.9,
          y: -20,
          duration: 0.3,
          ease: "power2.in",
        })
        .to(
          modalBackdrop,
          {
            opacity: 0,
            duration: 0.2,
            ease: "power2.in",
          },
          "-=0.2",
        );
    } else {
      modal.style.display = "none";
      modalBackdrop.style.display = "none";
      modalBackdrop.style.opacity = "0";
      modal.style.opacity = "0";
    }
  }

  async handleLogout() {
    try {
      console.log("🚪 Iniciando logout...");
      await authService.logout();
      console.log("✅ Logout realizado, fechando menu...");
      this.close();
    } catch (error) {
      console.error("❌ Erro no logout:", error);
    }
  }

  validateCoupon() {
    const input = this.querySelector(".coupon-input");
    const errorMsg = this.querySelector(".coupon-error-msg");

    if (!input) return;

    const couponCode = input.value.trim();

    if (!couponCode) {
      errorMsg.textContent = "Por favor, insira um código de cupom";
      errorMsg.style.display = "block";
      return;
    }

    errorMsg.textContent = "Cupom aplicado com sucesso!";
    errorMsg.style.color = "#27ae60";
    errorMsg.style.display = "block";

    setTimeout(() => {
      this.closeCouponModal();
      input.value = "";
      errorMsg.style.display = "none";
      errorMsg.style.color = "#e74c3c";
    }, 1500);
  }

  initCartEventListeners() {
    // Remove buttons
    const removeButtons = this.querySelectorAll(".cart-item-remove");
    removeButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const itemId = e.currentTarget.dataset.itemId;
        // Tenta converter para número, se falhar mantém como string
        const id = isNaN(itemId) ? itemId : parseInt(itemId);
        this.removeItem(id);
      });
    });

    // Quantity selectors
    const quantitySelects = this.querySelectorAll(".cart-item-quantity");
    quantitySelects.forEach((select) => {
      select.addEventListener("change", (e) => {
        const itemId = e.target.dataset.itemId;
        // Tenta converter para número, se falhar mantém como string
        const id = isNaN(itemId) ? itemId : parseInt(itemId);
        const newQuantity = parseInt(e.target.value);
        this.updateQuantity(id, newQuantity);
      });
    });
  }

  async open(initialTab = "account") {
    if (this.isOpen) return;

    // Sincroniza estado real ao abrir (Safety Check) - de forma assíncrona
    const currentAuth = await authService.isAuthenticatedAsync();
    const currentUser = authService.getCachedUser();

    // Se o estado local estiver diferente do real, atualiza!
    if (
      this.isAuthenticated !== currentAuth ||
      JSON.stringify(this.user) !== JSON.stringify(currentUser)
    ) {
      this.isAuthenticated = currentAuth;
      this.user = currentUser;
      this.updateAccountContent();
    }

    this.isOpen = true;
    const menu = this.querySelector(".profile-menu-container");
    const backdrop = this.querySelector(".profile-menu-backdrop");
    const closeBtn = this.querySelector(".profile-menu-close");
    const tabs = this.querySelectorAll(".profile-tab");
    const loginSection = this.querySelector(".profile-login-section");
    const signupSection = this.querySelector(".profile-signup-section");

    // Muda para a aba especificada
    if (initialTab === "bag") {
      this.switchTab("bag");
    } else {
      this.switchTab("account");
    }

    if (!window.gsap) {
      menu.style.transform = "translateX(0)";
      menu.style.visibility = "visible";
      backdrop.style.display = "block";
      backdrop.style.opacity = "1";
      backdrop.classList.add("active");
      return;
    }

    // Previne scroll do body
    document.body.style.overflow = "hidden";

    // Torna visível antes de animar
    menu.style.visibility = "visible";

    backdrop.style.display = "block";
    backdrop.classList.add("active");

    const tl = window.gsap.timeline({
      defaults: { ease: "power3.out" },
    });

    tl
      // Backdrop fade in
      .to(backdrop, {
        opacity: 1,
        duration: 0.4,
      })
      // Menu slide in
      .to(
        menu,
        {
          x: 0,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.3",
      )
      // Close button appear
      .fromTo(
        closeBtn,
        { opacity: 0, scale: 0, rotation: -90 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.4,
          ease: "back.out(1.7)",
        },
        "-=0.3",
      )
      // Tabs stagger
      .fromTo(
        tabs,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" },
        "-=0.4",
      )
      // Login section
      .fromTo(
        loginSection,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.3",
      )
      // Signup section
      .fromTo(
        signupSection,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.4",
      );
  }

  close() {
    if (!this.isOpen) return;

    this.isOpen = false;
    const menu = this.querySelector(".profile-menu-container");
    const backdrop = this.querySelector(".profile-menu-backdrop");
    const closeBtn = this.querySelector(".profile-menu-close");
    const tabs = this.querySelectorAll(".profile-tab");
    const activeContent =
      this.activeTab === "account"
        ? this.querySelector(".profile-account-content")
        : this.querySelector(".profile-bag-content");

    // Restaura scroll do body
    document.body.style.overflow = "auto";
    document.body.style.overflowX = "hidden";
    backdrop.classList.remove("active");

    if (!window.gsap) {
      menu.style.transform = "translateX(100%)";
      menu.style.visibility = "hidden";
      backdrop.style.display = "none";
      backdrop.style.opacity = "0";
      return;
    }

    const tl = window.gsap.timeline({
      defaults: { ease: "power2.in" },
      onComplete: () => {
        backdrop.style.display = "none";
        menu.style.visibility = "hidden";
      },
    });

    tl
      // Content fade out
      .to(activeContent, {
        opacity: 0,
        y: 20,
        duration: 0.3,
      })
      .to(
        tabs,
        {
          opacity: 0,
          y: -10,
          duration: 0.25,
          stagger: 0.05,
        },
        "-=0.25",
      )
      // Close button disappear
      .to(
        closeBtn,
        {
          opacity: 0,
          scale: 0,
          rotation: 90,
          duration: 0.3,
          ease: "back.in(1.7)",
        },
        "-=0.3",
      )
      // Menu slide out
      .to(
        menu,
        {
          x: "100%",
          duration: 0.5,
          ease: "power3.in",
        },
        "-=0.3",
      )
      // Backdrop fade out
      .to(
        backdrop,
        {
          opacity: 0,
          duration: 0.3,
        },
        "-=0.4",
      );
  }

  renderBagContent() {
    const subtotal = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return `
      <div class="profile-bag-header">
        <div class="bag-gift-message">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          <p>Refine seu pedido com a Arte de Presentear Dior e escreva uma mensagem personalizada.</p>
        </div>
      </div>

      <div class="profile-bag-items">
        ${this.cartItems
          .map(
            (item) => `
          <div class="cart-item">
            <div class="cart-item-image">
              <img src="${item.image}" alt="${item.name}" />
            </div>
            <div class="cart-item-info">
              <h3 class="cart-item-name">${item.name}</h3>
              <p class="cart-item-volume">Volume: ${item.volume}</p>
              <button class="cart-item-remove" data-item-id="${item.id}">Remover</button>
            </div>
            <div class="cart-item-right">
              <p class="cart-item-price">R$ ${item.price.toFixed(2).replace(".", ",")}</p>
              <div class="cart-item-quantity-wrapper">
                <label class="quantity-label">Quantidade</label>
                <select class="cart-item-quantity" data-item-id="${item.id}">
                  ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                    .map(
                      (num) => `
                    <option value="${num}" ${
                      item.quantity === num ? "selected" : ""
                    }>${num}</option>
                  `,
                    )
                    .join("")}
                </select>
              </div>
            </div>
          </div>
        `,
          )
          .join("")}
      </div>

      <div class="profile-bag-footer">
        <div class="bag-subtotal">
          <span class="subtotal-label">Subtotal:</span>
          <span class="subtotal-value">R$ ${subtotal.toFixed(2).replace(".", ",")}</span>
        </div>

        <div class="bag-installment">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>10x sem juros com parcelas mínimas de R$ 100.</span>
        </div>

        <button class="bag-coupon-btn">
          Adicionar Cupom
          <span>+</span>
        </button>

        <button class="bag-checkout-btn">
          Comprar - R$ ${subtotal.toFixed(2).replace(".", ",")}
        </button>
      </div>
    `;
  }

  renderLoginContent() {
    return `
      <div class="profile-login-section">
        <h2 class="profile-login-title">Login</h2>
        <p class="profile-login-subtitle">Para acessar a sua conta</p>
        <button class="profile-login-btn">Acessar</button>
      </div>
      
      <div class="profile-signup-section">
        <h3 class="profile-signup-title">Sem conta ?</h3>
        <p class="profile-signup-subtitle">Para fazer login em sua conta</p>
        <button class="profile-signup-btn">Crie a sua conta aqui</button>
      </div>
    `;
  }

  renderLoggedInContent() {
    const userName = this.user?.user_metadata?.name || this.user?.email?.split("@")[0] || "Usuário";

    return `
    <div class="profile-user-welcome">
      <span class="profile-welcome-label">Welcome</span>
      <h2 class="profile-user-name">${userName}</h2>
    </div>

    <div class="profile-menu-sections">
      <div class="profile-menu-group">
        <h3 class="profile-group-title">Profile</h3>
        <a href="/minha-conta/dados" class="profile-menu-link" data-route="/minha-conta/dados">Meus dados pessoais</a>
        <a href="/minha-conta/enderecos" class="profile-menu-link" data-route="/minha-conta/enderecos">Meus endereços</a>
      </div>

      <div class="profile-menu-group">
        <h3 class="profile-group-title">Orders</h3>
        <a href="/minha-conta/pedidos" class="profile-menu-link" data-route="/minha-conta/pedidos">Meus Pedidos</a>
        <a href="/minha-conta/cartoes" class="profile-menu-link" data-route="/minha-conta/cartoes">Meus Cartões</a>
      </div>
    </div>

    <div class="profile-logout-section">
      <button class="profile-logout-btn">Logout</button>
    </div>
  `;
  }

  updateAccountContent() {
    const accountContent = this.querySelector(".profile-account-content");
    if (accountContent) {
      accountContent.innerHTML = this.isAuthenticated
        ? this.renderLoggedInContent()
        : this.renderLoginContent();

      this.initAccountButtons();
    }
  }

  initAccountButtons() {
    const loginBtn = this.querySelector(".profile-login-btn");
    const signupBtn = this.querySelector(".profile-signup-btn");
    const logoutBtn = this.querySelector(".profile-logout-btn");

    console.log("🔧 initAccountButtons - logoutBtn encontrado:", !!logoutBtn);

    if (loginBtn) {
      loginBtn.addEventListener("click", () => {
        this.close();
        setTimeout(() => router.navigate("/login"), 650);
      });
    }

    if (signupBtn) {
      signupBtn.addEventListener("click", () => {
        this.close();
        setTimeout(() => router.navigate("/register"), 650);
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        console.log("🖱️ Botão logout clicado!");
        this.handleLogout();
      });
    }
  }

  render() {
    this.innerHTML = `
      <!-- Backdrop -->
      <div class="profile-menu-backdrop"></div>

      <!-- Menu Container -->
      <div class="profile-menu-container">
        <!-- Close Button -->
        <button class="profile-menu-close" aria-label="Fechar menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <!-- Tabs -->
        <div class="profile-menu-tabs">
          <button class="profile-tab active" data-tab="account">Minha Conta</button>
          <button class="profile-tab" data-tab="bag">
            Sacola
            <span class="profile-tab-badge">(${this.cartItems.length})</span>
          </button>
        </div>

        <!-- Account Content -->
        <div class="profile-menu-content profile-account-content">
          ${this.isAuthenticated ? this.renderLoggedInContent() : this.renderLoginContent()}
        </div>

        <!-- Bag Content -->
        <div class="profile-menu-content profile-bag-content" style="display: none;">
          ${this.renderBagContent()}
        </div>
      </div>

      <!-- Coupon Modal -->
      <div class="coupon-modal-backdrop"></div>
      <div class="coupon-modal">
        <button class="coupon-modal-close" onclick="this.getRootNode().host.closeCouponModal()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h2 class="coupon-modal-title">Adicionar Cupom</h2>
        
        <input 
          type="text" 
          class="coupon-input" 
          placeholder="Insira o código do cupom"
        />

        <p class="coupon-info-text">Regras e restrições podem ser aplicadas.</p>

        <button class="coupon-validate-btn" onclick="this.getRootNode().host.validateCoupon()">
          Validar
        </button>

        <p class="coupon-error-msg" style="display: none;"></p>
      </div>
    `;

    // Inicializa event listeners do carrinho após render
    setTimeout(() => {
      this.initCartEventListeners();
      this.initCouponModalListeners();
      this.initAccountButtons();
    }, 0);
  }

  initCouponModalListeners() {
    const modalBackdrop = this.querySelector(".coupon-modal-backdrop");
    const closeBtn = this.querySelector(".coupon-modal-close");
    const validateBtn = this.querySelector(".coupon-validate-btn");
    const input = this.querySelector(".coupon-input");

    if (modalBackdrop) {
      modalBackdrop.addEventListener("click", () => this.closeCouponModal());
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.closeCouponModal());
    }

    if (validateBtn) {
      validateBtn.addEventListener("click", () => this.validateCoupon());
    }

    if (input) {
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.validateCoupon();
        }
      });
    }
  }
}

customElements.define("profile-menu", ProfileMenu);
