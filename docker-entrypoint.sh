#!/bin/sh
set -e

echo "🔄 Aguardando banco de dados..."
sleep 3

echo "� Inicializando banco de dados..."
npm run db:init

echo "🚀 Iniciando aplicação..."
npm start
