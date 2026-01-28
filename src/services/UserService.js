import { supabase } from "./supabaseClient.js";

class UserService {
  constructor() {
    this.profileCache = null;
    this.cacheTimestamp = null;
    this.CACHE_DURATION = 60000; // 1 minuto
  }

  async getProfile(forceRefresh = false) {
    try {
      console.log("🔍 Buscando perfil...");

      if (!forceRefresh && this.isCacheValid()) {
        console.log("✅ Usando perfil do cache");
        return this.profileCache;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.log("❌ Usuário não autenticado");
        throw new Error("Usuário não autenticado");
      }

      console.log("👤 Usuário autenticado:", user.id);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      console.log("📡 Resposta do Supabase:", { data, error });

      if (error && error.code === "PGRST116") {
        console.log("⚠️ Perfil não encontrado, criando...");

        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            name: user.user_metadata?.name || user.email?.split("@")[0] || "Usuário",
            is_email_verified: user.email_confirmed_at !== null,
          })
          .select()
          .single();

        if (createError) {
          console.error("❌ Erro ao criar perfil:", createError);
          throw new Error(createError.message);
        }

        console.log("✅ Perfil criado:", newProfile);
        const profile = this.transformToCamelCase(newProfile);
        profile.email = user.email;

        this.profileCache = profile;
        this.cacheTimestamp = Date.now();
        return profile;
      }

      if (error) {
        console.error("❌ Erro ao buscar perfil:", error);
        throw new Error(error.message);
      }

      const profile = data ? this.transformToCamelCase(data) : null;

      if (profile) {
        profile.email = user.email;
      }

      console.log("✅ Perfil encontrado:", profile);

      this.profileCache = profile;
      this.cacheTimestamp = Date.now();

      return profile;
    } catch (error) {
      console.error("❌ Erro ao buscar perfil:", error);
      throw error;
    }
  }

  async updateProfile(profileData) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      const updateData = this.transformToSnakeCase(profileData);

      const { data, error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id)
        .select()
        .single();

      if (error) {
        if (error.message.includes("duplicate key") && error.message.includes("cpf")) {
          throw new Error("CPF já cadastrado em outra conta");
        }
        throw new Error(error.message);
      }

      if (profileData.name && profileData.name !== user.user_metadata?.name) {
        const { error: authError } = await supabase.auth.updateUser({
          data: { name: profileData.name },
        });

        if (authError) {
          console.warn("Erro ao atualizar nome do Auth:", authError);
        }
      }

      this.invalidateCache();

      window.dispatchEvent(
        new CustomEvent("profile-updated", {
          detail: { name: profileData.name },
        }),
      );

      const profile = this.transformToCamelCase(data);
      profile.email = user.email;
      return profile;
    } catch (error) {
      console.error("❌ Erro ao atualizar perfil:", error);
      throw error;
    }
  }

  isCacheValid() {
    if (!this.profileCache || !this.cacheTimestamp) {
      return false;
    }
    return Date.now() - this.cacheTimestamp < this.CACHE_DURATION;
  }

  invalidateCache() {
    this.profileCache = null;
    this.cacheTimestamp = null;
  }

  transformToCamelCase(data) {
    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      lastName: data.last_name,
      cpf: data.cpf,
      phone: data.phone,
      gender: data.gender,
      birthDate: data.birth_date,
      isEmailVerified: data.is_email_verified,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  transformToSnakeCase(data) {
    const result = {};

    if (data.name !== undefined) result.name = data.name;
    if (data.lastName !== undefined) result.last_name = data.lastName || null;
    if (data.cpf !== undefined) result.cpf = data.cpf || null;
    if (data.phone !== undefined) result.phone = data.phone || null;
    if (data.gender !== undefined) result.gender = data.gender || null;
    if (data.birthDate !== undefined) {
      result.birth_date = data.birthDate
        ? new Date(data.birthDate).toISOString().split("T")[0]
        : null;
    }

    return result;
  }

  formatCPF(cpf) {
    if (!cpf) return "";
    const cleaned = cpf.replace(/\D/g, "");
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  unformatCPF(cpf) {
    if (!cpf) return "";
    return cpf.replace(/\D/g, "");
  }

  formatPhone(phone) {
    if (!phone) return "";
    const cleaned = phone.replace(/\D/g, "");

    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return phone;
  }

  unformatPhone(phone) {
    if (!phone) return "";
    return phone.replace(/\D/g, "");
  }

  formatDate(date) {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("pt-BR");
  }

  formatDateForInput(date) {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  }

  validateCPF(cpf) {
    const cleaned = this.unformatCPF(cpf);

    if (cleaned.length !== 11) return false;
    if (/^(\d)\1+$/.test(cleaned)) return false; // Todos dígitos iguais

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleaned.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit > 9) digit = 0;
    if (parseInt(cleaned.charAt(9)) !== digit) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleaned.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit > 9) digit = 0;
    if (parseInt(cleaned.charAt(10)) !== digit) return false;

    return true;
  }

  validatePhone(phone) {
    const cleaned = this.unformatPhone(phone);
    return cleaned.length === 10 || cleaned.length === 11;
  }
}

export const userService = new UserService();
