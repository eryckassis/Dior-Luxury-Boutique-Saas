import { supabase } from "./supabaseClient.js";

class ReviewService {
  constructor() {
    this.listeners = new Map();
    this.subscriptions = new Map();
  }

  async getReviews(productId, page = 1, limit = 5) {
    try {
      const offset = (page - 1) * limit;

      // Busca reviews com contagem total
      const { data, error, count } = await supabase
        .from("reviews")
        .select("*", { count: "exact" })
        .eq("product_id", productId)
        .eq("is_approved", true)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw new Error(error.message);

      return {
        reviews: data || [],
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      };
    } catch (error) {
      console.error("❌ Erro ao buscar reviews:", error);
      throw error;
    }
  }

  async getProductStats(productId) {
    try {
      const { data, error } = await supabase.rpc("get_product_review_stats", {
        p_product_id: productId,
      });

      if (error) throw new Error(error.message);

      return (
        data?.[0] || {
          total_reviews: 0,
          average_rating: 0,
          rating_1: 0,
          rating_2: 0,
          rating_3: 0,
          rating_4: 0,
          rating_5: 0,
        }
      );
    } catch (error) {
      console.error("❌ Erro ao buscar estatísticas:", error);
      throw error;
    }
  }

  async createReview(reviewData) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Você precisa estar logado para avaliar");
      }

      const { data, error } = await supabase
        .from("reviews")
        .insert({
          product_id: reviewData.productId,
          user_id: user.id,
          author_name: reviewData.authorName,
          rating: reviewData.rating,
          text: reviewData.text,
          recommend: reviewData.recommend,
        })
        .select()
        .single();

      if (error) {
        // Erro de constraint unique (já avaliou)
        if (error.code === "23505") {
          throw new Error("Você já avaliou este produto");
        }
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error("❌ Erro ao criar review:", error);
      throw error;
    }
  }

  async hasUserReviewed(productId) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return false;

      const { data, error } = await supabase
        .from("reviews")
        .select("id")
        .eq("product_id", productId)
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw new Error(error.message);
      }

      return !!data;
    } catch (error) {
      console.error("❌ Erro ao verificar review:", error);
      return false;
    }
  }

  async deleteReview(reviewId) {
    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId);

      if (error) throw new Error(error.message);
    } catch (error) {
      console.error("❌ Erro ao deletar review:", error);
      throw error;
    }
  }

  // ========================================================================
  // REAL-TIME
  // ========================================================================

  subscribeToProduct(productId, callback) {
    // Adiciona listener
    if (!this.listeners.has(productId)) {
      this.listeners.set(productId, new Set());
    }
    this.listeners.get(productId).add(callback);

    // Cria subscription se não existir
    if (!this.subscriptions.has(productId)) {
      const subscription = supabase
        .channel(`reviews:${productId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "reviews",
            filter: `product_id=eq.${productId}`,
          },
          (payload) => {
            console.log("🔄 Review atualizada:", payload.eventType);
            this.notifyListeners(productId, payload);
          },
        )
        .subscribe();

      this.subscriptions.set(productId, subscription);
    }
  }

  unsubscribeFromProduct(productId, callback) {
    const listeners = this.listeners.get(productId);
    if (listeners) {
      listeners.delete(callback);

      // Se não há mais listeners, remove subscription
      if (listeners.size === 0) {
        const subscription = this.subscriptions.get(productId);
        if (subscription) {
          supabase.removeChannel(subscription);
          this.subscriptions.delete(productId);
        }
        this.listeners.delete(productId);
      }
    }
  }

  notifyListeners(productId, payload) {
    const listeners = this.listeners.get(productId);
    if (listeners) {
      listeners.forEach((callback) => callback(payload));
    }
  }

  // ========================================================================
  // UTILITÁRIOS
  // ========================================================================

  formatRelativeDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 60) {
      return `Enviado há ${diffMinutes} minuto${diffMinutes !== 1 ? "s" : ""}`;
    }
    if (diffHours < 24) {
      return `Enviado há ${diffHours} hora${diffHours !== 1 ? "s" : ""}`;
    }
    if (diffDays === 1) {
      return "Enviado ontem";
    }
    if (diffDays < 30) {
      return `Enviado há ${diffDays} dias`;
    }
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `Enviado há ${months} ${months === 1 ? "mês" : "meses"}`;
    }
    return `Enviado em ${date.toLocaleDateString("pt-BR")}`;
  }

  generateStarsHTML(rating, type = "display") {
    const filled = Math.round(rating);
    let html = "";

    for (let i = 1; i <= 5; i++) {
      if (type === "display") {
        html += `<span class="review-star-${i <= filled ? "filled" : "empty"}">${i <= filled ? "★" : "☆"}</span>`;
      } else {
        html += `<span class="star-rating-input" data-value="${i}">☆</span>`;
      }
    }

    return html;
  }
}

export const reviewService = new ReviewService();
