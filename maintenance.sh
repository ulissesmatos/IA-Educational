#!/bin/bash

# Comandos de manutenção para produção (sem make)

# Deploy da aplicação
deploy() {
    echo "🚀 Fazendo deploy da aplicação..."
    chmod +x deploy.sh
    ./deploy.sh
}

# Ver logs
logs() {
    echo "📋 Logs da aplicação:"
    docker compose -f docker-compose.prod.yml logs -f
}

# Parar aplicação
stop() {
    echo "🛑 Parando aplicação..."
    docker compose -f docker-compose.prod.yml down
}

# Reiniciar aplicação
restart() {
    echo "🔄 Reiniciando aplicação..."
    docker compose -f docker-compose.prod.yml restart
}

# Backup do banco
backup() {
    echo "💾 Criando backup do banco..."
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    docker exec ia-nas-escolas-db pg_dump -U ia_user iaounao > backup_${TIMESTAMP}.sql
    echo "✅ Backup criado: backup_${TIMESTAMP}.sql"
}

# Status dos containers
status() {
    echo "📊 Status dos containers:"
    docker compose -f docker-compose.prod.yml ps
}

# Limpar containers e volumes
clean() {
    echo "🧹 Limpando containers e volumes..."
    docker compose -f docker-compose.prod.yml down -v
    docker system prune -f
}

# Health check
health() {
    echo "🏥 Verificando saúde da aplicação..."
    if curl -f http://localhost/health > /dev/null 2>&1; then
        echo "✅ Aplicação saudável!"
    else
        echo "❌ Aplicação com problemas"
    fi
}

# Menu de ajuda
help() {
    echo "🛠️  Comandos de manutenção para IA nas Escolas"
    echo ""
    echo "Uso: ./maintenance.sh <comando>"
    echo ""
    echo "Comandos disponíveis:"
    echo "  deploy    - Deploy da aplicação"
    echo "  logs      - Ver logs da aplicação"
    echo "  stop      - Parar aplicação"
    echo "  restart   - Reiniciar aplicação"
    echo "  backup    - Criar backup do banco"
    echo "  status    - Ver status dos containers"
    echo "  clean     - Limpar containers e volumes"
    echo "  health    - Verificar saúde da aplicação"
    echo "  help      - Mostrar esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  ./maintenance.sh deploy"
    echo "  ./maintenance.sh logs"
    echo "  ./maintenance.sh backup"
}

# Executar comando
case "$1" in
    deploy) deploy ;;
    logs) logs ;;
    stop) stop ;;
    restart) restart ;;
    backup) backup ;;
    status) status ;;
    clean) clean ;;
    health) health ;;
    help|*) help ;;
esac