#!/usr/bin/env node
/**
 * Script para criar o primeiro usuário admin
 * Execute: npm run setup-admin
 */

import readline from 'readline';
import { AuthService } from '../src/admin/services/auth.service.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('\n🔐 Setup do Primeiro Usuário Admin\n');

  try {
    const name = await question('Nome: ');
    const email = await question('Email: ');
    const password = await question('Senha (mín. 6 caracteres): ');

    if (!name || !email || !password) {
      console.error('\n❌ Todos os campos são obrigatórios!');
      rl.close();
      process.exit(1);
    }

    if (password.length < 6) {
      console.error('\n❌ A senha deve ter no mínimo 6 caracteres!');
      rl.close();
      process.exit(1);
    }

    console.log('\n⏳ Criando usuário admin...');

    const user = await AuthService.createAdminUser(email, password, name);

    console.log('\n✅ Usuário admin criado com sucesso!');
    console.log(`\n📧 Email: ${user.email}`);
    console.log(`👤 Nome: ${user.name}`);
    console.log(`\n🔗 Acesse: http://localhost:3000/admin/login\n`);

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erro ao criar usuário:', error.message);
    rl.close();
    process.exit(1);
  }
}

main();
