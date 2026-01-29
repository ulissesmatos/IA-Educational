#!/usr/bin/env node
/**
 * Script de inicialização completa do banco de dados
 * Executa migrações, seed e verificação
 */

import { execSync } from 'child_process';

async function initDatabase() {
  console.log('🚀 Iniciando configuração completa do banco de dados...\n');

  try {
    // Gerar cliente Prisma
    console.log('📦 Gerando cliente Prisma...');
    execSync('npm run db:generate', { stdio: 'inherit' });

    // Executar migrações
    console.log('🗃️  Executando migrações...');
    execSync('npm run db:migrate', { stdio: 'inherit' });

    // Verificar e corrigir tabelas
    console.log('🔍 Verificando estrutura do banco...');
    execSync('npm run db:check', { stdio: 'inherit' });

    // Executar seed
    console.log('🌱 Executando seed...');
    execSync('npm run db:seed', { stdio: 'inherit' });

    console.log('\n🎉 Banco de dados inicializado com sucesso!');

  } catch (error) {
    console.error('\n❌ Erro na inicialização do banco:', error.message);
    process.exit(1);
  }
}

initDatabase();