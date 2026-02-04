#!/bin/bash

# Script para migrar uploads existentes para o volume nomeado
# Uso: ./migrate-uploads.sh

set -e

PROJECT_NAME="ia-nas-escolas"
UPLOADS_DIR="./public/uploads"

echo "🔄 Migrando uploads para volume nomeado..."

# Verificar se a pasta uploads existe e tem arquivos
if [ ! -d "$UPLOADS_DIR" ]; then
    echo "❌ Pasta $UPLOADS_DIR não existe"
    exit 1
fi

# Contar arquivos existentes (excluindo .gitkeep)
FILE_COUNT=$(find "$UPLOADS_DIR" -type f -not -name ".gitkeep" | wc -l)
echo "📊 Encontrados $FILE_COUNT arquivos para migrar"

if [ "$FILE_COUNT" -eq 0 ]; then
    echo "ℹ️ Nenhum arquivo para migrar"
    exit 0
fi

# Verificar se containers estão rodando
if docker ps | grep -q "${PROJECT_NAME}-app"; then
    echo "🛑 Parando containers para migração..."
    docker compose -f docker-compose.prod.yml down
fi

echo "📁 Arquivos serão automaticamente disponíveis no volume 'uploads_data'"
echo "   quando o container for iniciado"
echo ""
echo "✅ Migração preparada. Execute o deploy normalmente."
echo ""
echo "📋 Resumo da migração:"
echo "   - Arquivos encontrados: $FILE_COUNT"
echo "   - Pasta: $UPLOADS_DIR"
echo "   - Volume Docker: uploads_data"
echo ""
echo "🚀 Execute: ./deploy.sh"