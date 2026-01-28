const bcrypt = require('bcrypt');

async function generateHash() {
  const password = 'admin123456';
  const hash = await bcrypt.hash(password, 12);
  console.log('Hash gerado:', hash);
  console.log('\nSQL para atualizar:');
  console.log(`UPDATE "AdminUser" SET "passwordHash" = '${hash}', "updatedAt" = NOW() WHERE email = 'admin@iaounao.com';`);
}

generateHash().catch(console.error);
