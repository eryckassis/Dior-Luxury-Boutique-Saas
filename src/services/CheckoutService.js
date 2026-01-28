class CheckoutService {
  constructor() {
    this.STORAGE_KEY = "dior_checkout_data";
    this.listeners = [];
  }

  getData() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : this.getDefaultData();
    } catch {
      return this.getDefaultData();
    }
  }

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

  updateField(field, value) {
    const data = this.getData();
    data[field] = value;
    return this.saveData(data);
  }

  getFullAddress() {
    const data = this.getData();
    const parts = [];

    if (data.address) parts.push(data.address);
    if (data.complement) parts.push(data.complement);
    if (data.city) parts.push(data.city);
    if (data.state) parts.push(data.state);

    return parts.join(", ");
  }

  getBillingAddress() {
    const data = this.getData();
    const parts = [];

    if (data.address) parts.push(data.address);
    if (data.city) parts.push(data.city);

    return parts.join(", ");
  }

  clearData() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      this.notifyListeners(this.getDefaultData());
    } catch {}
  }

  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter((listener) => listener !== callback);
  }

  notifyListeners(data) {
    this.listeners.forEach((listener) => listener(data));
  }

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

export const checkoutService = new CheckoutService();
