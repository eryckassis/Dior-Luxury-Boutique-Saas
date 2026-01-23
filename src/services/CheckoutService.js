// ============================================================================
// CHECKOUT SERVICE - Gerencia dados do checkout com localStorage
// ============================================================================

class CheckoutService {
  constructor() {
    this.STORAGE_KEY = "dior_checkout_data";
    this.listeners = [];
  }

  // Obtém todos os dados do checkout
  getData() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : this.getDefaultData();
    } catch {
      return this.getDefaultData();
    }
  }

  // Dados padrão
  getDefaultData() {
    return {
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      complement: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
      giftWrapping: "luxury",
      giftMessage: "",
    };
  }

  // Salva dados no localStorage
  saveData(data) {
    try {
      const currentData = this.getData();
      const updatedData = { ...currentData, ...data };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedData));
      this.notifyListeners(updatedData);
      return updatedData;
    } catch {
      return null;
    }
  }

  // Atualiza um campo específico
  updateField(field, value) {
    const data = this.getData();
    data[field] = value;
    return this.saveData(data);
  }

  // Obtém endereço completo formatado
  getFullAddress() {
    const data = this.getData();
    const parts = [];

    if (data.address) parts.push(data.address);
    if (data.complement) parts.push(data.complement);
    if (data.city) parts.push(data.city);
    if (data.state) parts.push(data.state);

    return parts.join(", ");
  }

  // Obtém endereço de cobrança (rua e número)
  getBillingAddress() {
    const data = this.getData();
    const parts = [];

    if (data.address) parts.push(data.address);
    if (data.city) parts.push(data.city);

    return parts.join(", ");
  }

  // Limpa todos os dados
  clearData() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      this.notifyListeners(this.getDefaultData());
    } catch {
      // Silently fail
    }
  }

  // Sistema de listeners para sincronização
  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter((listener) => listener !== callback);
  }

  notifyListeners(data) {
    this.listeners.forEach((listener) => listener(data));
  }

  // Valida se todos os campos obrigatórios estão preenchidos
  isValid() {
    const data = this.getData();
    return (
      data.email &&
      data.firstName &&
      data.lastName &&
      data.address &&
      data.city &&
      data.state &&
      data.zipCode &&
      data.phone
    );
  }
}

// Exporta instância única (singleton)
export const checkoutService = new CheckoutService();
