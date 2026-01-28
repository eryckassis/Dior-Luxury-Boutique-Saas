import { supabase } from "./supabaseClient.js";

class CartService {
  constructor() {
    this.listeners = [];
    this.items = [];
    this.userId = null;
    this.subscription = null;
    this.isInitialized = false;
    this._initializing = false; // Flag para evitar inicializações duplicadas

    this.STORAGE_KEY = "dior_cart_guest";

    this._initPromise = this.initialize();
  }

  async initialize() {
    if (this._initializing) return;
    this._initializing = true;

    console.log("🛒 CartService: Iniciando...");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log("🛒 CartService: Sessão?", !!session?.user);

      if (session?.user) {
        this.userId = session.user.id;
        await this.loadCartFromSupabase();
        this.subscribeToRealtime();
      } else {
        this.items = this.getLocalItems();
        console.log("🛒 CartService: localStorage itens:", this.items.length);
      }

      this.isInitialized = true;
      this.notifyListeners();

      this.setupAuthListener();
    } catch (error) {
      console.error("❌ CartService: Erro na inicialização:", error);
      this.items = this.getLocalItems();
      this.isInitialized = true;
      this.notifyListeners();
    }
  }

  setupAuthListener() {
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🛒 CartService: Auth event:", event);

      if (event === "INITIAL_SESSION") return;

      const previousUserId = this.userId;
      this.userId = session?.user?.id || null;

      if (event === "SIGNED_IN" && this.userId && !previousUserId) {
        await this.migrateLocalCartToSupabase();
        await this.loadCartFromSupabase();
        this.subscribeToRealtime();
      } else if (event === "SIGNED_OUT") {
        this.unsubscribeFromRealtime();
        this.items = this.getLocalItems();
        this.notifyListeners();
      }
    });
  }

  async waitForInit() {
    return this._initPromise;
  }

  async loadCartFromSupabase() {
    if (!this.userId) return;

    console.log("🛒 CartService: Carregando do Supabase para:", this.userId);

    try {
      const { data, error } = await supabase
        .from("carts")
        .select("items")
        .eq("user_id", this.userId)
        .single();

      if (error && error.code === "PGRST116") {
        console.log("🛒 CartService: Criando carrinho...");
        const { data: newCart, error: createError } = await supabase
          .from("carts")
          .insert({ user_id: this.userId, items: [] })
          .select("items")
          .single();

        if (createError) throw createError;
        this.items = newCart?.items || [];
      } else if (error) {
        throw error;
      } else {
        this.items = data?.items || [];
      }

      console.log("🛒 CartService: Itens carregados:", this.items.length);
    } catch (error) {
      console.error("❌ CartService: Erro ao carregar:", error);
      this.items = this.getLocalItems();
    }
  }

  subscribeToRealtime() {
    if (!this.userId || this.subscription) return;

    this.subscription = supabase
      .channel(`cart:${this.userId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "carts",
          filter: `user_id=eq.${this.userId}`,
        },
        (payload) => {
          console.log("🔄 Carrinho atualizado em tempo real:", payload);
          this.items = payload.new.items || [];
          this.notifyListeners();
        },
      )
      .subscribe();

    console.log("📡 Real-time do carrinho ativado");
  }

  unsubscribeFromRealtime() {
    if (this.subscription) {
      supabase.removeChannel(this.subscription);
      this.subscription = null;
      console.log("📡 Real-time do carrinho desativado");
    }
  }

  getItems() {
    return this.items;
  }

  async addItem(product) {
    const existingItem = this.items.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        volume: product.volume,
        price: product.price,
        quantity: 1,
        image: product.image,
      });
    }

    await this.saveItems(this.items);
    return this.items;
  }

  async removeItem(itemId) {
    this.items = this.items.filter((item) => item.id !== itemId);
    await this.saveItems(this.items);
    return this.items;
  }

  async updateQuantity(itemId, quantity) {
    const item = this.items.find((i) => i.id === itemId);

    if (item && quantity > 0 && quantity <= 10) {
      item.quantity = quantity;
      await this.saveItems(this.items);
    }

    return this.items;
  }

  async incrementQuantity(itemId) {
    const item = this.items.find((i) => i.id === itemId);

    if (item && item.quantity < 10) {
      item.quantity += 1;
      await this.saveItems(this.items);
    }

    return this.items;
  }

  async decrementQuantity(itemId) {
    const item = this.items.find((i) => i.id === itemId);

    if (item && item.quantity > 1) {
      item.quantity -= 1;
      await this.saveItems(this.items);
    }

    return this.items;
  }

  async clearCart() {
    this.items = [];
    await this.saveItems(this.items);
    return this.items;
  }

  async saveItems(items) {
    this.items = items;

    if (this.userId) {
      try {
        const { error } = await supabase.from("carts").update({ items }).eq("user_id", this.userId);

        if (error) throw error;
      } catch (error) {
        console.error("❌ Erro ao salvar carrinho no Supabase:", error);

        this.saveLocalItems(items);
      }
    } else {
      this.saveLocalItems(items);
    }

    this.notifyListeners();
  }

  getLocalItems() {
    try {
      const items = localStorage.getItem(this.STORAGE_KEY);
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error("Erro ao ler carrinho local:", error);
      return [];
    }
  }

  saveLocalItems(items) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Erro ao salvar carrinho local:", error);
    }
  }

  clearLocalItems() {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  async migrateLocalCartToSupabase() {
    const localItems = this.getLocalItems();

    if (localItems.length === 0) return;

    console.log("🔄 Migrando carrinho local para Supabase...");

    try {
      const { data } = await supabase
        .from("carts")
        .select("items")
        .eq("user_id", this.userId)
        .single();

      const supabaseItems = data?.items || [];

      const mergedItems = [...supabaseItems];

      for (const localItem of localItems) {
        const existingItem = mergedItems.find((item) => item.id === localItem.id);
        if (existingItem) {
          existingItem.quantity = Math.min(existingItem.quantity + localItem.quantity, 10);
        } else {
          mergedItems.push(localItem);
        }
      }

      await supabase.from("carts").upsert({ user_id: this.userId, items: mergedItems });

      this.clearLocalItems();

      console.log("✅ Carrinho migrado com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao migrar carrinho:", error);
    }
  }

  getTotal() {
    return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  getTotalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  addListener(callback) {
    this.listeners.push(callback);

    if (this.isInitialized) {
      callback(this.items);
    }
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter((listener) => listener !== callback);
  }

  notifyListeners() {
    this.listeners.forEach((callback) => callback(this.items));
  }

  initializeDefaultItems() {
    const items = this.getItems();
    if (items.length === 0) {
      const defaultItems = [
        {
          id: 1,
          name: "Miss Dior Essence",
          volume: "35 ml",
          price: 799.0,
          quantity: 1,
          image: "/images/dioressence1.webp",
        },
        {
          id: 2,
          name: "Miss Dior Parfum",
          volume: "35 ml",
          price: 665.0,
          quantity: 1,
          image: "/images/parfum1.webp",
        },
      ];
      this.saveItems(defaultItems);
    }
  }
}

export const cartService = new CartService();
