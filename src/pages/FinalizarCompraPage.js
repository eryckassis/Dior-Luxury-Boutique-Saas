// ============================================================================
// FINALIZAR COMPRA PAGE - Página de checkout
// ============================================================================

import "../components/AppNavigation.js";
import "../components/FooterSection.js";
import { cartService } from "../services/CartService.js";
import { checkoutService } from "../services/CheckoutService.js";

export class FinalizarCompraPage extends HTMLElement {
  constructor() {
    super();
    // Inicializa com array vazio - será preenchido após init
    this.cartItems = [];

    // Listener para atualizar quando o carrinho mudar
    this.cartListener = (items) => {
      this.cartItems = items;
      this.updateCartDisplay();
    };
  }

  async connectedCallback() {
    // Aguarda inicialização do carrinho
    await cartService.waitForInit();

    // Inicializa com itens do carrinho (ou padrão se vazio)
    cartService.initializeDefaultItems();
    this.cartItems = cartService.getItems();

    this.render();

    // Inicializa controles após o render
    requestAnimationFrame(() => {
      this.initAnimations();
      this.initCartControls();
      this.initPaymentModal();
    });

    // Adiciona listener para mudanças no carrinho
    cartService.addListener(this.cartListener);
  }

  disconnectedCallback() {
    // Cleanup animations
    if (this.animations) {
      this.animations.forEach((anim) => anim.kill());
    }

    // Remove listener do carrinho
    cartService.removeListener(this.cartListener);
  }

  calculateSubtotal() {
    return this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }

  initAnimations() {
    requestAnimationFrame(() => {
      if (!window.gsap) return;

      this.animations = [];

      // Animação de entrada do título
      const titleTl = window.gsap.timeline();
      titleTl
        .from(".checkout-hero-title", {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        })
        .from(
          ".checkout-hero-subtitle",
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.6",
        );

      this.animations.push(titleTl);

      // Animação do conteúdo principal
      window.gsap.from(".checkout-container", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.3,
      });
    });
  }

  initCartControls() {
    // Botões de aumentar quantidade
    const plusButtons = this.querySelectorAll(".quantity-plus");
    plusButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const itemId = parseInt(e.currentTarget.dataset.itemId);
        this.updateQuantity(itemId, 1);
      });
    });

    // Botões de diminuir quantidade
    const minusButtons = this.querySelectorAll(".quantity-minus");
    minusButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const itemId = parseInt(e.currentTarget.dataset.itemId);
        this.updateQuantity(itemId, -1);
      });
    });

    // Botões de remover item
    const removeButtons = this.querySelectorAll(".cart-remove-btn");
    removeButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const itemId = parseInt(e.currentTarget.dataset.itemId);
        this.removeItem(itemId);
      });
    });

    // Inicializa validação do formulário de contato
    this.initContactFormValidation();

    // Inicializa funcionalidade de presente
    this.initGiftOptions();
  }

  initGiftOptions() {
    // Toggle da mensagem de presente
    const messageToggle = this.querySelector(".gift-message-toggle");
    const messageContent = this.querySelector(".gift-message-content");

    if (messageToggle && messageContent) {
      messageToggle.addEventListener("click", () => {
        const isVisible = messageContent.style.display !== "none";

        if (isVisible) {
          messageContent.style.display = "none";
          messageToggle.classList.remove("active");
        } else {
          messageContent.style.display = "block";
          messageToggle.classList.add("active");
        }
      });
    }

    // Contador de caracteres
    const giftMessageInput = this.querySelector("#giftMessage");
    const characterCount = this.querySelector(".character-count");

    if (giftMessageInput && characterCount) {
      giftMessageInput.addEventListener("input", (e) => {
        const length = e.target.value.length;
        characterCount.textContent = length;

        // Salva no checkoutService
        checkoutService.updateField("giftMessage", e.target.value);
      });
    }

    // Salvar seleção de embalagem
    const giftWrappingInputs = this.querySelectorAll(
      'input[name="giftWrapping"]',
    );
    giftWrappingInputs.forEach((input) => {
      input.addEventListener("change", (e) => {
        checkoutService.updateField("giftWrapping", e.target.value);
      });
    });

    // Botão Validar
    const validateBtn = this.querySelector(".validate-message-btn");
    if (validateBtn) {
      validateBtn.addEventListener("click", () => {
        const message = giftMessageInput?.value || "";
        if (message.trim()) {
          alert("Mensagem de presente validada com sucesso! ✓");
          messageToggle.click(); // Fecha o accordion
        } else {
          alert("Por favor, escreva uma mensagem antes de validar.");
        }
      });
    }

    // Carrega dados salvos
    const savedData = checkoutService.getData();
    if (savedData.giftMessage && giftMessageInput) {
      giftMessageInput.value = savedData.giftMessage;
      characterCount.textContent = savedData.giftMessage.length;
    }
    if (savedData.giftWrapping) {
      const savedWrapping = this.querySelector(
        `input[name="giftWrapping"][value="${savedData.giftWrapping}"]`,
      );
      if (savedWrapping) savedWrapping.checked = true;
    }
  }

  initContactFormValidation() {
    // Carrega dados salvos do localStorage
    this.loadCheckoutData();

    // E-mail
    const emailInput = this.querySelector("#email");
    if (emailInput) {
      emailInput.addEventListener("input", (e) => {
        this.validateEmail(e.target.value, e.target);
        checkoutService.updateField("email", e.target.value);
        this.validateContactForm();
      });
      emailInput.addEventListener("blur", (e) => {
        this.validateEmail(e.target.value, e.target);
      });
    }

    // Nome e Sobrenome
    const firstNameInput = this.querySelector("#firstName");
    const lastNameInput = this.querySelector("#lastName");
    if (firstNameInput) {
      firstNameInput.addEventListener("input", (e) => {
        checkoutService.updateField("firstName", e.target.value);
        this.validateContactForm();
      });
    }
    if (lastNameInput) {
      lastNameInput.addEventListener("input", (e) => {
        checkoutService.updateField("lastName", e.target.value);
        this.validateContactForm();
      });
    }

    // Endereço
    const addressInput = this.querySelector("#address");
    if (addressInput) {
      addressInput.addEventListener("input", (e) => {
        checkoutService.updateField("address", e.target.value);
        this.validateContactForm();
      });
    }

    // Complemento
    const complementInput = this.querySelector("#complement");
    if (complementInput) {
      complementInput.addEventListener("input", (e) => {
        checkoutService.updateField("complement", e.target.value);
      });
    }

    // Cidade
    const cityInput = this.querySelector("#city");
    if (cityInput) {
      cityInput.addEventListener("input", (e) => {
        checkoutService.updateField("city", e.target.value);
        this.validateContactForm();
      });
    }

    // Estado
    const stateInput = this.querySelector("#state");
    if (stateInput) {
      stateInput.addEventListener("change", (e) => {
        checkoutService.updateField("state", e.target.value);
        this.validateContactForm();
      });
    }

    // CEP - Validação e formatação
    const zipCodeInput = this.querySelector("#zipCode");
    if (zipCodeInput) {
      zipCodeInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "");
        value = value.substring(0, 8);

        // Formata CEP: 00000-000
        if (value.length > 5) {
          value = value.replace(/(\d{5})(\d{1,3})/, "$1-$2");
        }

        e.target.value = value;
        checkoutService.updateField("zipCode", value);
        this.validateZipCode(value.replace(/\D/g, ""), e.target);
        this.validateContactForm();
      });
    }

    // Telefone - Validação e formatação
    const phoneInput = this.querySelector("#phone");
    if (phoneInput) {
      phoneInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "");
        value = value.substring(0, 11);

        // Formata Telefone: (00) 00000-0000 ou (00) 0000-0000
        if (value.length > 10) {
          value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
        } else if (value.length > 6) {
          value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
        } else if (value.length > 2) {
          value = value.replace(/(\d{2})(\d{0,5})/, "($1) $2");
        }

        e.target.value = value;
        checkoutService.updateField("phone", value);
        this.validatePhone(value.replace(/\D/g, ""), e.target);
        this.validateContactForm();
      });
    }

    // Validação inicial ao carregar
    this.validateContactForm();
  }

  loadCheckoutData() {
    // Carrega dados salvos e preenche os campos
    const data = checkoutService.getData();

    if (data.email) {
      const emailInput = this.querySelector("#email");
      if (emailInput) emailInput.value = data.email;
    }
    if (data.firstName) {
      const firstNameInput = this.querySelector("#firstName");
      if (firstNameInput) firstNameInput.value = data.firstName;
    }
    if (data.lastName) {
      const lastNameInput = this.querySelector("#lastName");
      if (lastNameInput) lastNameInput.value = data.lastName;
    }
    if (data.address) {
      const addressInput = this.querySelector("#address");
      if (addressInput) addressInput.value = data.address;
    }
    if (data.complement) {
      const complementInput = this.querySelector("#complement");
      if (complementInput) complementInput.value = data.complement;
    }
    if (data.city) {
      const cityInput = this.querySelector("#city");
      if (cityInput) cityInput.value = data.city;
    }
    if (data.state) {
      const stateInput = this.querySelector("#state");
      if (stateInput) stateInput.value = data.state;
    }
    if (data.zipCode) {
      const zipCodeInput = this.querySelector("#zipCode");
      if (zipCodeInput) zipCodeInput.value = data.zipCode;
    }
    if (data.phone) {
      const phoneInput = this.querySelector("#phone");
      if (phoneInput) phoneInput.value = data.phone;
    }
  }

  validateEmail(email, inputElement) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);

    if (email.length > 0) {
      if (isValid) {
        inputElement.classList.remove("invalid");
        inputElement.classList.add("valid");
      } else {
        inputElement.classList.add("invalid");
        inputElement.classList.remove("valid");
      }
    } else {
      inputElement.classList.remove("valid", "invalid");
    }

    return isValid;
  }

  validateZipCode(zipCode, inputElement) {
    const isValid = zipCode.length === 8;

    if (zipCode.length > 0) {
      if (isValid) {
        inputElement.classList.remove("invalid");
        inputElement.classList.add("valid");
      } else {
        inputElement.classList.add("invalid");
        inputElement.classList.remove("valid");
      }
    } else {
      inputElement.classList.remove("valid", "invalid");
    }

    return isValid;
  }

  validatePhone(phone, inputElement) {
    // Aceita 10 dígitos (fixo) ou 11 dígitos (celular)
    const isValid = phone.length === 10 || phone.length === 11;

    if (phone.length > 0) {
      if (isValid) {
        inputElement.classList.remove("invalid");
        inputElement.classList.add("valid");
      } else {
        inputElement.classList.add("invalid");
        inputElement.classList.remove("valid");
      }
    } else {
      inputElement.classList.remove("valid", "invalid");
    }

    return isValid;
  }

  validateContactForm() {
    const email = this.querySelector("#email")?.value.trim() || "";
    const firstName = this.querySelector("#firstName")?.value.trim() || "";
    const lastName = this.querySelector("#lastName")?.value.trim() || "";
    const address = this.querySelector("#address")?.value.trim() || "";
    const city = this.querySelector("#city")?.value.trim() || "";
    const state = this.querySelector("#state")?.value || "";
    const zipCode =
      this.querySelector("#zipCode")?.value.replace(/\D/g, "") || "";
    const phone = this.querySelector("#phone")?.value.replace(/\D/g, "") || "";

    const isEmailValid = this.validateEmail(
      email,
      this.querySelector("#email"),
    );
    const isZipCodeValid = zipCode.length === 8;
    const isPhoneValid = phone.length === 10 || phone.length === 11;

    const isContactFormValid =
      isEmailValid &&
      firstName.length >= 2 &&
      lastName.length >= 2 &&
      address.length >= 5 &&
      city.length >= 2 &&
      state !== "" &&
      isZipCodeValid &&
      isPhoneValid;

    const checkoutBtn = this.querySelector(".checkout-submit-btn");
    if (checkoutBtn) {
      if (isContactFormValid) {
        checkoutBtn.disabled = false;
        checkoutBtn.classList.remove("disabled");
      } else {
        checkoutBtn.disabled = true;
        checkoutBtn.classList.add("disabled");
      }
    }

    return isContactFormValid;
  }

  initPaymentModal() {
    const checkoutBtn = this.querySelector(".checkout-submit-btn");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => this.openPaymentModal());
    }

    // Event listeners do modal
    const modalBackdrop = this.querySelector(".payment-modal-backdrop");
    const closeBtn = this.querySelector(".payment-modal-close");

    if (modalBackdrop) {
      modalBackdrop.addEventListener("click", () => this.closePaymentModal());
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.closePaymentModal());
    }

    // Seleção de bandeira de cartão
    const cardBrandInputs = this.querySelectorAll('input[name="card-brand"]');
    cardBrandInputs.forEach((input) => {
      input.addEventListener("change", (e) => {
        this.selectCardBrand(e.target.value);
      });
    });

    // Seleção de método de pagamento
    const paymentMethodInputs = this.querySelectorAll(
      'input[name="payment-method"]',
    );
    paymentMethodInputs.forEach((input) => {
      input.addEventListener("change", (e) => {
        this.switchPaymentMethod(e.target.value);
      });
    });

    // Validação em tempo real dos campos
    this.initFormValidation();

    // Submit do formulário
    const paymentForm = this.querySelector(".payment-modal-form");
    if (paymentForm) {
      paymentForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.processPayment();
      });
    }
  }

  initFormValidation() {
    // Card Number - Validação e formatação
    const cardNumberInput = this.querySelector("#card-number");
    if (cardNumberInput) {
      cardNumberInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\s/g, "");
        value = value.replace(/\D/g, "");
        value = value.substring(0, 16);

        // Formata com espaços a cada 4 dígitos
        const formatted = value.match(/.{1,4}/g)?.join(" ") || value;
        e.target.value = formatted;

        // Valida número do cartão
        this.validateCardNumber(value, e.target);
        this.validateForm();
      });
    }

    // CPF - Validação e formatação
    const cpfInput = this.querySelector("#cpf");
    if (cpfInput) {
      cpfInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "");
        value = value.substring(0, 11);

        // Formata CPF: 000.000.000-00
        if (value.length > 9) {
          value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
        } else if (value.length > 6) {
          value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
        } else if (value.length > 3) {
          value = value.replace(/(\d{3})(\d{1,3})/, "$1.$2");
        }

        e.target.value = value;
        this.validateCPF(value.replace(/\D/g, ""), e.target);
        this.validateForm();
      });
    }

    // CVV - Validação
    const cvvInput = this.querySelector("#cvv");
    if (cvvInput) {
      cvvInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "");
        const maxLength = this.getSelectedCardBrand() === "amex" ? 4 : 3;
        value = value.substring(0, maxLength);
        e.target.value = value;

        this.validateCVV(value, e.target);
        this.validateForm();
      });
    }

    // Card Name
    const cardNameInput = this.querySelector("#card-name");
    if (cardNameInput) {
      cardNameInput.addEventListener("input", () => this.validateForm());
    }

    // Expiry Month/Year
    const expiryMonth = this.querySelector("#expiry-month");
    const expiryYear = this.querySelector("#expiry-year");
    if (expiryMonth) {
      expiryMonth.addEventListener("change", () => this.validateForm());
    }
    if (expiryYear) {
      expiryYear.addEventListener("change", () => this.validateForm());
    }

    // Installments
    const installments = this.querySelector("#installments");
    if (installments) {
      installments.addEventListener("change", () => this.validateForm());
    }
  }

  validateCardNumber(cardNumber, inputElement) {
    // Algoritmo de Luhn para validar número do cartão
    const isValid = this.luhnCheck(cardNumber);

    if (cardNumber.length === 16) {
      if (isValid) {
        inputElement.classList.remove("invalid");
        inputElement.classList.add("valid");
      } else {
        inputElement.classList.add("invalid");
        inputElement.classList.remove("valid");
      }
    } else if (cardNumber.length > 0) {
      inputElement.classList.remove("valid", "invalid");
    }

    return isValid && cardNumber.length === 16;
  }

  luhnCheck(cardNumber) {
    let sum = 0;
    let isEven = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i), 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  validateCPF(cpf, inputElement) {
    if (cpf.length !== 11) {
      if (cpf.length > 0) {
        inputElement.classList.add("invalid");
        inputElement.classList.remove("valid");
      }
      return false;
    }

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) {
      inputElement.classList.add("invalid");
      inputElement.classList.remove("valid");
      return false;
    }

    // Validação dos dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let checkDigit = 11 - (sum % 11);
    if (checkDigit >= 10) checkDigit = 0;

    if (checkDigit !== parseInt(cpf.charAt(9))) {
      inputElement.classList.add("invalid");
      inputElement.classList.remove("valid");
      return false;
    }

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    checkDigit = 11 - (sum % 11);
    if (checkDigit >= 10) checkDigit = 0;

    if (checkDigit !== parseInt(cpf.charAt(10))) {
      inputElement.classList.add("invalid");
      inputElement.classList.remove("valid");
      return false;
    }

    inputElement.classList.remove("invalid");
    inputElement.classList.add("valid");
    return true;
  }

  validateCVV(cvv, inputElement) {
    const maxLength = this.getSelectedCardBrand() === "amex" ? 4 : 3;
    const isValid = cvv.length === maxLength;

    if (cvv.length > 0) {
      if (isValid) {
        inputElement.classList.remove("invalid");
        inputElement.classList.add("valid");
      } else {
        inputElement.classList.add("invalid");
        inputElement.classList.remove("valid");
      }
    }

    return isValid;
  }

  getSelectedCardBrand() {
    const selected = this.querySelector('input[name="card-brand"]:checked');
    return selected ? selected.value : "visa";
  }

  validateForm() {
    const cardNumber =
      this.querySelector("#card-number")?.value.replace(/\s/g, "") || "";
    const cardName = this.querySelector("#card-name")?.value.trim() || "";
    const expiryMonth = this.querySelector("#expiry-month")?.value || "";
    const expiryYear = this.querySelector("#expiry-year")?.value || "";
    const cvv = this.querySelector("#cvv")?.value || "";
    const cpf = this.querySelector("#cpf")?.value.replace(/\D/g, "") || "";
    const installments = this.querySelector("#installments")?.value || "";

    const isCardNumberValid =
      this.luhnCheck(cardNumber) && cardNumber.length === 16;
    const isCPFValid = this.validateCPF(cpf, this.querySelector("#cpf"));
    const maxCVVLength = this.getSelectedCardBrand() === "amex" ? 4 : 3;
    const isCVVValid = cvv.length === maxCVVLength;
    const isFormValid =
      isCardNumberValid &&
      cardName.length >= 3 &&
      expiryMonth !== "" &&
      expiryYear !== "" &&
      isCVVValid &&
      isCPFValid &&
      installments !== "";

    const submitBtn = this.querySelector(".payment-submit-btn");
    if (submitBtn) {
      if (isFormValid) {
        submitBtn.disabled = false;
        submitBtn.classList.remove("disabled");
      } else {
        submitBtn.disabled = true;
        submitBtn.classList.add("disabled");
      }
    }

    return isFormValid;
  }

  encryptAddress(address) {
    // Criptografa o endereço mostrando apenas partes
    const parts = address.split(",");
    if (parts.length >= 2) {
      const street = parts[0].trim();
      const rest = parts.slice(1).join(",").trim();

      // Mostra primeiras 3 letras e últimas 3 letras da rua
      const streetEncrypted =
        street.substring(0, 3) +
        "***".repeat(Math.max(1, Math.floor(street.length / 5))) +
        " " +
        street.substring(street.length - 3);

      // Criptografa o resto também
      const restEncrypted = rest.substring(0, 3) + "***";

      return `${streetEncrypted}, ${restEncrypted}`;
    }

    return (
      address.substring(0, 3) +
      "*** ***" +
      address.substring(address.length - 3)
    );
  }

  openPaymentModal() {
    const modal = this.querySelector(".payment-modal");
    const backdrop = this.querySelector(".payment-modal-backdrop");

    if (!modal || !backdrop) {
      console.log("Modal ou backdrop não encontrados");
      return;
    }

    // Adiciona classes active
    backdrop.classList.add("active");
    modal.classList.add("active");

    document.body.style.overflow = "hidden";

    // Desabilita o botão inicialmente
    const submitBtn = this.querySelector(".payment-submit-btn");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add("disabled");
    }

    // Obtém endereço real do checkoutService e criptografa
    const billingAddressLabel = this.querySelector(
      'label[for="billing-address"]',
    );
    if (billingAddressLabel) {
      const realAddress = checkoutService.getBillingAddress();

      if (realAddress && realAddress.trim() !== "") {
        const encryptedAddress = this.encryptAddress(realAddress);
        billingAddressLabel.innerHTML = `O endereço da fatura do cartão é ${encryptedAddress}`;
      } else {
        billingAddressLabel.innerHTML = `Por favor, preencha o endereço de entrega`;
      }
    }

    // Animação do backdrop e modal com GSAP
    if (window.gsap) {
      window.gsap.fromTo(
        backdrop,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" },
      );

      // Animação do scrollbar quando o modal abre
      this.animateScrollbar(modal);
    }
  }

  animateScrollbar(modal) {
    if (!window.gsap) return;

    // Cria um observador para detectar quando há scroll
    const hasScroll = modal.scrollHeight > modal.clientHeight;

    if (hasScroll) {
      // Animação pulsante sutil do scrollbar para chamar atenção
      window.gsap.to(modal, {
        "--scrollbar-opacity": 1,
        duration: 0.5,
        ease: "power2.out",
        delay: 0.3,
      });

      // Pulso sutil no scrollbar para indicar que há mais conteúdo
      window.gsap.fromTo(
        modal,
        { "--scrollbar-scale": 1 },
        {
          "--scrollbar-scale": 1.2,
          duration: 0.6,
          ease: "power1.inOut",
          yoyo: true,
          repeat: 2,
          delay: 0.5,
        },
      );

      // Listener para fazer o scrollbar piscar levemente ao rolar
      let scrollTimeout;
      modal.addEventListener("scroll", () => {
        clearTimeout(scrollTimeout);

        window.gsap.to(modal, {
          "--scrollbar-opacity": 1,
          duration: 0.2,
          ease: "power2.out",
        });

        scrollTimeout = setTimeout(() => {
          window.gsap.to(modal, {
            "--scrollbar-opacity": 0.7,
            duration: 0.4,
            ease: "power2.out",
          });
        }, 1000);
      });
    }
  }

  closePaymentModal() {
    const modal = this.querySelector(".payment-modal");
    const backdrop = this.querySelector(".payment-modal-backdrop");

    if (!modal || !backdrop) return;

    // Remove classes active para trigger da animação CSS
    modal.classList.remove("active");
    backdrop.classList.remove("active");

    // GSAP para suavizar ainda mais
    if (window.gsap) {
      window.gsap.to(backdrop, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          document.body.style.overflow = "auto";
        },
      });
    } else {
      setTimeout(() => {
        document.body.style.overflow = "auto";
      }, 400);
    }
  }

  selectCardBrand(brand) {
    // Visual feedback para bandeira selecionada
    const allBrands = this.querySelectorAll(".card-brand-option");
    allBrands.forEach((option) => {
      option.classList.remove("selected");
    });

    const selectedBrand = this.querySelector(
      `input[value="${brand}"]`,
    )?.closest(".card-brand-option");
    if (selectedBrand) {
      selectedBrand.classList.add("selected");
    }
  }

  switchPaymentMethod(method) {
    const creditCardSection = this.querySelector(".credit-card-section");
    const pixSection = this.querySelector(".pix-section");

    if (method === "credit") {
      creditCardSection.style.display = "block";
      if (pixSection) pixSection.style.display = "none";
    } else if (method === "pix") {
      creditCardSection.style.display = "none";
      if (pixSection) pixSection.style.display = "block";
    }
  }

  processPayment() {
    // Valida o formulário antes de processar
    if (!this.validateForm()) {
      alert("Por favor, preencha todos os campos corretamente.");
      return;
    }

    // Coleta os dados do formulário de pagamento
    const paymentData = {
      cardNumber: this.querySelector("#card-number")?.value,
      cardName: this.querySelector("#card-name")?.value,
      expiryMonth: this.querySelector("#expiry-month")?.value,
      expiryYear: this.querySelector("#expiry-year")?.value,
      cvv: this.querySelector("#cvv")?.value,
      cpf: this.querySelector("#cpf")?.value,
      installments: this.querySelector("#installments")?.value,
      cardBrand: this.getSelectedCardBrand(),
    };

    // Coleta dados do checkout (endereço, contato, etc)
    const checkoutData = checkoutService.getData();

    // Combina todos os dados do pedido
    const orderData = {
      payment: paymentData,
      customer: checkoutData,
      cart: cartService.getItems(),
      total: cartService.getTotal(),
    };

    console.log("Processando pagamento...", orderData);

    // Animação de sucesso
    const submitBtn = this.querySelector(".payment-submit-btn");
    if (submitBtn) {
      submitBtn.textContent = "Processando...";
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = "✓ Pedido Confirmado!";
        setTimeout(() => {
          alert("Pedido finalizado com sucesso! ✓");
          this.closePaymentModal();
          submitBtn.textContent = "Finalizar Pedido";

          // Limpa dados após confirmação (opcional)
          // checkoutService.clearData();
          // cartService.clearCart();
        }, 1000);
      }, 1500);
    }
  }

  updateQuantity(itemId, change) {
    // Atualiza no cartService
    if (change > 0) {
      cartService.incrementQuantity(itemId);
    } else {
      cartService.decrementQuantity(itemId);
    }

    // Atualiza a UI
    this.cartItems = cartService.getItems();
    const item = this.cartItems.find((i) => i.id === itemId);

    if (item) {
      const row = this.querySelector(`[data-item-id="${itemId}"]`)?.closest(
        ".cart-table-row",
      );
      if (row) {
        const quantityInput = row.querySelector(".quantity-input");
        const totalCell = row.querySelector(".cart-total-cell");

        if (quantityInput) {
          quantityInput.value = item.quantity;
        }

        if (totalCell && !totalCell.classList.contains("cart-free-text")) {
          const itemTotal = (item.price * item.quantity)
            .toFixed(2)
            .replace(".", ",");
          totalCell.textContent = `R$ ${itemTotal}`;
        }
      }

      // Atualiza os totais
      this.updateTotals();
    }
  }

  updateTotals() {
    // Recalcula o subtotal
    const subtotal = cartService.getTotal();
    const total = subtotal; // Como a entrega é grátis, total = subtotal

    // Atualiza o subtotal na UI
    const subtotalElements = this.querySelectorAll(
      ".summary-row:first-child span:last-child",
    );
    if (subtotalElements.length > 0) {
      subtotalElements[0].textContent = `R$ ${subtotal
        .toFixed(2)
        .replace(".", ",")}`;
    }

    // Atualiza o total na UI
    const totalElements = this.querySelectorAll(
      ".summary-total span:last-child",
    );
    if (totalElements.length > 0) {
      totalElements[0].textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
    }
  }

  removeItem(itemId) {
    // Remove a linha com animação suave
    const row = this.querySelector(`[data-item-id="${itemId}"]`)?.closest(
      ".cart-table-row",
    );

    if (row) {
      if (window.gsap) {
        window.gsap.to(row, {
          opacity: 0,
          height: 0,
          padding: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            row.remove();
            // Remove do cartService após a animação
            cartService.removeItem(itemId);
            this.cartItems = cartService.getItems();
            // Atualiza os totais após remover
            this.updateTotals();
          },
        });
      } else {
        row.remove();
        cartService.removeItem(itemId);
        this.cartItems = cartService.getItems();
        // Atualiza os totais após remover
        this.updateTotals();
      }
    }
  }

  updateCartDisplay() {
    // Atualiza apenas a seção do carrinho sem re-renderizar tudo
    const cartTableItems = this.querySelector(".cart-table-items");
    if (cartTableItems && this.cartItems) {
      // Re-renderiza apenas os itens do carrinho
      const itemsHTML = this.cartItems
        .map(
          (item) => `
        <div class="cart-table-row">
          <div class="cart-product-cell">
            <img src="${item.image}" alt="${
              item.name
            }" class="cart-product-image" />
            <div class="cart-product-info">
              <h3 class="cart-product-name">${item.name}</h3>
              <p class="cart-product-volume">${item.volume}</p>
            </div>
          </div>
          
          <div class="cart-price-cell">
            R$ ${item.price.toFixed(2).replace(".", ",")}
          </div>
          
          <div class="cart-quantity-cell">
            <div class="quantity-controls">
              <button class="quantity-btn quantity-minus" data-item-id="${
                item.id
              }">
                <svg width="12" height="2" viewBox="0 0 12 2" fill="none">
                  <line x1="0" y1="1" x2="12" y2="1" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
              <input type="text" class="quantity-input" value="${
                item.quantity
              }" readonly />
              <button class="quantity-btn quantity-plus" data-item-id="${
                item.id
              }">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <line x1="6" y1="0" x2="6" y2="12" stroke="currentColor" stroke-width="2"/>
                  <line x1="0" y1="6" x2="12" y2="6" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="cart-total-cell">
            R$ ${(item.price * item.quantity).toFixed(2).replace(".", ",")}
          </div>
          
          <button class="cart-remove-btn" data-item-id="${item.id}">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <line x1="1" y1="1" x2="13" y2="13" stroke="currentColor" stroke-width="1.5"/>
              <line x1="13" y1="1" x2="1" y2="13" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </button>
        </div>
      `,
        )
        .join("");

      const freeItemsHTML = `
        <div class="cart-table-row cart-free-item">
          <div class="cart-product-cell">
            <img src="/images/edp.webp" alt="Amostra Miss Dior EDP" class="cart-product-image" />
            <div class="cart-product-info">
              <h3 class="cart-product-name">Amostra Miss Dior EDP 1ml</h3>
            </div>
          </div>
          <div class="cart-price-cell">-</div>
          <div class="cart-quantity-cell">1</div>
          <div class="cart-total-cell cart-free-text">Grátis</div>
        </div>

        <div class="cart-table-row cart-free-item">
          <div class="cart-product-cell">
            <img src="/images/pouch.webp" alt="Holiday Empty Pouch" class="cart-product-image" />
            <div class="cart-product-info">
              <h3 class="cart-product-name">Holiday Empty Pouch</h3>
            </div>
          </div>
          <div class="cart-price-cell">-</div>
          <div class="cart-quantity-cell">1</div>
          <div class="cart-total-cell cart-free-text">Grátis</div>
        </div>
      `;

      cartTableItems.innerHTML = itemsHTML + freeItemsHTML;

      // Re-inicializa os event listeners
      this.initCartControls();

      // Atualiza os totais
      this.updateTotals();
    }
  }

  render() {
    const subtotal = this.calculateSubtotal();

    this.innerHTML = `
      <app-navigation></app-navigation>

      <main class="finalizar-compra-page">
        <!-- Hero Section -->
        <section class="checkout-hero">
          <div class="checkout-hero-content">
            <h1 class="checkout-hero-title">Finalizar Compra</h1>
            <p class="checkout-hero-subtitle">
              Refine seu pedido com a Arte de Presentear Dior e escreva uma mensagem personalizada.
            </p>
          </div>
        </section>

        <!-- Main Checkout Container -->
        <div class="checkout-container">
          <!-- Left Column: Form -->
          <div class="checkout-form-section">
            <div class="checkout-section">
              <h2 class="checkout-section-title">Informações de Contato</h2>
              <form class="checkout-form">
                <div class="form-group">
                  <label for="email">E-mail</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    placeholder="Digite seu e-mail"
                    required
                  />
                </div>
              </form>
            </div>

            <div class="checkout-section">
              <h2 class="checkout-section-title">Endereço de Entrega</h2>
              <form class="checkout-form">
                <div class="form-row">
                  <div class="form-group">
                    <label for="firstName">Nome</label>
                    <input 
                      type="text" 
                      id="firstName" 
                      name="firstName" 
                      placeholder="Nome"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label for="lastName">Sobrenome</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      name="lastName" 
                      placeholder="Sobrenome"
                      required
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label for="address">Endereço</label>
                  <input 
                    type="text" 
                    id="address" 
                    name="address" 
                    placeholder="Rua, número"
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="complement">Complemento</label>
                  <input 
                    type="text" 
                    id="complement" 
                    name="complement" 
                    placeholder="Apartamento, bloco, etc (opcional)"
                  />
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="city">Cidade</label>
                    <input 
                      type="text" 
                      id="city" 
                      name="city" 
                      placeholder="Cidade"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label for="state">Estado</label>
                    <select id="state" name="state" required>
                      <option value="">Selecione</option>
                      <option value="AC">Acre</option>
                      <option value="AL">Alagoas</option>
                      <option value="AP">Amapá</option>
                      <option value="AM">Amazonas</option>
                      <option value="BA">Bahia</option>
                      <option value="CE">Ceará</option>
                      <option value="DF">Distrito Federal</option>
                      <option value="ES">Espírito Santo</option>
                      <option value="GO">Goiás</option>
                      <option value="MA">Maranhão</option>
                      <option value="MT">Mato Grosso</option>
                      <option value="MS">Mato Grosso do Sul</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="PA">Pará</option>
                      <option value="PB">Paraíba</option>
                      <option value="PR">Paraná</option>
                      <option value="PE">Pernambuco</option>
                      <option value="PI">Piauí</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="RN">Rio Grande do Norte</option>
                      <option value="RS">Rio Grande do Sul</option>
                      <option value="RO">Rondônia</option>
                      <option value="RR">Roraima</option>
                      <option value="SC">Santa Catarina</option>
                      <option value="SP">São Paulo</option>
                      <option value="SE">Sergipe</option>
                      <option value="TO">Tocantins</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="zipCode">CEP</label>
                    <input 
                      type="text" 
                      id="zipCode" 
                      name="zipCode" 
                      placeholder="00000-000"
                      required
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label for="phone">Telefone</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    placeholder="(00) 00000-0000"
                    required
                  />
                </div>
              </form>
            </div>

            <div class="checkout-section">
              <h2 class="checkout-section-title">1. Opções de presente</h2>
              
              <p class="gift-subtitle">Selecione sua embalagem de presente</p>
              
              <p class="gift-description">
                A embalagem de presente de alta costura: nossa icônica embalagem de presente incorpora a Arte de Presentear. A caixa de envio ecológico: Uma caixa de transporte de papelão reciclável para o mínimo de desperdício e máxima sustentabilidade.
              </p>

              <form class="gift-form">
                <div class="gift-options">
                  <label class="gift-option">
                    <input type="radio" name="giftWrapping" value="luxury" checked />
                    <div class="gift-option-content">
                      <div class="gift-option-text">
                        <span>A embalagem de presente de alta costura</span>
                      </div>
                      <div class="gift-option-image">
                        <img src="/altacostura.png" alt="Embalagem de presente de alta costura" />
                      </div>
                    </div>
                  </label>

                  <label class="gift-option">
                    <input type="radio" name="giftWrapping" value="eco" />
                    <div class="gift-option-content">
                      <div class="gift-option-text">
                        <span>A caixa de envio ecológico</span>
                      </div>
                      <div class="gift-option-image">
                        <img src="/ecologico.png" alt="Caixa de envio ecológico" />
                      </div>
                    </div>
                  </label>
                </div>

                <div class="gift-message-section">
                  <button type="button" class="gift-message-toggle">
                    <span>Mensagem de presente</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M4 6L8 10L12 6"/>
                    </svg>
                  </button>
                  
                  <div class="gift-message-content" style="display: none;">
                    <p class="gift-message-info">
                      Por favor, insira a mensagem de presente no espaço abaixo. Vamos imprimi-la no cartão de mensagem de presente DIOR e anexá-la ao seu pedido
                    </p>
                    
                    <div class="form-group">
                      <label for="giftMessage">Sua mensagem:</label>
                      <textarea 
                        id="giftMessage" 
                        name="giftMessage" 
                        maxlength="300"
                        placeholder="Digite sua mensagem aqui..."
                        rows="4"
                      ></textarea>
                      <div class="character-counter">
                        <span class="character-count">0</span>/300
                      </div>
                    </div>

                    <button type="button" class="validate-message-btn">Validar</button>
                  </div>
                </div>
              </form>
            </div>

            <div class="checkout-section">
              <h2 class="checkout-section-title">Método de Pagamento</h2>
              <div class="payment-methods">
                <label class="payment-method-option">
                  <input type="radio" name="payment" value="credit" checked />
                  <span class="payment-method-label">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                      <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                    Cartão de Crédito
                  </span>
                </label>
                <label class="payment-method-option">
                  <input type="radio" name="payment" value="pix" />
                  <span class="payment-method-label">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                    </svg>
                    PIX
                  </span>
                </label>
              </div>
            </div>
          </div>

          <!-- Right Column: Order Summary -->
          <div class="checkout-summary-section">
            <div class="order-summary">
              <h2 class="order-summary-title">Meu Carrinho</h2>
              
              <!-- Header da tabela -->
              <div class="cart-table-header">
                <div class="header-produto">Produto</div>
                <div class="header-preco">Preço</div>
                <div class="header-quantidade">Quantidade</div>
                <div class="header-total">Total</div>
              </div>

              <!-- Items do carrinho -->
              <div class="cart-table-items">
                ${this.cartItems
                  .map(
                    (item) => `
                  <div class="cart-table-row">
                    <div class="cart-product-cell">
                      <img src="${item.image}" alt="${
                        item.name
                      }" class="cart-product-image" />
                      <div class="cart-product-info">
                        <h3 class="cart-product-name">${item.name}</h3>
                        <p class="cart-product-volume">${item.volume}</p>
                      </div>
                    </div>
                    
                    <div class="cart-price-cell">
                      R$ ${item.price.toFixed(2).replace(".", ",")}
                    </div>
                    
                    <div class="cart-quantity-cell">
                      <div class="quantity-controls">
                        <button class="quantity-btn quantity-minus" data-item-id="${
                          item.id
                        }">
                          <svg width="12" height="2" viewBox="0 0 12 2" fill="none">
                            <line x1="0" y1="1" x2="12" y2="1" stroke="currentColor" stroke-width="2"/>
                          </svg>
                        </button>
                        <input type="text" class="quantity-input" value="${
                          item.quantity
                        }" readonly />
                        <button class="quantity-btn quantity-plus" data-item-id="${
                          item.id
                        }">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <line x1="6" y1="0" x2="6" y2="12" stroke="currentColor" stroke-width="2"/>
                            <line x1="0" y1="6" x2="12" y2="6" stroke="currentColor" stroke-width="2"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div class="cart-total-cell">
                      R$ ${(item.price * item.quantity)
                        .toFixed(2)
                        .replace(".", ",")}
                    </div>
                    
                    <button class="cart-remove-btn" data-item-id="${item.id}">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <line x1="1" y1="1" x2="13" y2="13" stroke="currentColor" stroke-width="1.5"/>
                        <line x1="13" y1="1" x2="1" y2="13" stroke="currentColor" stroke-width="1.5"/>
                      </svg>
                    </button>
                  </div>
                `,
                  )
                  .join("")}
                
                <!-- Amostras Grátis -->
                <div class="cart-table-row cart-free-item">
                  <div class="cart-product-cell">
                    <img src="/images/edp.webp" alt="Amostra Miss Dior EDP" class="cart-product-image" />
                    <div class="cart-product-info">
                      <h3 class="cart-product-name">Amostra Miss Dior EDP 1ml</h3>
                    </div>
                  </div>
                  <div class="cart-price-cell">-</div>
                  <div class="cart-quantity-cell">1</div>
                  <div class="cart-total-cell cart-free-text">Grátis</div>
                </div>

                <div class="cart-table-row cart-free-item">
                  <div class="cart-product-cell">
                    <img src="/images/pouch.webp" alt="Holiday Empty Pouch" class="cart-product-image" />
                    <div class="cart-product-info">
                      <h3 class="cart-product-name">Holiday Empty Pouch</h3>
                    </div>
                  </div>
                  <div class="cart-price-cell">-</div>
                  <div class="cart-quantity-cell">1</div>
                  <div class="cart-total-cell cart-free-text">Grátis</div>
                </div>
              </div>

              <div class="cart-footer">
                <!-- Shipping Options -->
                <div class="shipping-options">
                  <label class="shipping-option">
                    <input type="radio" name="shipping" value="normal" checked />
                    <div class="shipping-info">
                      <span class="shipping-type">NORMAL</span>
                      <span class="shipping-time">Em até 6 dias úteis</span>
                    </div>
                    <span class="shipping-price">Grátis</span>
                  </label>
                </div>

                <!-- Order Summary -->
                <div class="order-summary-totals">
                  <div class="summary-row">
                    <span>Subtotal</span>
                    <span>R$ ${subtotal.toFixed(2).replace(".", ",")}</span>
                  </div>
                  <div class="summary-row">
                    <span>Entrega</span>
                    <span class="free-text">Grátis</span>
                  </div>
                  <div class="summary-divider"></div>
                  <div class="summary-row summary-total">
                    <span>Total</span>
                    <span>R$ ${subtotal.toFixed(2).replace(".", ",")}</span>
                  </div>
                </div>

                <button class="checkout-submit-btn">
                  Finalizar Pedido
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer-section></footer-section>

      <!-- Payment Modal -->
      <div class="payment-modal-backdrop"></div>
      <div class="payment-modal">
        <button class="payment-modal-close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div class="payment-modal-content">
          <a href="#" class="add-voucher-link">Adicionar vale-presente</a>

          <form class="payment-modal-form">
            <!-- Payment Method Selection -->
            <div class="payment-method-selection">
              <label class="payment-method-radio">
                <input type="radio" name="payment-method" value="credit" checked />
                <span>Cartão de crédito</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
              </label>

              <label class="payment-method-radio">
                <input type="radio" name="payment-method" value="pix" />
                <span>Pix</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5z"/>
                </svg>
              </label>
            </div>

            <!-- Credit Card Section -->
            <div class="credit-card-section">
              <!-- Card Brand Selection -->
              <div class="card-brand-selector">
                <label class="card-brand-option">
                  <input type="radio" name="card-brand" value="visa" checked />
                  <img src="/visa.svg" alt="Visa" />
                </label>

                <label class="card-brand-option">
                  <input type="radio" name="card-brand" value="mastercard" />
                  <img src="/mastercard.svg" alt="Mastercard" />
                </label>

                <label class="card-brand-option">
                  <input type="radio" name="card-brand" value="amex" />
                  <img src="/amex.svg" alt="Amex" />
                </label>

                <label class="card-brand-option">
                  <input type="radio" name="card-brand" value="elo" />
                  <img src="/elo.svg" alt="Elo" />
                </label>

                <label class="card-brand-option">
                  <input type="radio" name="card-brand" value="hiper" />
                  <img src="/hiper.svg" alt="Hipercard" />
                </label>
              </div>

              <div class="security-badge">
                <span>Ambiente Seguro</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
              </div>

              <!-- Card Number -->
              <div class="form-field">
                <label for="card-number">Número do cartão</label>
                <input
                  type="text"
                  id="card-number"
                  name="card-number"
                  placeholder="0000 0000 0000 0000"
                  maxlength="19"
                  required
                />
              </div>

              <!-- Installments -->
              <div class="form-field">
                <label for="installments">Em quantas parcelas deseja pagar?</label>
                <select id="installments" name="installments" required>
                  <option value="">Selecione</option>
                  <option value="1">1x sem juros</option>
                  <option value="2">2x sem juros</option>
                  <option value="3">3x sem juros</option>
                  <option value="4">4x sem juros</option>
                  <option value="5">5x sem juros</option>
                  <option value="6">6x sem juros</option>
                  <option value="7">7x sem juros</option>
                  <option value="8">8x sem juros</option>
                  <option value="9">9x sem juros</option>
                  <option value="10">10x sem juros</option>
                </select>
              </div>

              <!-- Card Name -->
              <div class="form-field">
                <label for="card-name">Nome impresso no cartão</label>
                <input
                  type="text"
                  id="card-name"
                  name="card-name"
                  placeholder="Nome completo"
                  required
                />
              </div>

              <!-- Expiry and CVV -->
              <div class="form-row">
                <div class="form-field">
                  <label for="expiry-month">Validade</label>
                  <select id="expiry-month" name="expiry-month" required>
                    <option value="">Mês</option>
                    <option value="01">01</option>
                    <option value="02">02</option>
                    <option value="03">03</option>
                    <option value="04">04</option>
                    <option value="05">05</option>
                    <option value="06">06</option>
                    <option value="07">07</option>
                    <option value="08">08</option>
                    <option value="09">09</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                  </select>
                </div>

                <div class="form-field">
                  <label for="expiry-year">&nbsp;</label>
                  <select id="expiry-year" name="expiry-year" required>
                    <option value="">Ano</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                    <option value="2029">2029</option>
                    <option value="2030">2030</option>
                  </select>
                </div>

                <div class="form-field">
                  <label for="cvv">Código de segurança</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    placeholder="CVV"
                    maxlength="4"
                    required
                  />
                  <small>Três últimos números atrás do seu cartão</small>
                </div>
              </div>

              <!-- CPF -->
              <div class="form-field">
                <label for="cpf">CPF do titular</label>
                <input
                  type="text"
                  id="cpf"
                  name="cpf"
                  placeholder="000.000.000-00"
                  required
                />
                <small>Campo obrigatório.</small>
              </div>

              <!-- Billing Address Checkbox -->
              <div class="form-checkbox">
                <input type="checkbox" id="billing-address" name="billing-address" />
                <label for="billing-address">
                  O endereço da fatura do cartão é Ave*** ***ncia, ***
                </label>
              </div>

              <!-- Two Cards Option -->
              <div class="two-cards-option">
                <span>Pagar usando dois cartões</span>
              </div>

              <!-- reCAPTCHA Notice -->
              <p class="recaptcha-notice">
                Este site é protegido pelo reCAPTCHA e está sujeito à
                <a href="#">Política de Privacidade</a> e aos
                <a href="#">Termos de Serviço</a> do Google.
              </p>
            </div>

            <!-- Pix Section (Hidden by default) -->
            <div class="pix-section" style="display: none;">
              <p>Após finalizar o pedido, você receberá o código PIX para pagamento.</p>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="payment-submit-btn">
              Finalizar Pedido
            </button>
          </form>
        </div>
      </div>
    `;
  }
}

customElements.define("finalizar-compra-page", FinalizarCompraPage);
