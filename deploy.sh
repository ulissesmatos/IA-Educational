#!/bin/bash

# Script de deploy para produção
# Uso: ./deploy.sh [ambiente]

set -e

ENVIRONMENT=${1:-production}
PROJECT_NAME="ia-nas-escolas"

echo "🚀 Iniciando deploy para $ENVIRONMENT..."

# Verificar se estamos no diretório correto
if [ ! -f "docker-compose.prod.yml" ]; then
    echo "❌ Execute este script do diretório raiz do projeto"
    exit 1
fi

# Verificar se .env existe
if [ ! -f ".env" ]; then
    echo "❌ Arquivo .env não encontrado. Copie .env.prod para .env e configure as variáveis:"
    echo "   cp .env.prod .env"
    echo "   nano .env"
    exit 1
fi

# Criar backup do banco se existir
echo "💾 Criando backup do banco..."
if docker ps | grep -q "${PROJECT_NAME}-db"; then
    docker exec ${PROJECT_NAME}-db pg_dump -U ia_user iaounao > backup_$(date +%Y%m%d_%H%M%S).sql
    echo "✅ Backup criado"
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."

# Registrar commit atual e exportar para ser usado como build-arg / env
GIT_COMMIT=$(git rev-parse --short HEAD || echo "unknown")
echo "🔖 Git commit: $GIT_COMMIT"
export GIT_COMMIT

docker compose -f docker-compose.prod.yml down

# Limpar imagens não utilizadas (opcional)
echo "🧹 Limpando imagens não utilizadas..."
docker image prune -f

# Build e start dos containers
echo "🏗️  Construindo e iniciando containers..."
docker compose -f docker-compose.prod.yml up -d --build

# Aguardar banco ficar pronto
echo "⏳ Aguardando banco de dados..."
sleep 30

# Verificar se containers estão rodando
echo "🔍 Verificando status dos containers..."
docker compose -f docker-compose.prod.yml ps

# Executar health checks
echo "🏥 Executando health checks..."
# Primeiro tenta o host (Nginx)
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo "✅ Aplicação está saudável (via host)!"
else
    # Se falhar, tenta dentro do container app para checar a aplicação interna
    echo "🔁 Tentando health-check dentro do container..."
    if docker compose -f docker-compose.prod.yml exec -T app curl -f http://localhost:3000/health > /dev/null 2>&1; then
        echo "✅ Aplicação está saudável (via container)!"
    else
        echo "❌ Aplicação não está respondendo. Verifique os logs:"
        docker compose -f docker-compose.prod.yml logs app
        exit 1
    fi
fi

echo ""
echo "🎉 Deploy concluído com sucesso!"
echo "🌐 A aplicação está rodando em: http://ia.nuveasy.com"
echo ""
echo "📊 Para ver logs: docker compose -f docker-compose.prod.yml logs -f"
echo "🛑 Para parar: docker compose -f docker-compose.prod.yml down"
echo "🔄 Para atualizar: ./deploy.sh"