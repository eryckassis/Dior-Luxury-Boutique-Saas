// ============================================================================
// SUPABASE CLIENT - Backend (Service Role)
// ============================================================================
import { createClient } from "@supabase/supabase-js";
import { config } from "./env.js";

const supabaseUrl = config.supabase.url;
const supabaseServiceKey = config.supabase.serviceRoleKey;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Supabase não configurado no backend!");
  console.error(
    "   Verifique SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env",
  );
}

/**
 * Cliente Supabase com Service Role Key
 * ATENÇÃO: Este cliente BYPASS RLS - use apenas no backend!
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
 * Verifica e decodifica token de usuário
 * @param {string} token - Access token do Supabase
 * @returns {Promise<Object>} - Dados do usuário
 */
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

/**
 * Busca perfil completo do usuário
 * @param {string} userId - UUID do usuário
 * @returns {Promise<Object>} - Perfil do usuário
 */
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
