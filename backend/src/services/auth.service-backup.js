import bcrypt from "bcryptjs";
import crypto from "crypto";
import prisma from "../config/database.js";
import { config } from "../config/env.js";
import { JwtUtil } from "../utils/jwt.js";

export class AuthService {
  static async register({ name, email, password }) {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error(
        "Email já está cadastrado, por favor, use outro e-mail ou faça login com sua conta",
      );
    }

    const hashedPassword = await bcrypt.hash(password, config.bcryptSaltRounds);
    const emailVerifyToken = crypto.randomBytes(32).toString("hex");
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerifyToken,
        isEmailVerified: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });
    // aqui gera tokens automaticamente após registro
    const tokens = JwtUtil.generateTokenPair(user.id, user.email);

    // salva o refresh token no banco
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    return {
      user,
      tokens,
    };
  }

  static async login(email, password) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("E-mail ou senha incorretos.");
    }

    if (user.accountLockedUntil && user.accountLockedUntil > new Date()) {
      const unlockTime = new Date(user.accountLockedUntil).toLocaleString(
        "pt-BR",
      );
      throw new Error(
        `Conta bloqueada até ${unlockTime} devido a múltiplas tentativas de login`,
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const failedAttempts = user.failedLoginAttempts + 1;
      const maxAttempts = 5;
      if (failedAttempts >= maxAttempts) {
        const lockUntil = new Date();
        lockUntil.setMinutes(lockUntil.getMinutes() + 15);

        await prisma.user.update({
          where: { id: user.id },
          data: {
            failedLoginAttempts: failedAttempts,
            accountLockedUntil: lockUntil,
          },
        });

        throw new Error(
          "Muitas tentativas de login. Conta bloqueada por 15 minutos.",
        );
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: failedAttempts },
      });

      const remainingAttempts = maxAttempts - failedAttempts;
      throw new Error(
        `E-mail ou senha incorretos. Você tem mais ${remainingAttempts} tentativa(s).`,
      );
    }
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        accountLockedUntil: null,
      },
    });

    const tokens = JwtUtil.generateTokenPair(user.id, user.email);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
      tokens,
    };
  }

  static async logout(userId) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    return { message: "Logout realizado com sucesso" };
  }
  static async refreshToken(refreshToken) {
    console.log("🔄 Tentando refresh token...");

    const decoded = JwtUtil.verifyRefreshToken(refreshToken);
    console.log("✅ Token decodificado, userId:", decoded.userId);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      console.log("❌ Usuário não encontrado");
      throw new Error(
        "Refresh token inválido ou expirado. Por favor, faça login novamente.",
      );
    }

    console.log("📊 Comparação de tokens:");
    console.log(
      "   - Token recebido (primeiros 20 chars):",
      refreshToken?.substring(0, 20) + "...",
    );
    console.log(
      "   - Token no banco (primeiros 20 chars):",
      user.refreshToken?.substring(0, 20) + "...",
    );
    console.log("   - São iguais?", user.refreshToken === refreshToken);

    if (!user.refreshToken || user.refreshToken !== refreshToken) {
      console.log(
        "❌ Tokens não coincidem! Possível logout anterior ou login em outro dispositivo.",
      );
      throw new Error(
        "Refresh token inválido ou expirado. Por favor, faça login novamente.",
      );
    }

    const newTokens = JwtUtil.generateTokenPair(user.id, user.email);
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newTokens.refreshToken },
    });

    console.log("✅ Novo refresh token gerado e salvo");

    return {
      tokens: newTokens,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  static async verifyEmail(token) {
    const user = await prisma.user.findFirst({
      where: { emailVerifyToken: token },
    });

    if (!user) {
      throw new Error("Token de verificação inválido ou expirado");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerifyToken: null,
      },
    });

    return { message: "E-mail verificado com sucesso!" };
  }

  static async forgotPassword(email) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        message:
          "Se o e-mail existir, você receberá instruções para redefinir a senha.",
      };
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires,
      },
    });

    return {
      message:
        "Se o e-mail existir, você receberá instruções para redefinir a senha.",
    };
  }

  static async resetPassword(token, newPassword) {
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new Error("Token de recuperação inválido ou expirado.");
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      config.bcryptSaltRounds,
    );
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        refreshToken: null,
      },
    });

    return {
      message: "Senha redefinida com sucesso! Você já pode fazer login.",
    };
  }
  static async getUserById(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        isEmailVerified: true,
        createdAt: true,
        updateAt: true,
      },
    });
    if (!user) {
      throw new Error("Usuário não encontrado.");
    }
    return user;
  }
}
