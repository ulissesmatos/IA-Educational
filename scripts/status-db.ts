#!/usr/bin/env node
/**
 * Script para verificar status do banco de dados
 * Mostra estatísticas e confirma que tudo está funcionando
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabaseStatus() {
  console.log('📊 Verificando status do banco de dados...\n');

  try {
    await prisma.$connect();

    // Contar registros em cada tabela
    const stats = {
      admin_users: await prisma.adminUser.count(),
      ai_categories: await prisma.aiCategory.count(),
      ai_tools: await prisma.aiTool.count(),
      questions: await prisma.question.count(),
      rooms: await prisma.room.count(),
      players: await prisma.player.count(),
      answers: await prisma.answer.count()
    };

    console.log('📈 Estatísticas do banco:');
    console.log(`   👤 Admin users: ${stats.admin_users}`);
    console.log(`   📁 Categorias IA: ${stats.ai_categories}`);
    console.log(`   🤖 Ferramentas IA: ${stats.ai_tools}`);
    console.log(`   ❓ Perguntas: ${stats.questions}`);
    console.log(`   🏠 Salas: ${stats.rooms}`);
    console.log(`   👥 Jogadores: ${stats.players}`);
    console.log(`   📝 Respostas: ${stats.answers}`);

    // Verificar se dados essenciais existem
    const hasAdmin = stats.admin_users > 0;
    const hasQuestions = stats.questions > 0;
    const hasAiTools = stats.ai_tools > 0;

    console.log('\n✅ Verificações:');
    console.log(`   ${hasAdmin ? '✅' : '❌'} Admin users criados`);
    console.log(`   ${hasQuestions ? '✅' : '❌'} Perguntas carregadas`);
    console.log(`   ${hasAiTools ? '✅' : '❌'} Catálogo IA carregado`);

    if (hasAdmin && hasQuestions && hasAiTools) {
      console.log('\n🎉 Banco de dados está pronto para uso!');
    } else {
      console.log('\n⚠️  Algumas verificações falharam. Execute "npm run db:init" novamente.');
    }

  } catch (error) {
    console.error('❌ Erro ao verificar status:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseStatus();