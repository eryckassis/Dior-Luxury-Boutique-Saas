// ============================================================================
// DADOS PESSOAIS PAGE - Página de Gestão de Dados Pessoais
// ============================================================================

import "../components/AppNavigation.js";
import "../components/FooterSection.js";
import "../styles/dados-pessoais.css";
import { authService } from "../services/AuthService.js";
import { userService } from "../services/UserService.js";
import { router } from "../router/router.js";
import { toast } from "../components/Toast.js";

export class DadosPessoaisPage extends HTMLElement {
  constructor() {
    super();
    this.isEditMode = false;
    this.isLoading = false;
    this.isSaving = false;
    this.userData = null;
    this.originalData = null;
  }

  async connectedCallback() {
    // Verifica autenticação de forma assíncrona (aguarda sessão restaurar após refresh)
    const isAuth = await authService.isAuthenticatedAsync();
    if (!isAuth) {
      router.navigate("/login");
      return;
    }

    this.render();
    await this.loadUserData();
    this.initEventListeners();
  }

  async loadUserData() {
    try {
      this.isLoading = true;
      this.updateLoadingState();

      this.userData = await userService.getProfile();
      this.originalData = { ...this.userData };

      this.renderContent();
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar dados do perfil");

      if (error.message.includes("não autenticado")) {
        router.navigate("/login");
      }
    } finally {
      this.isLoading = false;
    }
  }

  initEventListeners() {
    // Menu links
    this.querySelectorAll(".sidebar-menu-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const route = link.dataset.route;
        if (route) router.navigate(route);
      });
    });

    // Logout
    const logoutBtn = this.querySelector(".sidebar-logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        await authService.logout();
        router.navigate("/");
      });
    }
  }

  initFormListeners() {
    // Botão Editar
    const editBtn = this.querySelector(".dados-btn-edit");
    if (editBtn) {
      editBtn.addEventListener("click", () => this.toggleEditMode(true));
    }

    // Botão Cancelar
    const cancelBtn = this.querySelector(".dados-btn-cancel");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => this.cancelEdit());
    }

    // Formulário Submit
    const form = this.querySelector(".dados-form");
    if (form) {
      form.addEventListener("submit", (e) => this.handleSubmit(e));
    }

    // Máscara de CPF
    const cpfInput = this.querySelector('input[name="cpf"]');
    if (cpfInput) {
      cpfInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 11) value = value.slice(0, 11);
        e.target.value = value;
      });
    }

    // Máscara de Telefone
    const phoneInput = this.querySelector('input[name="phone"]');
    if (phoneInput) {
      phoneInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 11) value = value.slice(0, 11);

        if (value.length >= 11) {
          value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
        } else if (value.length >= 7) {
          value = value.replace(/(\d{2})(\d{4,5})(\d{0,4})/, "($1) $2-$3");
        } else if (value.length >= 2) {
          value = value.replace(/(\d{2})(\d{0,5})/, "($1) $2");
        }

        e.target.value = value;
      });
    }
  }

  toggleEditMode(edit) {
    this.isEditMode = edit;
    this.renderContent();

    // Anima transição com GSAP
    if (window.gsap) {
      const content = this.querySelector(".dados-content");
      window.gsap.fromTo(
        content,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
      );
    }
  }

  cancelEdit() {
    // Restaura dados originais
    this.userData = { ...this.originalData };
    this.toggleEditMode(false);
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (this.isSaving) return;

    // Coleta dados do formulário
    const formData = new FormData(e.target);

    // Trata os valores - envia null para campos vazios
    const name = formData.get("name")?.trim() || "";
    const lastName = formData.get("lastName")?.trim() || "";
    const cpfRaw = formData.get("cpf")?.replace(/\D/g, "") || "";
    const phoneRaw = formData.get("phone")?.trim() || "";
    const gender = formData.get("gender") || "";
    const birthDateRaw = formData.get("birthDate") || "";

    const data = {
      name: name,
      lastName: lastName || "",
      cpf: cpfRaw || "",
      phone: phoneRaw || "",
      gender: gender || "",
      birthDate: birthDateRaw || null,
    };

    // Validação frontend
    if (!data.name || data.name.length < 2) {
      toast.error("Nome deve ter pelo menos 2 caracteres");
      return;
    }

    // Log para debug
    console.log("Enviando dados:", data);

    try {
      this.isSaving = true;
      this.updateSaveButtonState();

      const updatedUser = await userService.updateProfile(data);

      this.userData = updatedUser;
      this.originalData = { ...updatedUser };

      toast.success("Dados atualizados com sucesso!");

      this.toggleEditMode(false);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error(error.message || "Erro ao salvar dados");
    } finally {
      this.isSaving = false;
      this.updateSaveButtonState();
    }
  }

  updateLoadingState() {
    const content = this.querySelector(".dados-content");
    if (content && this.isLoading) {
      content.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; height: 300px;">
          <div style="width: 40px; height: 40px; border: 2px solid #e8e8e8; border-top-color: #000; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
        </div>
      `;
    }
  }

  updateSaveButtonState() {
    const saveBtn = this.querySelector(".dados-btn-save");
    if (saveBtn) {
      if (this.isSaving) {
        saveBtn.classList.add("loading");
        saveBtn.disabled = true;
      } else {
        saveBtn.classList.remove("loading");
        saveBtn.disabled = false;
      }
    }
  }

  getGenderLabel(gender) {
    const labels = {
      masculino: "Masculino",
      feminino: "Feminino",
      outro: "Outro",
      prefiro_nao_informar: "Prefiro não informar",
    };
    return labels[gender] || "";
  }

  renderViewMode() {
    return `
      <div class="dados-header">
        <h1 class="dados-title">Dados pessoais</h1>
      </div>

      <div class="dados-divider"></div>

      <div class="dados-form">
        <div class="dados-form-row">
          <div class="dados-field">
            <span class="dados-field-label">Nome</span>
            <span class="dados-field-value">${this.userData?.name || ""}</span>
          </div>
          <div class="dados-field">
            <span class="dados-field-label">Sobrenome</span>
            <span class="dados-field-value ${
              !this.userData?.lastName ? "empty" : ""
            }">${this.userData?.lastName || "Não informado"}</span>
          </div>
        </div>

        <div class="dados-form-row single">
          <div class="dados-field">
            <span class="dados-field-label">Email</span>
            <span class="dados-field-value">${this.userData?.email || ""}</span>
          </div>
        </div>

        <div class="dados-form-row">
          <div class="dados-field">
            <span class="dados-field-label">CPF</span>
            <span class="dados-field-value ${!this.userData?.cpf ? "empty" : ""}">${
              this.userData?.cpf ? userService.formatCPF(this.userData.cpf) : "Não informado"
            }</span>
          </div>
          <div class="dados-field">
            <span class="dados-field-label">Gênero</span>
            <span class="dados-field-value ${!this.userData?.gender ? "empty" : ""}">${
              this.getGenderLabel(this.userData?.gender) || "Não informado"
            }</span>
          </div>
        </div>

        <div class="dados-form-row">
          <div class="dados-field">
            <span class="dados-field-label">Data de nascimento</span>
            <span class="dados-field-value ${!this.userData?.birthDate ? "empty" : ""}">${
              this.userData?.birthDate
                ? userService.formatDate(this.userData.birthDate)
                : "Não informado"
            }</span>
          </div>
          <div class="dados-field">
            <span class="dados-field-label">Telefone</span>
            <span class="dados-field-value ${!this.userData?.phone ? "empty" : ""}">${
              this.userData?.phone ? userService.formatPhone(this.userData.phone) : "Não informado"
            }</span>
          </div>
        </div>

        <div class="dados-actions">
          <button type="button" class="dados-btn dados-btn-edit">Editar</button>
        </div>
      </div>
    `;
  }

  renderEditMode() {
    return `
      <div class="dados-header">
        <div class="dados-breadcrumb">
          <a href="#" class="dados-breadcrumb-link" data-action="cancel">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Dados pessoais
          </a>
        </div>
        <h1 class="dados-title">Editar dados pessoais</h1>
      </div>

      <div class="dados-divider"></div>

      <form class="dados-form">
        <div class="dados-form-row">
          <div class="dados-field">
            <label class="dados-field-label" for="name">Nome</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              class="dados-field-input"
              value="${this.userData?.name || ""}"
              required
              minlength="2"
            />
          </div>
          <div class="dados-field">
            <label class="dados-field-label" for="lastName">Sobrenome</label>
            <input 
              type="text" 
              id="lastName" 
              name="lastName" 
              class="dados-field-input"
              value="${this.userData?.lastName || ""}"
            />
          </div>
        </div>

        <div class="dados-form-row">
          <div class="dados-field">
            <label class="dados-field-label" for="cpf">CPF</label>
            <input 
              type="text" 
              id="cpf" 
              name="cpf" 
              class="dados-field-input"
              value="${this.userData?.cpf || ""}"
              placeholder="Somente números"
              maxlength="11"
            />
          </div>
          <div class="dados-field">
            <label class="dados-field-label" for="phone">Telefone</label>
            <input 
              type="text" 
              id="phone" 
              name="phone" 
              class="dados-field-input"
              value="${this.userData?.phone || ""}"
              placeholder="(XX) XXXXX-XXXX"
            />
          </div>
        </div>

        <div class="dados-form-row">
          <div class="dados-field">
            <label class="dados-field-label" for="gender">Gênero</label>
            <select id="gender" name="gender" class="dados-field-select">
              <option value="">Opcional</option>
              <option value="masculino" ${
                this.userData?.gender === "masculino" ? "selected" : ""
              }>Masculino</option>
              <option value="feminino" ${
                this.userData?.gender === "feminino" ? "selected" : ""
              }>Feminino</option>
              <option value="outro" ${
                this.userData?.gender === "outro" ? "selected" : ""
              }>Outro</option>
              <option value="prefiro_nao_informar" ${
                this.userData?.gender === "prefiro_nao_informar" ? "selected" : ""
              }>Prefiro não informar</option>
            </select>
          </div>
          <div class="dados-field">
            <label class="dados-field-label" for="birthDate">Data de nascimento</label>
            <input 
              type="date" 
              id="birthDate" 
              name="birthDate" 
              class="dados-field-input"
              value="${
                this.userData?.birthDate
                  ? userService.formatDateForInput(this.userData.birthDate)
                  : ""
              }"
            />
          </div>
        </div>

        <div class="dados-pj-section">
          <button type="button" class="dados-pj-btn">Incluir campos de pessoa jurídica</button>
        </div>

        <div class="dados-actions">
          <button type="button" class="dados-btn dados-btn-cancel">Cancelar</button>
          <button type="submit" class="dados-btn dados-btn-save">Salvar alterações</button>
        </div>
      </form>
    `;
  }

  renderContent() {
    const content = this.querySelector(".dados-content");
    if (!content) return;

    content.innerHTML = this.isEditMode ? this.renderEditMode() : this.renderViewMode();

    this.initFormListeners();

    // Breadcrumb voltar
    const breadcrumb = this.querySelector('[data-action="cancel"]');
    if (breadcrumb) {
      breadcrumb.addEventListener("click", (e) => {
        e.preventDefault();
        this.cancelEdit();
      });
    }
  }

  render() {
    const user = authService.getCachedUser();
    const userName = user?.name || "Usuário";

    this.innerHTML = `
      <div class="dados-pessoais-page">
        <app-navigation></app-navigation>

        <div class="dados-pessoais-container">
          <!-- Sidebar -->
          <aside class="dados-sidebar">
            <div class="sidebar-greeting">
              <p class="sidebar-greeting-label">Olá,</p>
              <h2 class="sidebar-greeting-name">${userName}!</h2>
            </div>

            <nav class="sidebar-menu">
              <a href="#" class="sidebar-menu-link active" data-route="/minha-conta/dados">Dados pessoais</a>
              <a href="#" class="sidebar-menu-link" data-route="/minha-conta/enderecos">Endereços</a>
              <a href="#" class="sidebar-menu-link" data-route="/minha-conta/pedidos">Pedidos</a>
              <a href="#" class="sidebar-menu-link" data-route="/minha-conta/cartoes">Cartões</a>
              <a href="#" class="sidebar-menu-link" data-route="/minha-conta/autenticacao">Autenticação</a>
              <a href="#" class="sidebar-menu-link" data-route="/minha-conta/newsletter">Newsletter</a>
            </nav>

            <button class="sidebar-logout">Sair</button>
          </aside>

          <!-- Content -->
          <main class="dados-content">
            <!-- Carregado dinamicamente -->
          </main>
        </div>

        <footer-section></footer-section>
      </div>
    `;
  }
}

customElements.define("dados-pessoais-page", DadosPessoaisPage);
