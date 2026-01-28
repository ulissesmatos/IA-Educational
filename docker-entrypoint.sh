#!/bin/sh
set -e

echo "🔄 Aguardando banco de dados..."
sleep 3

echo "📦 Executando migrations..."
npx prisma migrate deploy

echo "🌱 Executando seed..."
npx prisma db seed || echo "Seed já executado ou erro ignorado"

echo "🚀 Iniciando aplicação..."
npm start
