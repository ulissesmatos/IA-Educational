#!/bin/sh
set -e

echo "🔄 Aguardando banco de dados ficar disponível..."

# Aguarda o PostgreSQL usando o próprio Prisma (máx 60s)
RETRIES=30
until node -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.\$connect().then(() => { p.\$disconnect(); process.exit(0); }).catch(() => process.exit(1));
" 2>/dev/null; do
  RETRIES=$((RETRIES - 1))
  if [ $RETRIES -eq 0 ]; then
    echo "❌ Banco de dados não respondeu. Abortando."
    exit 1
  fi
  echo "   ...aguardando (${RETRIES} tentativas restantes)"
  sleep 2
done

echo "✅ Banco disponível!"

echo "🗃️  Executando migrações..."
npx prisma migrate deploy

echo "🌱 Verificando questões..."
QUESTION_COUNT=$(node -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.question.count().then(c => { console.log(c); p.\$disconnect(); }).catch(() => { console.log(0); process.exit(0); });
" 2>/dev/null || echo "0")

if [ "$QUESTION_COUNT" = "0" ]; then
  echo "   Banco vazio — executando seed..."
  npm run db:seed
else
  echo "   $QUESTION_COUNT questões já existem — pulando seed."
fi

echo "🚀 Iniciando aplicação..."
exec npm start
