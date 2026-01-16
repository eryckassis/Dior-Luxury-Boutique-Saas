import { prisma } from "../config/database";

export class UserService {
  static async getProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        lastName: true,
        cpf: true,
        phone: true,
        gender: true,
        birthDate: true,
        isEmailVerified: true,
        createdAt: true,
        update: true,
      },
    });
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    return user;
  }

  static async updateProfile(userId, data) {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new Error("Usuário não encontrado");
    }

    if (data.cpf) {
      const cpfExist = await prisma.user.findFirst({
        where: {
          cpf: data.cpf,
          id: { not: userId },
        },
      });

      if (cpfExist) {
        throw new Error("CPF já cadastrado em outra conta");
      }
    }

    const updateData = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.lastName !== undefined)
      updateData.lastName = data.lastName || null;
    if (data.cpf !== undefined) updateData.cpf = data.cpf || null;
    if (data.phone !== undefined) updateData.phone = data.phone || null;
    if (data.gender !== undefined) updateData.gender = data.gender || null;
    if (data.birthDate !== undefined) {
      updateData.birthDate = data.birthDate ? new Date(data.birthDate) : null;
    }

    const updateUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        lastName: true,
        cpf: true,
        phone: true,
        gender: true,
        birthDate: true,
        isEmailVerified: true,
        createdAt: true,
        updateAt: true,
      },
    });

    return updateUser;
  }
}
