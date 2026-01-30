/**
 * Conexão com banco de dados PostgreSQL via Prisma
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Detecta se estamos rodando dentro de um container Docker
const isDocker = process.env.IS_DOCKER === 'true' ||
                 fs.existsSync('/.dockerenv') ||
                 fs.existsSync(path.join(__dirname, '../../docker-compose.yml'));

// Ajusta DATABASE_URL baseado no ambiente
if (!process.env.DATABASE_URL) {
  if (isDocker) {
    // Dentro do Docker, usa o nome do serviço
    process.env.DATABASE_URL = 'postgresql://postgres:postgres@postgres:5432/iaounao';
  } else {
    // Desenvolvimento local, usa localhost
    process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/iaounao';
  }
}

console.log(`🔍 Ambiente detectado: ${isDocker ? 'Docker' : 'Local'}`);
console.log(`📍 DATABASE_URL: ${process.env.DATABASE_URL.replace(/:[^:]+@/, ':***@')}`);

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

    if (!isDocker) {
      console.log('\n💡 Para desenvolvimento local, você pode:');
      console.log('   1. Instalar PostgreSQL localmente');
      console.log('   2. Ou usar Docker apenas para o banco:');
      console.log('      docker run --name postgres-dev -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=iaounao -p 5432:5432 -d postgres:16-alpine');
      console.log('   3. Ou usar o comando: npm run dev:docker (app + banco juntos)\n');
    }

    return false;
  }
}

/**
 * Fecha conexão com o banco
 */
export async function disconnect(): Promise<void> {
  await prisma.$disconnect();
}
