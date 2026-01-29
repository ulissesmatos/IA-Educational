.PHONY: deploy logs stop restart backup restore status clean

# Deploy da aplicação
deploy:
	@echo "🚀 Fazendo deploy da aplicação..."
	@chmod +x deploy.sh
	@./deploy.sh

# Ver logs
logs:
	@echo "📋 Logs da aplicação:"
	@docker compose -f docker-compose.prod.yml logs -f

# Parar aplicação
stop:
	@echo "🛑 Parando aplicação..."
	@docker compose -f docker-compose.prod.yml down

# Reiniciar aplicação
restart:
	@echo "🔄 Reiniciando aplicação..."
	@docker compose -f docker-compose.prod.yml restart

# Backup do banco
backup:
	@echo "💾 Criando backup do banco..."
	@docker exec ia-nas-escolas-db pg_dump -U ia_user iaounao > backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "✅ Backup criado: backup_$(shell date +%Y%m%d_%H%M%S).sql"

# Status dos containers
status:
	@echo "📊 Status dos containers:"
	@docker compose -f docker-compose.prod.yml ps

# Limpar containers e volumes
clean:
	@echo "🧹 Limpando containers e volumes..."
	@docker compose -f docker-compose.prod.yml down -v
	@docker system prune -f

# Health check
health:
	@echo "🏥 Verificando saúde da aplicação..."
	@curl -f http://localhost/health && echo "✅ Aplicação saudável!" || echo "❌ Aplicação com problemas"