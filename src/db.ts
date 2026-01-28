/**
 * Conexão com banco de dados PostgreSQL via Prisma
 */

import { PrismaClient } from '@prisma/client';

// Singleton do Prisma Client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Testa conexão com o banco
 */
export async function testConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Conexão com PostgreSQL estabelecida');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com PostgreSQL:', error);
    return false;
  }
}

/**
 * Fecha conexão com o banco
 */
export async function disconnect(): Promise<void> {
  await prisma.$disconnect();
}
