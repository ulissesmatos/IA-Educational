#!/usr/bin/env node
/**
 * Script para verificar e corrigir o banco de dados
 * Garante que todas as tabelas necessárias existam
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAndCreateTables() {
  console.log('🔍 Verificando estrutura do banco de dados...\n');

  try {
    // Verificar conexão
    await prisma.$connect();
    console.log('✅ Conexão com banco estabelecida');

    // Verificar tabelas essenciais
    const tables = [
      'admin_users',
      'ai_categories',
      'ai_tools',
      'questions',
      'rooms',
      'players',
      'answers',
      'session'
    ];

    for (const table of tables) {
      try {
        const result = await prisma.$queryRaw`SELECT 1 FROM ${prisma.$queryRaw(table)} LIMIT 1`;
        console.log(`✅ Tabela ${table} existe`);
      } catch (error) {
        console.log(`❌ Tabela ${table} não encontrada - criando...`);

        // Criar tabelas faltantes
        if (table === 'admin_users') {
          await createAdminUsersTable();
        } else if (table === 'session') {
          await createSessionTable();
        } else {
          console.log(`⚠️  Tabela ${table} precisa ser criada via migração`);
        }
      }
    }

    console.log('\n🎉 Verificação concluída!');

  } catch (error) {
    console.error('❌ Erro na verificação:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function createAdminUsersTable() {
  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT NOT NULL,
      email VARCHAR(255) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(150) NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT true,
      last_login_at TIMESTAMP(3),
      created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP(3) NOT NULL,
      CONSTRAINT admin_users_pkey PRIMARY KEY (id)
    );
  `;

  await prisma.$executeRaw`
    CREATE UNIQUE INDEX IF NOT EXISTS admin_users_email_key ON admin_users(email);
  `;

  await prisma.$executeRaw`
    CREATE INDEX IF NOT EXISTS admin_users_email_idx ON admin_users(email);
  `;

  await prisma.$executeRaw`
    CREATE INDEX IF NOT EXISTS admin_users_is_active_idx ON admin_users(is_active);
  `;

  console.log('✅ Tabela admin_users criada');
}

async function createSessionTable() {
  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS session (
      sid VARCHAR(255) NOT NULL,
      sess JSON NOT NULL,
      expire TIMESTAMP(6) NOT NULL,
      CONSTRAINT session_pkey PRIMARY KEY (sid)
    );
  `;

  await prisma.$executeRaw`
    CREATE INDEX IF NOT EXISTS idx_session_expire ON session(expire);
  `;

  console.log('✅ Tabela session criada');
}

checkAndCreateTables();