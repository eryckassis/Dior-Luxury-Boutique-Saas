import { createClient } from "@supabase/supabase-js";
import { config } from "./env.js";

const supabaseUrl = config.supabase.url;
const supabaseServiceKey = config.supabase.serviceRoleKey;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Supabase não configurado no backend!");
  console.error("   Verifique SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env");
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export const verifyUserToken = async (token) => {
  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(token);

  if (error) {
    console.error("❌ Erro ao verificar token:", error.message);
    throw new Error("Token inválido ou expirado");
  }

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  return user;
};

export const getUserProfile = async (userId) => {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error("Erro ao buscar perfil");
  }

  return data;
};
