import { supabaseAdmin } from "../config/supabase.js";

export class UserService {
  static async getProfile(userId) {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error && error.code === "PGRST116") {
      throw new Error("Usuário não encontrado");
    }

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async updateProfile(userId, data) {
    const { data: existingUser, error: findError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();

    if (findError && findError.code === "PGRST116") {
      throw new Error("Usuário não encontrado");
    }

    if (data.cpf) {
      const { data: cpfExists } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("cpf", data.cpf)
        .neq("id", userId)
        .single();

      if (cpfExists) {
        throw new Error("CPF já cadastrado em outra conta");
      }
    }

    const updateData = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.lastName !== undefined) updateData.last_name = data.lastName || null;
    if (data.cpf !== undefined) updateData.cpf = data.cpf || null;
    if (data.phone !== undefined) updateData.phone = data.phone || null;
    if (data.gender !== undefined) updateData.gender = data.gender || null;
    if (data.birthDate !== undefined) {
      updateData.birth_date = data.birthDate
        ? new Date(data.birthDate).toISOString().split("T")[0]
        : null;
    }

    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from("profiles")
      .update(updateData)
      .eq("id", userId)
      .select()
      .single();

    if (updateError) {
      throw new Error(updateError.message);
    }

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      lastName: updatedUser.last_name,
      cpf: updatedUser.cpf,
      phone: updatedUser.phone,
      gender: updatedUser.gender,
      birthDate: updatedUser.birth_date,
      isEmailVerified: updatedUser.is_email_verified,
      createdAt: updatedUser.created_at,
      updatedAt: updatedUser.updated_at,
    };
  }
}
