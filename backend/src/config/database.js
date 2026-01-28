import { PrismaClient } from "@prisma/client";

/**
 * Configuração do Prisma Client
 * Singleton pattern para garantir única instância
 */

const prismaClienteSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

const globalForPrisma = global;
const prisma = globalForPrisma.prisma ?? prismaClienteSingleton();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
